import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, Modal, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { phrService, ConsentRequest, ConsentArtifact } from '../../services/phrService';

type Props = NativeStackScreenProps<RootStackParamList, 'ConsentManagement'>;

export default function ConsentManagementScreen({ navigation }: Props) {
    const [activeTab, setActiveTab] = useState<'requests' | 'active'>('requests');
    const [requests, setRequests] = useState<ConsentRequest[]>([]);
    const [activeConsents, setActiveConsents] = useState<ConsentArtifact[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<ConsentRequest | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (activeTab === 'requests') {
                const data = await phrService.getConsentRequests('12-3456-7890-1234');
                setRequests(data);
            } else {
                const data = await phrService.getActiveConsents('12-3456-7890-1234');
                setActiveConsents(data);
            }
        } catch (error) {
            console.error('Error fetching consent data:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const handleApprove = async (consentId: string) => {
        try {
            await phrService.approveConsent(consentId);
            console.log('✅ Consent approved:', consentId);
            fetchData();
            setShowDetailsModal(false);
        } catch (error) {
            console.error('Error approving consent:', error);
        }
    };

    const handleDeny = async (consentId: string) => {
        try {
            await phrService.denyConsent(consentId, 'User declined');
            console.log('❌ Consent denied:', consentId);
            fetchData();
            setShowDetailsModal(false);
        } catch (error) {
            console.error('Error denying consent:', error);
        }
    };

    const handleRevoke = async (consentId: string) => {
        try {
            await phrService.revokeConsent(consentId);
            console.log('🔒 Consent revoked:', consentId);
            fetchData();
        } catch (error) {
            console.error('Error revoking consent:', error);
        }
    };

    const getPurposeIcon = (purpose: string) => {
        const icons: Record<string, string> = {
            treatment: '🏥',
            insurance: '🛡️',
            research: '🔬',
            emergency: '🚨',
        };
        return icons[purpose] || '📋';
    };

    const getRequesterIcon = (type: string) => {
        const icons: Record<string, string> = {
            doctor: '👨‍⚕️',
            hospital: '🏥',
            lab: '🧪',
            insurance: '🛡️',
        };
        return icons[type] || '👤';
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Consent Management</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
                    onPress={() => setActiveTab('requests')}
                >
                    <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>
                        Requests ({requests.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'active' && styles.tabActive]}
                    onPress={() => setActiveTab('active')}
                >
                    <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
                        Active ({activeConsents.length})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {activeTab === 'requests' ? (
                    // Consent Requests
                    <View style={styles.section}>
                        {requests.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyIcon}>✅</Text>
                                <Text style={styles.emptyText}>No pending requests</Text>
                                <Text style={styles.emptySubtext}>Consent requests will appear here</Text>
                            </View>
                        ) : (
                            requests.map(request => (
                                <TouchableOpacity
                                    key={request.id}
                                    style={styles.requestCard}
                                    onPress={() => {
                                        setSelectedRequest(request);
                                        setShowDetailsModal(true);
                                    }}
                                >
                                    <View style={styles.requestHeader}>
                                        <View style={styles.requesterInfo}>
                                            <Text style={styles.requesterIcon}>
                                                {getRequesterIcon(request.requesterType)}
                                            </Text>
                                            <View>
                                                <Text style={styles.requesterName}>{request.requesterName}</Text>
                                                <Text style={styles.requesterType}>
                                                    {request.requesterType.charAt(0).toUpperCase() + request.requesterType.slice(1)}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.purposeBadge}>
                                            <Text style={styles.purposeIcon}>{getPurposeIcon(request.purpose)}</Text>
                                            <Text style={styles.purposeText}>{request.purpose}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.requestDetails}>
                                        <Text style={styles.detailLabel}>Data Types:</Text>
                                        <Text style={styles.detailValue}>{request.dataTypes.join(', ')}</Text>
                                        <Text style={styles.detailLabel}>Duration:</Text>
                                        <Text style={styles.detailValue}>
                                            {request.fromDate} to {request.toDate}
                                        </Text>
                                    </View>

                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity
                                            style={styles.approveButton}
                                            onPress={() => handleApprove(request.id)}
                                        >
                                            <Text style={styles.approveButtonText}>✓ Approve</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.denyButton}
                                            onPress={() => handleDeny(request.id)}
                                        >
                                            <Text style={styles.denyButtonText}>✗ Deny</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                ) : (
                    // Active Consents
                    <View style={styles.section}>
                        {activeConsents.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyIcon}>🔒</Text>
                                <Text style={styles.emptyText}>No active consents</Text>
                                <Text style={styles.emptySubtext}>Approved consents will appear here</Text>
                            </View>
                        ) : (
                            activeConsents.map(consent => (
                                <View key={consent.id} style={styles.consentCard}>
                                    <View style={styles.consentHeader}>
                                        <Text style={styles.consentName}>{consent.requesterName}</Text>
                                        <View style={[
                                            styles.statusBadge,
                                            consent.status === 'active' && styles.statusActive,
                                            consent.status === 'expired' && styles.statusExpired,
                                        ]}>
                                            <Text style={styles.statusText}>{consent.status}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.consentInfo}>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>Purpose:</Text>
                                            <Text style={styles.infoValue}>{consent.purpose}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>Data Types:</Text>
                                            <Text style={styles.infoValue}>{consent.dataTypes.join(', ')}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>Granted:</Text>
                                            <Text style={styles.infoValue}>{consent.grantedDate}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>Expires:</Text>
                                            <Text style={styles.infoValue}>{consent.expiryDate}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.infoLabel}>Access Count:</Text>
                                            <Text style={styles.infoValue}>{consent.accessCount} times</Text>
                                        </View>
                                        {consent.lastAccessedDate && (
                                            <View style={styles.infoRow}>
                                                <Text style={styles.infoLabel}>Last Access:</Text>
                                                <Text style={styles.infoValue}>{consent.lastAccessedDate}</Text>
                                            </View>
                                        )}
                                    </View>

                                    {consent.status === 'active' && (
                                        <TouchableOpacity
                                            style={styles.revokeButton}
                                            onPress={() => handleRevoke(consent.consentId)}
                                        >
                                            <Text style={styles.revokeButtonText}>🔒 Revoke Access</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))
                        )}
                    </View>
                )}
            </ScrollView>

            {/* Details Modal */}
            {selectedRequest && (
                <Modal
                    visible={showDetailsModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowDetailsModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Consent Request Details</Text>
                            
                            <View style={styles.modalSection}>
                                <Text style={styles.modalLabel}>Requester:</Text>
                                <Text style={styles.modalValue}>{selectedRequest.requesterName}</Text>
                            </View>

                            <View style={styles.modalSection}>
                                <Text style={styles.modalLabel}>Purpose:</Text>
                                <Text style={styles.modalValue}>{selectedRequest.purpose}</Text>
                            </View>

                            <View style={styles.modalSection}>
                                <Text style={styles.modalLabel}>Data Access:</Text>
                                {selectedRequest.dataTypes.map((type, index) => (
                                    <Text key={index} style={styles.modalListItem}>• {type}</Text>
                                ))}
                            </View>

                            <View style={styles.modalSection}>
                                <Text style={styles.modalLabel}>Duration:</Text>
                                <Text style={styles.modalValue}>
                                    From: {selectedRequest.fromDate}{'\n'}
                                    To: {selectedRequest.toDate}
                                </Text>
                            </View>

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={styles.modalApproveButton}
                                    onPress={() => handleApprove(selectedRequest.id)}
                                >
                                    <Text style={styles.modalApproveText}>✓ Approve</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalDenyButton}
                                    onPress={() => handleDeny(selectedRequest.id)}
                                >
                                    <Text style={styles.modalDenyText}>✗ Deny</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setShowDetailsModal(false)}
                            >
                                <Text style={styles.modalCloseText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        fontSize: 28,
        color: '#000',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: '#000',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
    },
    tabTextActive: {
        color: '#000',
        fontWeight: '700',
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
    },
    requestCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    requestHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    requesterInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    requesterIcon: {
        fontSize: 40,
        marginRight: 12,
    },
    requesterName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    requesterType: {
        fontSize: 14,
        color: '#666',
    },
    purposeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff3e0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    purposeIcon: {
        fontSize: 16,
        marginRight: 4,
    },
    purposeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#f57c00',
        textTransform: 'capitalize',
    },
    requestDetails: {
        marginBottom: 16,
    },
    detailLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 8,
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    approveButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    approveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    denyButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#F44336',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    denyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#F44336',
    },
    consentCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    consentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    consentName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusActive: {
        backgroundColor: '#e8f5e9',
    },
    statusExpired: {
        backgroundColor: '#ffebee',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2e7d32',
        textTransform: 'uppercase',
    },
    consentInfo: {
        marginBottom: 16,
    },
    infoRow: {
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 12,
        color: '#888',
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        marginTop: 2,
    },
    revokeButton: {
        backgroundColor: '#ffebee',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    revokeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#c62828',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 20,
    },
    modalSection: {
        marginBottom: 16,
    },
    modalLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    modalValue: {
        fontSize: 16,
        color: '#000',
    },
    modalListItem: {
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
        marginTop: 4,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    modalApproveButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalApproveText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    modalDenyButton: {
        flex: 1,
        backgroundColor: '#F44336',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalDenyText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    modalCloseButton: {
        marginTop: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    modalCloseText: {
        fontSize: 16,
        color: '#666',
    },
});
