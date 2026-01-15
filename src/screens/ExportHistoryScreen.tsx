// Export History Screen - Category 13
// View and manage past data exports

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { dataExportService } from '../services/dataExportService';
import { ExportHistory, ExportStatistics } from '../../backend/types/dataExport';

type Props = NativeStackScreenProps<RootStackParamList, 'ExportHistory'>;

export default function ExportHistoryScreen({ navigation }: Props) {
    const [exports, setExports] = useState<ExportHistory[]>([]);
    const [statistics, setStatistics] = useState<ExportStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'processing' | 'expired'>('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [exportsData, statsData] = await Promise.all([
                dataExportService.getExportHistory(),
                dataExportService.getExportStatistics(),
            ]);
            setExports(exportsData);
            setStatistics(statsData);
        } catch (error) {
            Alert.alert('Error', 'Failed to load export history');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const handleDownload = async (exportItem: ExportHistory) => {
        if (exportItem.status !== 'completed') {
            if (exportItem.status === 'expired') {
                Alert.alert(
                    'Export Expired',
                    'This export has expired. Would you like to create a new export?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'New Export',
                            onPress: () => navigation.navigate('DataExport'),
                        },
                    ]
                );
                return;
            }

            Alert.alert('Error', 'Export is not ready for download');
            return;
        }

        try {
            const downloadInfo = await dataExportService.downloadExport(exportItem.id);
            Alert.alert(
                'Download Ready',
                `Your export is ready to download.\n\nExpires: ${new Date(downloadInfo.expiresAt).toLocaleString('en-IN')}`,
                [
                    {
                        text: 'Download',
                        onPress: () => {
                            // In production, this would open the download URL
                            Alert.alert('Download', `Downloading ${downloadInfo.url}`);
                        },
                    },
                    { text: 'Cancel', style: 'cancel' },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to prepare download');
        }
    };

    const handleShare = (exportItem: ExportHistory) => {
        if (exportItem.status !== 'completed') {
            Alert.alert('Error', 'Export is not ready to share');
            return;
        }

        Alert.alert(
            'Share Export',
            'Choose how to share this export',
            [
                {
                    text: 'Email',
                    onPress: () => Alert.alert('Share', 'Email sharing coming soon!'),
                },
                {
                    text: 'Generate Link',
                    onPress: async () => {
                        try {
                            const shareLink = await dataExportService.shareExport({
                                exportId: exportItem.id,
                                expiresIn: 24,
                                requirePassword: true,
                            });
                            Alert.alert(
                                'Share Link Created',
                                `Link: ${shareLink.url}\nPassword: ${shareLink.password}\n\nExpires in 24 hours`
                            );
                        } catch (error) {
                            Alert.alert('Error', 'Failed to create share link');
                        }
                    },
                },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleDelete = (exportItem: ExportHistory) => {
        Alert.alert(
            'Delete Export',
            'Are you sure you want to delete this export?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await dataExportService.deleteExport(exportItem.id);
                            setExports(exports.filter(e => e.id !== exportItem.id));
                            Alert.alert('Success', 'Export deleted');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete export');
                        }
                    },
                },
            ]
        );
    };

    const filteredExports = exports.filter(exp => {
        if (selectedFilter === 'all') return true;
        return exp.status === selectedFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return '#4caf50';
            case 'processing': return '#ff9800';
            case 'failed': return '#f44336';
            case 'expired': return '#999';
            default: return '#666';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return '✓';
            case 'processing': return '⟳';
            case 'failed': return '✗';
            case 'expired': return '⏰';
            default: return '•';
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2196f3" />
                <Text style={styles.loadingText}>Loading export history...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
        >
            {/* Statistics */}
            {statistics && (
                <View style={styles.statsSection}>
                    <Text style={styles.statsTitle}>Export Statistics</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>{statistics.totalExports}</Text>
                            <Text style={styles.statLabel}>Total Exports</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>
                                {(statistics.totalSize / 1024 / 1024).toFixed(1)} MB
                            </Text>
                            <Text style={styles.statLabel}>Total Size</Text>
                        </View>
                    </View>
                    <View style={styles.formatStats}>
                        {Object.entries(statistics.exportsByFormat).map(([format, count]) => (
                            <View key={format} style={styles.formatStat}>
                                <Text style={styles.formatStatLabel}>{format.toUpperCase()}</Text>
                                <Text style={styles.formatStatValue}>{count}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Filters */}
            <View style={styles.filtersSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['all', 'completed', 'processing', 'expired'].map(filter => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterChip,
                                selectedFilter === filter && styles.filterChipSelected,
                            ]}
                            onPress={() => setSelectedFilter(filter as any)}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    selectedFilter === filter && styles.filterChipTextSelected,
                                ]}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Export List */}
            <View style={styles.listSection}>
                {filteredExports.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📭</Text>
                        <Text style={styles.emptyTitle}>No Exports Found</Text>
                        <Text style={styles.emptyText}>
                            {selectedFilter === 'all'
                                ? 'Start by creating your first export'
                                : `No ${selectedFilter} exports`}
                        </Text>
                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={() => navigation.navigate('DataExport')}
                        >
                            <Text style={styles.emptyButtonText}>Create Export</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    filteredExports.map(exportItem => (
                        <View key={exportItem.id} style={styles.exportCard}>
                            {/* Header */}
                            <View style={styles.exportHeader}>
                                <View style={styles.exportHeaderLeft}>
                                    <Text style={styles.exportFormat}>
                                        {exportItem.format.toUpperCase()}
                                    </Text>
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            { backgroundColor: getStatusColor(exportItem.status) + '20' },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.statusText,
                                                { color: getStatusColor(exportItem.status) },
                                            ]}
                                        >
                                            {getStatusIcon(exportItem.status)} {exportItem.status}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => handleDelete(exportItem)}>
                                    <Text style={styles.deleteIcon}>🗑️</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Record Types */}
                            <View style={styles.recordTypes}>
                                {exportItem.recordTypes.map(type => (
                                    <View key={type} style={styles.recordTypeBadge}>
                                        <Text style={styles.recordTypeText}>
                                            {type.replace('_', ' ')}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            {/* Meta Info */}
                            <View style={styles.exportMeta}>
                                <Text style={styles.exportMetaText}>
                                    📅 {new Date(exportItem.createdAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </Text>
                                {exportItem.fileSize && (
                                    <Text style={styles.exportMetaText}>
                                        📦 {(exportItem.fileSize / 1024 / 1024).toFixed(2)} MB
                                    </Text>
                                )}
                            </View>

                            {/* Date Range */}
                            <Text style={styles.dateRange}>
                                {exportItem.dateRange.startDate} → {exportItem.dateRange.endDate}
                            </Text>

                            {/* Expiry */}
                            {exportItem.expiresAt && exportItem.status === 'completed' && (
                                <Text style={styles.expiryText}>
                                    ⏰ Expires: {new Date(exportItem.expiresAt).toLocaleDateString('en-IN')}
                                </Text>
                            )}

                            {/* Actions */}
                            {exportItem.status === 'completed' && (
                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => handleDownload(exportItem)}
                                    >
                                        <Text style={styles.actionButtonText}>📥 Download</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.actionButtonSecondary]}
                                        onPress={() => handleShare(exportItem)}
                                    >
                                        <Text style={styles.actionButtonTextSecondary}>🔗 Share</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {exportItem.status === 'processing' && (
                                <View style={styles.processingIndicator}>
                                    <ActivityIndicator size="small" color="#ff9800" />
                                    <Text style={styles.processingText}>Processing...</Text>
                                </View>
                            )}
                        </View>
                    ))
                )}
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    statsSection: {
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 12,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2196f3',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    formatStats: {
        flexDirection: 'row',
        gap: 8,
    },
    formatStat: {
        flex: 1,
        backgroundColor: '#e3f2fd',
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    formatStatLabel: {
        fontSize: 10,
        color: '#1976d2',
        fontWeight: '600',
    },
    formatStatValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1976d2',
    },
    filtersSection: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginTop: 12,
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    filterChipSelected: {
        backgroundColor: '#2196f3',
        borderColor: '#2196f3',
    },
    filterChipText: {
        fontSize: 14,
        color: '#333',
    },
    filterChipTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    listSection: {
        padding: 16,
    },
    exportCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    exportHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    exportHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    exportFormat: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    deleteIcon: {
        fontSize: 20,
    },
    recordTypes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 12,
    },
    recordTypeBadge: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    recordTypeText: {
        fontSize: 11,
        color: '#1976d2',
        textTransform: 'capitalize',
    },
    exportMeta: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    exportMetaText: {
        fontSize: 12,
        color: '#666',
    },
    dateRange: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    expiryText: {
        fontSize: 12,
        color: '#ff9800',
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#2196f3',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonSecondary: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#2196f3',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    actionButtonTextSecondary: {
        color: '#2196f3',
        fontSize: 14,
        fontWeight: '600',
    },
    processingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    processingText: {
        fontSize: 14,
        color: '#ff9800',
        marginLeft: 8,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
    },
    emptyButton: {
        backgroundColor: '#2196f3',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
