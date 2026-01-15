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
import { complianceService } from '../services/complianceService';
import type { DataAccessLog, AccessSource, DataCategory } from '../services/complianceService';

const DataAccessLogsScreen: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState<DataAccessLog[]>([]);
    const [filter, setFilter] = useState<AccessSource | 'all'>('all');

    useEffect(() => {
        loadLogs();
    }, [filter]);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const data = await complianceService.getDataAccessLogs({
                userId: 'user-001',
                source: filter === 'all' ? undefined : filter,
            });
            setLogs(data);
        } catch (error) {
            console.error('Error loading access logs:', error);
            Alert.alert('Error', 'Failed to load access logs');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'view': return '👁️';
            case 'download': return '⬇️';
            case 'share': return '📤';
            case 'emergency-access': return '🚨';
            default: return '📋';
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'view': return '#3b82f6';
            case 'download': return '#10b981';
            case 'share': return '#f59e0b';
            case 'emergency-access': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getSourceColor = (source: AccessSource) => {
        switch (source) {
            case 'doctor': return '#8b5cf6';
            case 'hospital': return '#3b82f6';
            case 'lab': return '#10b981';
            case 'pharmacy': return '#f59e0b';
            case 'emergency': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const filters: Array<AccessSource | 'all'> = ['all', 'doctor', 'hospital', 'lab', 'pharmacy'];

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading access logs...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Filter Bar */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {filters.map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterChip, filter === f && styles.filterChipActive]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
                                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={styles.content}>
                {logs.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📋</Text>
                        <Text style={styles.emptyText}>No access logs found</Text>
                        <Text style={styles.emptySubtext}>
                            {filter === 'all'
                                ? 'Your data access history will appear here'
                                : `No ${filter} access logs`}
                        </Text>
                    </View>
                ) : (
                    logs.map((log) => (
                        <View key={log.id} style={styles.logCard}>
                            <View style={styles.logHeader}>
                                <View style={styles.logHeaderLeft}>
                                    <Text style={styles.actionIcon}>{getActionIcon(log.action)}</Text>
                                    <View style={styles.logHeaderInfo}>
                                        <Text style={styles.actionText}>
                                            {log.action.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </Text>
                                        <Text style={styles.timeText}>{formatDate(log.timestamp)}</Text>
                                    </View>
                                </View>
                                <View
                                    style={[
                                        styles.sourceBadge,
                                        { backgroundColor: getSourceColor(log.accessedBy.type) },
                                    ]}
                                >
                                    <Text style={styles.sourceBadgeText}>
                                        {log.accessedBy.type.toUpperCase()}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.logBody}>
                                {log.recordTitle && (
                                    <Text style={styles.recordTitle}>📄 {log.recordTitle}</Text>
                                )}

                                <View style={styles.accessorInfo}>
                                    <Text style={styles.accessorName}>{log.accessedBy.name}</Text>
                                    {log.accessedBy.facilityName && (
                                        <Text style={styles.facilityName}>{log.accessedBy.facilityName}</Text>
                                    )}
                                </View>

                                {log.purpose && (
                                    <View style={styles.purposeRow}>
                                        <Text style={styles.purposeLabel}>Purpose:</Text>
                                        <Text style={styles.purposeValue}>{log.purpose}</Text>
                                    </View>
                                )}

                                {log.consentId && (
                                    <View style={styles.consentRow}>
                                        <Text style={styles.consentIcon}>✓</Text>
                                        <Text style={styles.consentText}>Consent-based access</Text>
                                    </View>
                                )}

                                <View style={styles.logFooter}>
                                    {log.duration && (
                                        <Text style={styles.metaText}>⏱️ {log.duration}s</Text>
                                    )}
                                    {log.location && (
                                        <Text style={styles.metaText}>📍 {log.location}</Text>
                                    )}
                                    {log.ipAddress && (
                                        <Text style={styles.metaText}>🌐 {log.ipAddress}</Text>
                                    )}
                                </View>

                                {!log.success && (
                                    <View style={styles.failedBadge}>
                                        <Text style={styles.failedText}>
                                            ⚠️ Failed{log.failureReason ? `: ${log.failureReason}` : ''}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Info Footer */}
            <View style={styles.infoFooter}>
                <Text style={styles.infoText}>
                    All data access is logged in real-time. {logs.length} access log(s) shown.
                </Text>
            </View>
        </View>
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
    filterContainer: {
        backgroundColor: '#ffffff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: '#3b82f6',
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6b7280',
    },
    filterChipTextActive: {
        color: '#ffffff',
    },
    content: {
        flex: 1,
    },
    logCard: {
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
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    logHeaderLeft: {
        flexDirection: 'row',
        flex: 1,
    },
    actionIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    logHeaderInfo: {
        flex: 1,
    },
    actionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    timeText: {
        fontSize: 12,
        color: '#9ca3af',
    },
    sourceBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    sourceBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#ffffff',
    },
    logBody: {
        gap: 8,
    },
    recordTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    accessorInfo: {
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    accessorName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    facilityName: {
        fontSize: 13,
        color: '#6b7280',
    },
    purposeRow: {
        flexDirection: 'row',
        gap: 8,
    },
    purposeLabel: {
        fontSize: 13,
        color: '#9ca3af',
    },
    purposeValue: {
        flex: 1,
        fontSize: 13,
        color: '#374151',
    },
    consentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#d1fae5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    consentIcon: {
        fontSize: 12,
        color: '#065f46',
    },
    consentText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#065f46',
    },
    logFooter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 4,
    },
    metaText: {
        fontSize: 11,
        color: '#9ca3af',
    },
    failedBadge: {
        backgroundColor: '#fee2e2',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 4,
    },
    failedText: {
        fontSize: 12,
        color: '#dc2626',
        fontWeight: '500',
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
    infoFooter: {
        backgroundColor: '#eff6ff',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#bfdbfe',
    },
    infoText: {
        fontSize: 12,
        color: '#1e3a8a',
        textAlign: 'center',
    },
});

export default DataAccessLogsScreen;
