// Wearables Integration Screen - Category 16
// Connect and sync data from wearable devices

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { futureReadyService } from '../services/futureReadyService';
import { WearableDevice, ActivitySummary, SleepSummary } from '../../backend/types/futureReady';

type Props = NativeStackScreenProps<RootStackParamList, 'Wearables'>;

export default function WearablesScreen({ navigation }: Props) {
    const [devices, setDevices] = useState<WearableDevice[]>([]);
    const [activitySummary, setActivitySummary] = useState<ActivitySummary | null>(null);
    const [sleepSummary, setSleepSummary] = useState<SleepSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [devicesData, activityData, sleepData] = await Promise.all([
                futureReadyService.getWearableDevices('user-123'),
                futureReadyService.getActivitySummary('user-123', '2026-01-15'),
                futureReadyService.getSleepSummary('user-123', '2026-01-14'),
            ]);
            setDevices(devicesData);
            setActivitySummary(activityData);
            setSleepSummary(sleepData);
        } catch (error) {
            Alert.alert('Error', 'Failed to load wearable data');
        } finally {
            setLoading(false);
        }
    };

    const handleSyncDevice = async (deviceId: string) => {
        setSyncing(deviceId);
        try {
            const result = await futureReadyService.syncWearableData(deviceId);
            Alert.alert('Success', `Synced ${result.dataPointsSynced} data points`);
            loadData();
        } catch (error) {
            Alert.alert('Error', 'Failed to sync device');
        } finally {
            setSyncing(null);
        }
    };

    const handleConnectDevice = async () => {
        Alert.alert(
            'Connect Device',
            'Choose a device type to connect',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Fitness Tracker',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const newDevice = await futureReadyService.connectWearableDevice('user-123', 'fitness_tracker');
                            setDevices([...devices, newDevice]);
                            Alert.alert('Success', 'Device connected successfully');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to connect device');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
                {
                    text: 'Smartwatch',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const newDevice = await futureReadyService.connectWearableDevice('user-123', 'smartwatch');
                            setDevices([...devices, newDevice]);
                            Alert.alert('Success', 'Device connected successfully');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to connect device');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const getDeviceIcon = (type: string) => {
        switch (type) {
            case 'fitness_tracker': return '⌚';
            case 'smartwatch': return '⌚';
            case 'blood_pressure_monitor': return '🩺';
            case 'glucose_monitor': return '💉';
            case 'smart_scale': return '⚖️';
            default: return '📱';
        }
    };

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196f3" />
                <Text style={styles.loadingText}>Loading wearable data...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Connected Devices */}
            <View style={styles.devicesSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Connected Devices</Text>
                    <TouchableOpacity style={styles.addButton} onPress={handleConnectDevice}>
                        <Text style={styles.addButtonText}>+ Add Device</Text>
                    </TouchableOpacity>
                </View>

                {devices.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>⌚</Text>
                        <Text style={styles.emptyText}>No devices connected</Text>
                        <Text style={styles.emptySubtext}>Connect your wearable devices to track health metrics</Text>
                    </View>
                ) : (
                    devices.map((device) => (
                        <View key={device.id} style={styles.deviceCard}>
                            <View style={styles.deviceHeader}>
                                <Text style={styles.deviceIcon}>{getDeviceIcon(device.type)}</Text>
                                <View style={styles.deviceInfo}>
                                    <Text style={styles.deviceName}>{device.name}</Text>
                                    <Text style={styles.deviceModel}>
                                        {device.manufacturer} • {device.model}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.statusBadge,
                                    device.isConnected ? styles.statusBadgeConnected : styles.statusBadgeDisconnected
                                ]}>
                                    <Text style={styles.statusBadgeText}>
                                        {device.isConnected ? '● Connected' : '○ Disconnected'}
                                    </Text>
                                </View>
                            </View>

                            {device.isConnected && (
                                <>
                                    <View style={styles.deviceStats}>
                                        {device.batteryLevel !== undefined && (
                                            <View style={styles.deviceStat}>
                                                <Text style={styles.deviceStatIcon}>🔋</Text>
                                                <Text style={styles.deviceStatText}>{device.batteryLevel}%</Text>
                                            </View>
                                        )}
                                        {device.lastSyncedAt && (
                                            <View style={styles.deviceStat}>
                                                <Text style={styles.deviceStatIcon}>🔄</Text>
                                                <Text style={styles.deviceStatText}>
                                                    Last sync: {new Date(device.lastSyncedAt).toLocaleTimeString('en-IN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.syncButton, syncing === device.id && styles.syncButtonDisabled]}
                                        onPress={() => handleSyncDevice(device.id)}
                                        disabled={syncing === device.id}
                                    >
                                        {syncing === device.id ? (
                                            <>
                                                <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                                                <Text style={styles.syncButtonText}>Syncing...</Text>
                                            </>
                                        ) : (
                                            <Text style={styles.syncButtonText}>🔄 Sync Now</Text>
                                        )}
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    ))
                )}
            </View>

            {/* Today's Activity */}
            {activitySummary && (
                <View style={styles.activitySection}>
                    <Text style={styles.sectionTitle}>Today's Activity</Text>

                    <View style={styles.activityGrid}>
                        <View style={styles.activityCard}>
                            <Text style={styles.activityIcon}>👟</Text>
                            <Text style={styles.activityValue}>{activitySummary.steps.toLocaleString()}</Text>
                            <Text style={styles.activityLabel}>Steps</Text>
                        </View>

                        <View style={styles.activityCard}>
                            <Text style={styles.activityIcon}>🔥</Text>
                            <Text style={styles.activityValue}>{activitySummary.caloriesBurned}</Text>
                            <Text style={styles.activityLabel}>Calories</Text>
                        </View>

                        <View style={styles.activityCard}>
                            <Text style={styles.activityIcon}>⏱️</Text>
                            <Text style={styles.activityValue}>{activitySummary.activeMinutes}</Text>
                            <Text style={styles.activityLabel}>Active Min</Text>
                        </View>

                        <View style={styles.activityCard}>
                            <Text style={styles.activityIcon}>📏</Text>
                            <Text style={styles.activityValue}>{activitySummary.distance.toFixed(1)}</Text>
                            <Text style={styles.activityLabel}>km</Text>
                        </View>
                    </View>

                    {activitySummary.heartRateZones && (
                        <View style={styles.heartRateZones}>
                            <Text style={styles.heartRateTitle}>❤️ Heart Rate Zones</Text>
                            <View style={styles.zoneBar}>
                                <View style={[styles.zoneSegment, styles.zoneResting, { flex: activitySummary.heartRateZones.resting }]} />
                                <View style={[styles.zoneSegment, styles.zoneFatBurn, { flex: activitySummary.heartRateZones.fat_burn }]} />
                                <View style={[styles.zoneSegment, styles.zoneCardio, { flex: activitySummary.heartRateZones.cardio }]} />
                                <View style={[styles.zoneSegment, styles.zonePeak, { flex: activitySummary.heartRateZones.peak }]} />
                            </View>
                            <View style={styles.zoneLegend}>
                                <View style={styles.zoneLegendItem}>
                                    <View style={[styles.zoneLegendDot, styles.zoneResting]} />
                                    <Text style={styles.zoneLegendText}>Resting</Text>
                                </View>
                                <View style={styles.zoneLegendItem}>
                                    <View style={[styles.zoneLegendDot, styles.zoneFatBurn]} />
                                    <Text style={styles.zoneLegendText}>Fat Burn</Text>
                                </View>
                                <View style={styles.zoneLegendItem}>
                                    <View style={[styles.zoneLegendDot, styles.zoneCardio]} />
                                    <Text style={styles.zoneLegendText}>Cardio</Text>
                                </View>
                                <View style={styles.zoneLegendItem}>
                                    <View style={[styles.zoneLegendDot, styles.zonePeak]} />
                                    <Text style={styles.zoneLegendText}>Peak</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            )}

            {/* Last Night's Sleep */}
            {sleepSummary && (
                <View style={styles.sleepSection}>
                    <Text style={styles.sectionTitle}>Last Night's Sleep</Text>

                    <View style={styles.sleepCard}>
                        <View style={styles.sleepHeader}>
                            <Text style={styles.sleepQuality}>{sleepSummary.sleepQuality}%</Text>
                            <Text style={styles.sleepQualityLabel}>Sleep Quality</Text>
                        </View>

                        <View style={styles.sleepTime}>
                            <Text style={styles.sleepTimeValue}>{formatTime(sleepSummary.totalSleepTime)}</Text>
                            <Text style={styles.sleepTimeLabel}>Total Sleep</Text>
                        </View>

                        <View style={styles.sleepStages}>
                            <View style={styles.sleepStage}>
                                <Text style={styles.sleepStageIcon}>🌊</Text>
                                <Text style={styles.sleepStageLabel}>Deep</Text>
                                <Text style={styles.sleepStageValue}>{formatTime(sleepSummary.deepSleep)}</Text>
                            </View>
                            <View style={styles.sleepStage}>
                                <Text style={styles.sleepStageIcon}>💤</Text>
                                <Text style={styles.sleepStageLabel}>Light</Text>
                                <Text style={styles.sleepStageValue}>{formatTime(sleepSummary.lightSleep)}</Text>
                            </View>
                            <View style={styles.sleepStage}>
                                <Text style={styles.sleepStageIcon}>💭</Text>
                                <Text style={styles.sleepStageLabel}>REM</Text>
                                <Text style={styles.sleepStageValue}>{formatTime(sleepSummary.remSleep)}</Text>
                            </View>
                            <View style={styles.sleepStage}>
                                <Text style={styles.sleepStageIcon}>👁️</Text>
                                <Text style={styles.sleepStageLabel}>Awake</Text>
                                <Text style={styles.sleepStageValue}>{formatTime(sleepSummary.awakeTime)}</Text>
                            </View>
                        </View>

                        <View style={styles.sleepSchedule}>
                            <View style={styles.sleepScheduleItem}>
                                <Text style={styles.sleepScheduleLabel}>Bedtime</Text>
                                <Text style={styles.sleepScheduleValue}>🌙 {sleepSummary.bedtime}</Text>
                            </View>
                            <View style={styles.sleepScheduleItem}>
                                <Text style={styles.sleepScheduleLabel}>Wake up</Text>
                                <Text style={styles.sleepScheduleValue}>☀️ {sleepSummary.wakeupTime}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    devicesSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#2196f3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    deviceCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    deviceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    deviceIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    deviceInfo: {
        flex: 1,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    deviceModel: {
        fontSize: 13,
        color: '#666',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusBadgeConnected: {
        backgroundColor: '#e8f5e9',
    },
    statusBadgeDisconnected: {
        backgroundColor: '#ffebee',
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4caf50',
    },
    deviceStats: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 12,
    },
    deviceStat: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deviceStatIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    deviceStatText: {
        fontSize: 13,
        color: '#666',
    },
    syncButton: {
        backgroundColor: '#2196f3',
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    syncButtonDisabled: {
        backgroundColor: '#ccc',
    },
    syncButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    activitySection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    activityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    activityCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    activityIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    activityValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    activityLabel: {
        fontSize: 13,
        color: '#666',
    },
    heartRateZones: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
    },
    heartRateTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    zoneBar: {
        flexDirection: 'row',
        height: 30,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 12,
    },
    zoneSegment: {
        height: '100%',
    },
    zoneResting: {
        backgroundColor: '#90caf9',
    },
    zoneFatBurn: {
        backgroundColor: '#4caf50',
    },
    zoneCardio: {
        backgroundColor: '#ff9800',
    },
    zonePeak: {
        backgroundColor: '#f44336',
    },
    zoneLegend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    zoneLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    zoneLegendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6,
    },
    zoneLegendText: {
        fontSize: 12,
        color: '#666',
    },
    sleepSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    sleepCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
    },
    sleepHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    sleepQuality: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#2196f3',
    },
    sleepQualityLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    sleepTime: {
        alignItems: 'center',
        marginBottom: 20,
    },
    sleepTimeValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    sleepTimeLabel: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    sleepStages: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    sleepStage: {
        alignItems: 'center',
    },
    sleepStageIcon: {
        fontSize: 24,
        marginBottom: 6,
    },
    sleepStageLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    sleepStageValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    sleepSchedule: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    sleepScheduleItem: {
        alignItems: 'center',
    },
    sleepScheduleLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 6,
    },
    sleepScheduleValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
});
