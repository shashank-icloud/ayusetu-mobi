import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
    Switch,
} from 'react-native';
import { phrService } from '../../services/phrService';
import type {
    ConsentRequest,
    ConsentRiskWarning,
    GranularDataSelection,
    HealthRecordType,
} from '../../../backend/types/phr';

/**
 * ConsentInboxScreen - Advanced Consent Management (Category 4)
 * 
 * Features:
 * - Consent inbox with all requests
 * - Purpose-based filtering
 * - Risk-based warnings
 * - Granular data selection
 * - Time-bound access display
 * - One-tap approval
 * - Consent templates integration
 */

export default function ConsentInboxScreen() {
    const [requests, setRequests] = useState<ConsentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<ConsentRequest | null>(null);
    const [riskWarning, setRiskWarning] = useState<ConsentRiskWarning | null>(null);
    const [showGranularSelection, setShowGranularSelection] = useState(false);
    const [granularSelection, setGranularSelection] = useState<GranularDataSelection>({
        recordIds: [],
        dataTypes: [],
        dateRange: { from: '', to: '' },
        excludedRecords: [],
        includeSensitive: false,
    });
    const [filterPurpose, setFilterPurpose] = useState<string>('all');

    useEffect(() => {
        loadConsentRequests();
    }, []);

    const loadConsentRequests = async () => {
        try {
            setLoading(true);
            const data = await phrService.getConsentRequests();
            setRequests(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load consent requests');
            console.error('Load consent requests error:', error);
        } finally {
            setLoading(false);
        }
    };

    const analyzeRisk = async (request: ConsentRequest) => {
        try {
            const warning = await phrService.analyzeConsentRisk(request);
            setRiskWarning(warning);
        } catch (error) {
            console.error('Risk analysis error:', error);
        }
    };

    const handleRequestPress = async (request: ConsentRequest) => {
        setSelectedRequest(request);
        await analyzeRisk(request);
    };

    const handleOneTapApproval = async (request: ConsentRequest) => {
        Alert.alert(
            'Quick Approval',
            `Approve consent for ${request.requesterName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Approve',
                    onPress: async () => {
                        try {
                            await phrService.approveConsent(request.id);
                            Alert.alert('Success', 'Consent approved successfully');
                            loadConsentRequests();
                            setSelectedRequest(null);
                        } catch (error) {
                            Alert.alert('Error', 'Failed to approve consent');
                        }
                    },
                },
            ]
        );
    };

    const handleGranularApproval = async () => {
        if (!selectedRequest) return;

        // Validate granular selection
        if (granularSelection.dataTypes.length === 0) {
            Alert.alert('Error', 'Please select at least one data type');
            return;
        }

        try {
            await phrService.approveConsentWithGranularSelection(
                selectedRequest.id,
                granularSelection
            );
            Alert.alert('Success', 'Consent approved with custom selection');
            loadConsentRequests();
            setSelectedRequest(null);
            setShowGranularSelection(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to approve consent');
        }
    };

    const handleDeny = async (request: ConsentRequest) => {
        Alert.alert(
            'Deny Consent',
            'Are you sure you want to deny this request?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Deny',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await phrService.denyConsent(request.id, 'User denied');
                            Alert.alert('Success', 'Consent denied');
                            loadConsentRequests();
                            setSelectedRequest(null);
                        } catch (error) {
                            Alert.alert('Error', 'Failed to deny consent');
                        }
                    },
                },
            ]
        );
    };

    const toggleDataType = (dataType: HealthRecordType) => {
        setGranularSelection(prev => {
            const exists = prev.dataTypes.includes(dataType);
            return {
                ...prev,
                dataTypes: exists
                    ? prev.dataTypes.filter(dt => dt !== dataType)
                    : [...prev.dataTypes, dataType],
            };
        });
    };

    const getRiskColor = (level: ConsentRiskWarning['level']) => {
        switch (level) {
            case 'low': return '#4CAF50';
            case 'medium': return '#FF9800';
            case 'high': return '#F44336';
            case 'critical': return '#D32F2F';
            default: return '#999';
        }
    };

    const getPurposeIcon = (purpose: string) => {
        switch (purpose) {
            case 'treatment': return '🏥';
            case 'insurance': return '🛡️';
            case 'research': return '🔬';
            case 'emergency': return '🚑';
            default: return '📋';
        }
    };

    const filteredRequests = filterPurpose === 'all'
        ? requests
        : requests.filter(r => r.purpose === filterPurpose);

    const pendingCount = requests.filter(r => r.status === 'pending').length;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading consent requests...</Text>
            </View>
        );
    }

    if (selectedRequest) {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.detailContainer}>
                    <View style={styles.detailHeader}>
                        <Text style={styles.detailTitle}>{selectedRequest.requesterName}</Text>
                        <Text style={styles.detailPurpose}>
                            {getPurposeIcon(selectedRequest.purpose)} {selectedRequest.purpose.toUpperCase()}
                        </Text>
                    </View>

                    {riskWarning && (
                        <View style={[styles.riskWarning, { borderLeftColor: getRiskColor(riskWarning.level) }]}>
                            <Text style={styles.riskLevel}>
                                {riskWarning.level.toUpperCase()} RISK
                            </Text>
                            <Text style={styles.riskMessage}>{riskWarning.message}</Text>

                            <Text style={styles.riskSectionTitle}>Reasons:</Text>
                            {riskWarning.reasons.map((reason, idx) => (
                                <Text key={idx} style={styles.riskItem}>• {reason}</Text>
                            ))}

                            <Text style={styles.riskSectionTitle}>Recommendations:</Text>
                            {riskWarning.recommendations.map((rec, idx) => (
                                <Text key={idx} style={styles.riskItem}>• {rec}</Text>
                            ))}
                        </View>
                    )}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Requested Data Types:</Text>
                        {selectedRequest.dataTypes.map((dt, idx) => (
                            <Text key={idx} style={styles.dataTypeItem}>• {dt}</Text>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Access Period:</Text>
                        <Text style={styles.dateText}>From: {selectedRequest.fromDate}</Text>
                        <Text style={styles.dateText}>To: {selectedRequest.toDate}</Text>
                        <Text style={styles.expiryText}>Expires: {selectedRequest.expiryDate}</Text>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.granularToggle}>
                            <Text style={styles.sectionTitle}>Customize Data Selection</Text>
                            <Switch
                                value={showGranularSelection}
                                onValueChange={setShowGranularSelection}
                            />
                        </View>

                        {showGranularSelection && (
                            <View style={styles.granularSection}>
                                <Text style={styles.granularTitle}>Select Data Types to Share:</Text>
                                {(['opd_prescription', 'lab_report', 'imaging', 'ipd_discharge_summary', 'vaccination'] as HealthRecordType[]).map(dt => (
                                    <TouchableOpacity
                                        key={dt}
                                        style={styles.checkboxRow}
                                        onPress={() => toggleDataType(dt)}
                                    >
                                        <View style={styles.checkbox}>
                                            {granularSelection.dataTypes.includes(dt) && (
                                                <Text style={styles.checkmark}>✓</Text>
                                            )}
                                        </View>
                                        <Text style={styles.checkboxLabel}>
                                            {dt.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </Text>
                                    </TouchableOpacity>
                                ))}

                                <View style={styles.sensitiveToggle}>
                                    <Text style={styles.checkboxLabel}>Include sensitive records</Text>
                                    <Switch
                                        value={granularSelection.includeSensitive}
                                        onValueChange={(value) =>
                                            setGranularSelection(prev => ({ ...prev, includeSensitive: value }))
                                        }
                                    />
                                </View>
                            </View>
                        )}
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.button, styles.denyButton]}
                            onPress={() => handleDeny(selectedRequest)}
                        >
                            <Text style={styles.buttonText}>Deny</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.approveButton]}
                            onPress={
                                showGranularSelection
                                    ? handleGranularApproval
                                    : () => handleOneTapApproval(selectedRequest)
                            }
                        >
                            <Text style={styles.buttonText}>
                                {showGranularSelection ? 'Approve Custom' : 'Approve'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            setSelectedRequest(null);
                            setShowGranularSelection(false);
                            setRiskWarning(null);
                        }}
                    >
                        <Text style={styles.backButtonText}>← Back to Inbox</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Consent Inbox</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{pendingCount} Pending</Text>
                </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
                {['all', 'treatment', 'insurance', 'research', 'emergency'].map(purpose => (
                    <TouchableOpacity
                        key={purpose}
                        style={[
                            styles.filterChip,
                            filterPurpose === purpose && styles.filterChipActive,
                        ]}
                        onPress={() => setFilterPurpose(purpose)}
                    >
                        <Text style={[
                            styles.filterChipText,
                            filterPurpose === purpose && styles.filterChipTextActive,
                        ]}>
                            {purpose === 'all' ? 'All' : getPurposeIcon(purpose) + ' ' + purpose.charAt(0).toUpperCase() + purpose.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <FlatList
                data={filteredRequests}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.requestCard}
                        onPress={() => handleRequestPress(item)}
                    >
                        <View style={styles.requestHeader}>
                            <Text style={styles.requesterName}>{item.requesterName}</Text>
                            <View style={[
                                styles.statusBadge,
                                item.status === 'pending' && styles.statusPending,
                                item.status === 'approved' && styles.statusApproved,
                                item.status === 'denied' && styles.statusDenied,
                            ]}>
                                <Text style={styles.statusText}>{item.status}</Text>
                            </View>
                        </View>

                        <Text style={styles.purposeText}>
                            {getPurposeIcon(item.purpose)} {item.purpose.toUpperCase()}
                        </Text>

                        <Text style={styles.dataTypesText}>
                            {item.dataTypes.length} data types • Expires {item.expiryDate}
                        </Text>

                        {item.status === 'pending' && (
                            <View style={styles.quickActions}>
                                <TouchableOpacity
                                    style={styles.quickApprove}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        handleOneTapApproval(item);
                                    }}
                                >
                                    <Text style={styles.quickApproveText}>✓ Quick Approve</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>📭</Text>
                        <Text style={styles.emptyMessage}>No consent requests</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    badge: {
        backgroundColor: '#FF9800',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    filterContainer: {
        backgroundColor: '#FFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: '#007AFF',
    },
    filterChipText: {
        fontSize: 14,
        color: '#666',
    },
    filterChipTextActive: {
        color: '#FFF',
        fontWeight: '600',
    },
    requestCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginTop: 12,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    requestHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    requesterName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusPending: {
        backgroundColor: '#FFF3E0',
    },
    statusApproved: {
        backgroundColor: '#E8F5E9',
    },
    statusDenied: {
        backgroundColor: '#FFEBEE',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    purposeText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
        marginBottom: 4,
    },
    dataTypesText: {
        fontSize: 14,
        color: '#666',
    },
    quickActions: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    quickApprove: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    quickApproveText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyMessage: {
        fontSize: 18,
        color: '#666',
    },
    detailContainer: {
        padding: 16,
    },
    detailHeader: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    detailTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    detailPurpose: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    riskWarning: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        marginBottom: 16,
    },
    riskLevel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    riskMessage: {
        fontSize: 16,
        color: '#333',
        marginBottom: 12,
    },
    riskSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginTop: 8,
        marginBottom: 4,
    },
    riskItem: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        marginBottom: 2,
    },
    section: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    dataTypeItem: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    expiryText: {
        fontSize: 14,
        color: '#FF9800',
        fontWeight: '600',
        marginTop: 4,
    },
    granularToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    granularSection: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    granularTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#007AFF',
        borderRadius: 4,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#333',
    },
    sensitiveToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    denyButton: {
        backgroundColor: '#F44336',
    },
    approveButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 12,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },
});
