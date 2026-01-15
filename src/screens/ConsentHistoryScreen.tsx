import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { complianceService } from '../services/complianceService';
import type { ConsentAuditLog, ConsentTimelineEntry } from '../services/complianceService';

const ConsentHistoryScreen: React.FC = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<ConsentAuditLog[]>([]);
    const [selectedConsentId, setSelectedConsentId] = useState<string | null>(null);
    const [timeline, setTimeline] = useState<ConsentTimelineEntry[]>([]);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const data = await complianceService.getConsentAuditLogs({
                userId: 'user-001',
            });
            setLogs(data);
        } catch (error) {
            console.error('Error loading consent history:', error);
            Alert.alert('Error', 'Failed to load consent history');
        } finally {
            setLoading(false);
        }
    };

    const loadTimeline = async (consentId: string) => {
        try {
            const data = await complianceService.getConsentTimeline({
                userId: 'user-001',
                consentId,
            });
            setTimeline(data);
            setSelectedConsentId(consentId);
        } catch (error) {
            console.error('Error loading consent timeline:', error);
            Alert.alert('Error', 'Failed to load consent timeline');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'granted': return '✅';
            case 'denied': return '❌';
            case 'revoked': return '🚫';
            case 'expired': return '⏰';
            case 'used': return '👁️';
            case 'created': return '📝';
            case 'modified': return '✏️';
            default: return '📋';
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'granted': return '#10b981';
            case 'denied': return '#ef4444';
            case 'revoked': return '#f59e0b';
            case 'expired': return '#9ca3af';
            case 'used': return '#3b82f6';
            case 'created': return '#8b5cf6';
            case 'modified': return '#14b8a6';
            default: return '#6b7280';
        }
    };

    const groupedLogs = logs.reduce((acc, log) => {
        if (!acc[log.consentId]) {
            acc[log.consentId] = [];
        }
        acc[log.consentId].push(log);
        return acc;
    }, {} as Record<string, ConsentAuditLog[]>);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading consent history...</Text>
            </View>
        );
    }

    if (selectedConsentId && timeline.length > 0) {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        setSelectedConsentId(null);
                        setTimeline([]);
                    }}
                >
                    <Text style={styles.backButtonText}>← Back to History</Text>
                </TouchableOpacity>

                <ScrollView style={styles.content}>
                    <Text style={styles.timelineTitle}>Consent Timeline</Text>
                    {timeline.map((entry, index) => (
                        <View key={entry.id} style={styles.timelineEntry}>
                            <View style={styles.timelineDot} />
                            {index < timeline.length - 1 && <View style={styles.timelineLine} />}

                            <View style={styles.timelineContent}>
                                <View style={styles.timelineHeader}>
                                    <Text style={styles.timelineIcon}>{getActionIcon(entry.eventType)}</Text>
                                    <View style={styles.timelineHeaderInfo}>
                                        <Text style={styles.timelineEventType}>
                                            {entry.eventType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </Text>
                                        <Text style={styles.timelineTime}>{formatDate(entry.timestamp)}</Text>
                                    </View>
                                </View>

                                <Text style={styles.timelineDescription}>{entry.description}</Text>

                                {entry.requestedBy && (
                                    <Text style={styles.timelineMeta}>Requested by: {entry.requestedBy}</Text>
                                )}
                                {entry.usedBy && (
                                    <Text style={styles.timelineMeta}>Used by: {entry.usedBy}</Text>
                                )}
                                {entry.recordsAccessed && (
                                    <Text style={styles.timelineMeta}>Records accessed: {entry.recordsAccessed}</Text>
                                )}
                                {entry.expiryDate && (
                                    <Text style={styles.timelineMeta}>
                                        Expires: {formatDate(entry.expiryDate)}
                                    </Text>
                                )}
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Consent History</Text>
                <Text style={styles.headerSubtitle}>
                    Track all consent requests and actions
                </Text>
            </View>

            {Object.entries(groupedLogs).map(([consentId, consentLogs]) => {
                const latestLog = consentLogs[0];
                const actionsCount = consentLogs.length;

                return (
                    <View key={consentId} style={styles.consentCard}>
                        <View style={styles.consentHeader}>
                            <View style={styles.consentHeaderLeft}>
                                <Text style={styles.consentIcon}>{getActionIcon(latestLog.action)}</Text>
                                <View style={styles.consentHeaderInfo}>
                                    <Text style={styles.requesterName}>{latestLog.requestedBy.name}</Text>
                                    {latestLog.requestedBy.facilityName && (
                                        <Text style={styles.facilityName}>{latestLog.requestedBy.facilityName}</Text>
                                    )}
                                </View>
                            </View>
                            <View
                                style={[
                                    styles.statusBadge,
                                    { backgroundColor: getActionColor(latestLog.action) },
                                ]}
                            >
                                <Text style={styles.statusBadgeText}>
                                    {latestLog.action.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.consentBody}>
                            <View style={styles.purposeRow}>
                                <Text style={styles.purposeLabel}>Purpose:</Text>
                                <Text style={styles.purposeValue}>{latestLog.purpose}</Text>
                            </View>

                            {latestLog.dataTypes && latestLog.dataTypes.length > 0 && (
                                <View style={styles.dataTypesRow}>
                                    <Text style={styles.dataTypesLabel}>Data types:</Text>
                                    <View style={styles.dataTypesTags}>
                                        {latestLog.dataTypes.map((type, index) => (
                                            <View key={index} style={styles.dataTypeTag}>
                                                <Text style={styles.dataTypeTagText}>{type}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {latestLog.dateRange && (
                                <View style={styles.dateRangeRow}>
                                    <Text style={styles.dateRangeLabel}>Date range:</Text>
                                    <Text style={styles.dateRangeValue}>
                                        {new Date(latestLog.dateRange.from).toLocaleDateString('en-IN')} -{' '}
                                        {new Date(latestLog.dateRange.to).toLocaleDateString('en-IN')}
                                    </Text>
                                </View>
                            )}

                            {latestLog.expiryDate && (
                                <View style={styles.expiryRow}>
                                    <Text style={styles.expiryLabel}>Expires:</Text>
                                    <Text style={styles.expiryValue}>{formatDate(latestLog.expiryDate)}</Text>
                                </View>
                            )}

                            <View style={styles.consentFooter}>
                                <Text style={styles.actionsCount}>
                                    {actionsCount} action{actionsCount > 1 ? 's' : ''}
                                </Text>
                                <TouchableOpacity onPress={() => loadTimeline(consentId)}>
                                    <Text style={styles.viewTimelineButton}>View Timeline →</Text>
                                </TouchableOpacity>
                            </View>

                            {latestLog.details && (
                                <View style={styles.detailsBox}>
                                    <Text style={styles.detailsText}>{latestLog.details}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                );
            })}

            {logs.length === 0 && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>📜</Text>
                    <Text style={styles.emptyText}>No consent history</Text>
                    <Text style={styles.emptySubtext}>
                        Your consent activity will appear here
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6b7280',
    },
    backButton: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    backButtonText: {
        fontSize: 15,
        color: '#3b82f6',
        fontWeight: '500',
    },
    header: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6b7280',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    consentCard: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    consentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    consentHeaderLeft: {
        flexDirection: 'row',
        flex: 1,
    },
    consentIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    consentHeaderInfo: {
        flex: 1,
    },
    requesterName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    facilityName: {
        fontSize: 13,
        color: '#6b7280',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#ffffff',
    },
    consentBody: {
        gap: 8,
    },
    purposeRow: {
        flexDirection: 'row',
        gap: 8,
    },
    purposeLabel: {
        fontSize: 13,
        color: '#9ca3af',
        fontWeight: '500',
    },
    purposeValue: {
        flex: 1,
        fontSize: 13,
        color: '#374151',
    },
    dataTypesRow: {
        gap: 4,
    },
    dataTypesLabel: {
        fontSize: 13,
        color: '#9ca3af',
        fontWeight: '500',
    },
    dataTypesTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    dataTypeTag: {
        backgroundColor: '#eff6ff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    dataTypeTagText: {
        fontSize: 11,
        color: '#1e40af',
        fontWeight: '500',
    },
    dateRangeRow: {
        flexDirection: 'row',
        gap: 8,
    },
    dateRangeLabel: {
        fontSize: 13,
        color: '#9ca3af',
        fontWeight: '500',
    },
    dateRangeValue: {
        flex: 1,
        fontSize: 13,
        color: '#374151',
    },
    expiryRow: {
        flexDirection: 'row',
        gap: 8,
    },
    expiryLabel: {
        fontSize: 13,
        color: '#9ca3af',
        fontWeight: '500',
    },
    expiryValue: {
        flex: 1,
        fontSize: 13,
        color: '#374151',
    },
    consentFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    actionsCount: {
        fontSize: 12,
        color: '#9ca3af',
    },
    viewTimelineButton: {
        fontSize: 14,
        color: '#3b82f6',
        fontWeight: '500',
    },
    detailsBox: {
        backgroundColor: '#fef3c7',
        padding: 8,
        borderRadius: 4,
        marginTop: 4,
    },
    detailsText: {
        fontSize: 12,
        color: '#92400e',
    },
    timelineTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    timelineEntry: {
        position: 'relative',
        paddingLeft: 40,
        paddingBottom: 24,
    },
    timelineDot: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#3b82f6',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    timelineLine: {
        position: 'absolute',
        left: 5,
        top: 12,
        width: 2,
        bottom: 0,
        backgroundColor: '#e5e7eb',
    },
    timelineContent: {
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    timelineHeader: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    timelineIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    timelineHeaderInfo: {
        flex: 1,
    },
    timelineEventType: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    timelineTime: {
        fontSize: 11,
        color: '#9ca3af',
    },
    timelineDescription: {
        fontSize: 13,
        color: '#374151',
        marginBottom: 8,
    },
    timelineMeta: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 80,
        paddingHorizontal: 32,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },
});

export default ConsentHistoryScreen;
