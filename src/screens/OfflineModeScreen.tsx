import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import accessibilityService, { OfflineSettings, OfflineData, SyncStatus, BandwidthUsage } from '../services/accessibilityService';

type Props = NativeStackScreenProps<RootStackParamList, 'OfflineMode'>;

export default function OfflineModeScreen({ navigation }: Props) {
    const [settings, setSettings] = useState<OfflineSettings | null>(null);
    const [offlineData, setOfflineData] = useState<OfflineData[]>([]);
    const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
    const [bandwidthUsage, setBandwidthUsage] = useState<BandwidthUsage[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [settingsData, offlineDataList, bandwidth] = await Promise.all([
                accessibilityService.getOfflineSettings(),
                accessibilityService.getOfflineData(),
                accessibilityService.getBandwidthUsage(),
            ]);
            setSettings(settingsData);
            setOfflineData(offlineDataList);
            setBandwidthUsage(bandwidth);
        } catch (error) {
            console.error('Failed to load offline data:', error);
            Alert.alert('Error', 'Failed to load offline settings');
        } finally {
            setLoading(false);
        }
    };

    const updateSetting = async (key: keyof OfflineSettings, value: any) => {
        if (!settings) return;

        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);

        try {
            await accessibilityService.updateOfflineSettings({
                settings: { [key]: value },
            });
        } catch (error) {
            console.error('Failed to update setting:', error);
            setSettings(settings);
            Alert.alert('Error', 'Failed to update setting');
        }
    };

    const handleSyncNow = async () => {
        setSyncing(true);
        try {
            const status = await accessibilityService.syncOfflineData({ force: true });
            setSyncStatus(status);
            Alert.alert('Success', `Synced ${status.syncedItems} items successfully`);
            loadData(); // Reload data
        } catch (error) {
            console.error('Failed to sync:', error);
            Alert.alert('Error', 'Failed to sync data');
        } finally {
            setSyncing(false);
        }
    };

    const handleDeleteOfflineData = async (dataId: string) => {
        Alert.alert(
            'Delete Offline Data',
            'Remove this data from offline storage?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await accessibilityService.deleteOfflineData({ dataIds: [dataId] });
                            setOfflineData(offlineData.filter(d => d.id !== dataId));
                            Alert.alert('Success', 'Offline data deleted');
                        } catch (error) {
                            console.error('Failed to delete:', error);
                            Alert.alert('Error', 'Failed to delete offline data');
                        }
                    },
                },
            ]
        );
    };

    const formatBytes = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getTotalBandwidth = (): number => {
        return bandwidthUsage.reduce((sum, usage) => sum + usage.totalBytes, 0);
    };

    const getDataTypeIcon = (type: string): string => {
        const icons: Record<string, string> = {
            'health-record': '📄',
            'appointment': '📅',
            'medication': '💊',
            'lab-report': '🧪',
            'prescription': '📋',
            'consent': '🔒',
        };
        return icons[type] || '📦';
    };

    if (loading || !settings) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Offline Mode</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0ea5e9" />
                    <Text style={styles.loadingText}>Loading offline data...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const totalStorageUsed = offlineData.reduce((sum, item) => sum + item.size, 0);
    const storagePercent = (totalStorageUsed / (settings.maxCacheSize * 1048576)) * 100;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Offline Mode</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Sync Status */}
                <View style={styles.syncCard}>
                    <View style={styles.syncHeader}>
                        <Text style={styles.syncTitle}>📡 Sync Status</Text>
                        {syncStatus?.lastSyncAt && (
                            <Text style={styles.syncTime}>
                                Last: {formatDate(syncStatus.lastSyncAt)}
                            </Text>
                        )}
                    </View>

                    {syncing ? (
                        <View style={styles.syncingIndicator}>
                            <ActivityIndicator size="small" color="#0ea5e9" />
                            <Text style={styles.syncingText}>Syncing data...</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.syncButton}
                            onPress={handleSyncNow}
                        >
                            <Text style={styles.syncButtonText}>🔄 Sync Now</Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.syncStats}>
                        <View style={styles.syncStat}>
                            <Text style={styles.syncStatValue}>{offlineData.length}</Text>
                            <Text style={styles.syncStatLabel}>Offline Items</Text>
                        </View>
                        <View style={styles.syncStat}>
                            <Text style={styles.syncStatValue}>{formatBytes(totalStorageUsed)}</Text>
                            <Text style={styles.syncStatLabel}>Storage Used</Text>
                        </View>
                        <View style={styles.syncStat}>
                            <Text style={styles.syncStatValue}>{formatBytes(getTotalBandwidth())}</Text>
                            <Text style={styles.syncStatLabel}>Data Used (7d)</Text>
                        </View>
                    </View>
                </View>

                {/* Storage Usage */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💾 Storage</Text>
                    <View style={styles.storageCard}>
                        <View style={styles.storageHeader}>
                            <Text style={styles.storageText}>
                                {formatBytes(totalStorageUsed)} / {settings.maxCacheSize} MB
                            </Text>
                            <Text style={styles.storagePercent}>{storagePercent.toFixed(0)}%</Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: `${Math.min(storagePercent, 100)}%` }]} />
                        </View>
                    </View>
                </View>

                {/* Offline Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚙️ Offline Settings</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Offline Mode</Text>
                            <Text style={styles.settingDesc}>Work without internet</Text>
                        </View>
                        <Switch
                            value={settings.offlineModeEnabled}
                            onValueChange={(value) => updateSetting('offlineModeEnabled', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Auto Sync</Text>
                            <Text style={styles.settingDesc}>Sync automatically: {settings.syncFrequency}</Text>
                        </View>
                        <Switch
                            value={settings.autoSyncEnabled}
                            onValueChange={(value) => updateSetting('autoSyncEnabled', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>WiFi Only Sync</Text>
                            <Text style={styles.settingDesc}>Save mobile data</Text>
                        </View>
                        <Switch
                            value={settings.wifiOnlySync}
                            onValueChange={(value) => updateSetting('wifiOnlySync', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                {/* Data to Sync */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📥 What to Sync</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Health Records</Text>
                        </View>
                        <Switch
                            value={settings.syncHealthRecords}
                            onValueChange={(value) => updateSetting('syncHealthRecords', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Appointments</Text>
                        </View>
                        <Switch
                            value={settings.syncAppointments}
                            onValueChange={(value) => updateSetting('syncAppointments', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Medications</Text>
                        </View>
                        <Switch
                            value={settings.syncMedications}
                            onValueChange={(value) => updateSetting('syncMedications', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Lab Reports</Text>
                        </View>
                        <Switch
                            value={settings.syncLabReports}
                            onValueChange={(value) => updateSetting('syncLabReports', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Prescriptions</Text>
                        </View>
                        <Switch
                            value={settings.syncPrescriptions}
                            onValueChange={(value) => updateSetting('syncPrescriptions', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                {/* Bandwidth Optimization */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📊 Bandwidth</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Compress Images</Text>
                            <Text style={styles.settingDesc}>Reduce data usage</Text>
                        </View>
                        <Switch
                            value={settings.compressImages}
                            onValueChange={(value) => updateSetting('compressImages', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Auto Delete Old Data</Text>
                            <Text style={styles.settingDesc}>After {settings.dataRetentionDays} days</Text>
                        </View>
                        <Switch
                            value={settings.autoDeleteOldData}
                            onValueChange={(value) => updateSetting('autoDeleteOldData', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                {/* Offline Data List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📦 Offline Data ({offlineData.length})</Text>

                    {offlineData.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>📭</Text>
                            <Text style={styles.emptyText}>No offline data available</Text>
                            <Text style={styles.emptySubtext}>Sync to download data for offline use</Text>
                        </View>
                    ) : (
                        offlineData.map((item) => (
                            <View key={item.id} style={styles.dataCard}>
                                <View style={styles.dataHeader}>
                                    <Text style={styles.dataIcon}>{getDataTypeIcon(item.type)}</Text>
                                    <View style={styles.dataInfo}>
                                        <Text style={styles.dataTitle}>{item.title}</Text>
                                        <Text style={styles.dataType}>
                                            {item.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => handleDeleteOfflineData(item.id)}
                                        style={styles.deleteButton}
                                    >
                                        <Text style={styles.deleteButtonText}>🗑️</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.dataFooter}>
                                    <Text style={styles.dataSize}>{formatBytes(item.size)}</Text>
                                    <Text style={styles.dataDivider}>•</Text>
                                    <Text style={styles.dataDate}>Synced {formatDate(item.syncedAt)}</Text>
                                    {item.lastAccessedAt && (
                                        <>
                                            <Text style={styles.dataDivider}>•</Text>
                                            <Text style={styles.dataAccess}>Used {formatDate(item.lastAccessedAt)}</Text>
                                        </>
                                    )}
                                </View>
                            </View>
                        ))
                    )}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    backButtonText: {
        fontSize: 28,
        color: '#0ea5e9',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1e293b',
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748b',
    },
    syncCard: {
        margin: 20,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    syncHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    syncTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
    },
    syncTime: {
        fontSize: 12,
        color: '#64748b',
    },
    syncButton: {
        backgroundColor: '#0ea5e9',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    syncButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    syncingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        marginBottom: 16,
    },
    syncingText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#64748b',
    },
    syncStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    syncStat: {
        alignItems: 'center',
    },
    syncStatValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0ea5e9',
        marginBottom: 4,
    },
    syncStatLabel: {
        fontSize: 12,
        color: '#64748b',
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 16,
    },
    storageCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    storageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    storageText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    storagePercent: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0ea5e9',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#e2e8f0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#0ea5e9',
        borderRadius: 4,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    settingDesc: {
        fontSize: 14,
        color: '#64748b',
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#94a3b8',
    },
    dataCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    dataHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    dataIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    dataInfo: {
        flex: 1,
    },
    dataTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    dataType: {
        fontSize: 14,
        color: '#64748b',
    },
    deleteButton: {
        padding: 8,
    },
    deleteButtonText: {
        fontSize: 20,
    },
    dataFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dataSize: {
        fontSize: 13,
        color: '#64748b',
    },
    dataDivider: {
        fontSize: 13,
        color: '#cbd5e1',
        marginHorizontal: 8,
    },
    dataDate: {
        fontSize: 13,
        color: '#64748b',
    },
    dataAccess: {
        fontSize: 13,
        color: '#64748b',
    },
});
