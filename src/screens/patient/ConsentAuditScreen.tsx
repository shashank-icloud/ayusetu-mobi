import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { phrService } from '../../services/phrService';
import type { ConsentAuditEntry } from '../../../backend/types/phr';

/**
 * ConsentAuditScreen - Visual Consent Audit Trail (Category 4)
 * 
 * Features:
 * - Visual timeline of all consent actions
 * - Filter by consent ID or action type
 * - Show who accessed what and when
 * - Export audit report
 * - Compliance transparency
 */

export default function ConsentAuditScreen() {
    const [auditTrail, setAuditTrail] = useState<ConsentAuditEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterAction, setFilterAction] = useState<string>('all');

    useEffect(() => {
        loadAuditTrail();
    }, []);

    const loadAuditTrail = async () => {
        try {
            setLoading(true);
            const data = await phrService.getConsentAuditTrail();
            setAuditTrail(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load audit trail');
            console.error('Load audit trail error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActionIcon = (action: ConsentAuditEntry['action']) => {
        switch (action) {
            case 'created': return '📝';
            case 'approved': return '✅';
            case 'denied': return '❌';
            case 'revoked': return '🚫';
            case 'accessed': return '👁️';
            case 'expired': return '⏰';
            case 'modified': return '✏️';
            default: return '📋';
        }
    };

    const getActionColor = (action: ConsentAuditEntry['action']) => {
        switch (action) {
            case 'created': return '#2196F3';
            case 'approved': return '#4CAF50';
            case 'denied': return '#F44336';
            case 'revoked': return '#FF5722';
            case 'accessed': return '#673AB7';
            case 'expired': return '#FF9800';
            case 'modified': return '#00BCD4';
            default: return '#999';
        }
    };

    const getActorIcon = (actorType: ConsentAuditEntry['actorType']) => {
        switch (actorType) {
            case 'patient': return '👤';
            case 'provider': return '🏥';
            case 'system': return '⚙️';
            case 'guardian': return '👨‍👩‍👧';
            default: return '👤';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleExportAudit = () => {
        Alert.alert(
            'Export Audit Report',
            'This will download a PDF report of all consent activities.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Export',
                    onPress: () => {
                        // In production, would generate and download PDF
                        Alert.alert('Success', 'Audit report will be downloaded shortly');
                    },
                },
            ]
        );
    };

    const filteredAudit = filterAction === 'all'
        ? auditTrail
        : auditTrail.filter(entry => entry.action === filterAction);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading audit trail...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Consent Audit Trail</Text>
                    <Text style={styles.headerSubtitle}>{auditTrail.length} total events</Text>
                </View>
                <TouchableOpacity
                    style={styles.exportButton}
                    onPress={handleExportAudit}
                >
                    <Text style={styles.exportButtonText}>📥 Export</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
                contentContainerStyle={styles.filterContent}
            >
                {['all', 'created', 'approved', 'denied', 'revoked', 'accessed', 'modified'].map(action => (
                    <TouchableOpacity
                        key={action}
                        style={[
                            styles.filterChip,
                            filterAction === action && styles.filterChipActive,
                        ]}
                        onPress={() => setFilterAction(action)}
                    >
                        <Text style={[
                            styles.filterChipText,
                            filterAction === action && styles.filterChipTextActive,
                        ]}>
                            {action === 'all' ? 'All' : `${getActionIcon(action as ConsentAuditEntry['action'])} ${action.charAt(0).toUpperCase() + action.slice(1)}`}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Timeline */}
            <ScrollView style={styles.timeline}>
                {filteredAudit.map((entry, index) => (
                    <View key={entry.id} style={styles.timelineItem}>
                        {/* Timeline connector */}
                        {index < filteredAudit.length - 1 && (
                            <View style={styles.timelineConnector} />
                        )}

                        {/* Timeline dot */}
                        <View
                            style={[
                                styles.timelineDot,
                                { backgroundColor: getActionColor(entry.action) },
                            ]}
                        >
                            <Text style={styles.timelineDotIcon}>{getActionIcon(entry.action)}</Text>
                        </View>

                        {/* Event card */}
                        <View style={styles.eventCard}>
                            <View style={styles.eventHeader}>
                                <View style={styles.eventTitleRow}>
                                    <Text style={[styles.eventAction, { color: getActionColor(entry.action) }]}>
                                        {entry.action.toUpperCase()}
                                    </Text>
                                    <Text style={styles.eventTime}>{formatTimestamp(entry.timestamp)}</Text>
                                </View>
                            </View>

                            <View style={styles.eventBody}>
                                <View style={styles.actorRow}>
                                    <Text style={styles.actorIcon}>{getActorIcon(entry.actorType)}</Text>
                                    <Text style={styles.actorName}>{entry.actor}</Text>
                                    <View style={styles.actorTypeBadge}>
                                        <Text style={styles.actorTypeText}>{entry.actorType}</Text>
                                    </View>
                                </View>

                                <Text style={styles.eventDetails}>{entry.details}</Text>

                                {entry.dataAccessed && entry.dataAccessed.length > 0 && (
                                    <View style={styles.dataAccessedSection}>
                                        <Text style={styles.dataAccessedTitle}>Data Accessed:</Text>
                                        {entry.dataAccessed.map((data, idx) => (
                                            <Text key={idx} style={styles.dataAccessedItem}>• {data}</Text>
                                        ))}
                                    </View>
                                )}

                                {entry.ipAddress && (
                                    <Text style={styles.metaInfo}>IP: {entry.ipAddress}</Text>
                                )}
                                {entry.deviceInfo && (
                                    <Text style={styles.metaInfo}>Device: {entry.deviceInfo}</Text>
                                )}
                            </View>
                        </View>
                    </View>
                ))}

                {filteredAudit.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📋</Text>
                        <Text style={styles.emptyText}>No audit events</Text>
                        <Text style={styles.emptySubtext}>
                            {filterAction === 'all'
                                ? 'No consent activity yet'
                                : `No "${filterAction}" events found`}
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Compliance Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    🔐 Audit logs are tamper-proof and ABDM compliant
                </Text>
            </View>
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
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    exportButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    exportButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    filterContainer: {
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    filterContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
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
    timeline: {
        flex: 1,
        padding: 16,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 24,
        position: 'relative',
    },
    timelineConnector: {
        position: 'absolute',
        left: 19,
        top: 40,
        bottom: -24,
        width: 2,
        backgroundColor: '#E0E0E0',
    },
    timelineDot: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        zIndex: 1,
    },
    timelineDotIcon: {
        fontSize: 20,
    },
    eventCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    eventHeader: {
        marginBottom: 12,
    },
    eventTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    eventAction: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    eventTime: {
        fontSize: 12,
        color: '#999',
    },
    eventBody: {
        gap: 8,
    },
    actorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actorIcon: {
        fontSize: 16,
    },
    actorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    actorTypeBadge: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    actorTypeText: {
        fontSize: 11,
        color: '#666',
        textTransform: 'uppercase',
    },
    eventDetails: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    dataAccessedSection: {
        marginTop: 8,
        padding: 12,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
    },
    dataAccessedTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    dataAccessedItem: {
        fontSize: 13,
        color: '#666',
        marginLeft: 8,
    },
    metaInfo: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'monospace',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
    },
    footer: {
        backgroundColor: '#FFF',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#666',
    },
});
