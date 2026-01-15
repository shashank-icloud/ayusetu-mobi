// Cloud Storage Management Screen - Category 15
// Manage backups, storage usage, and sync settings

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Switch,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { monetizationService } from '../services/monetizationService';
import {
    CloudStorage,
    StorageBreakdown,
    BackupSettings,
    BackupHistory,
    StoragePlan,
} from '../../backend/types/monetization';

type Props = NativeStackScreenProps<RootStackParamList, 'CloudStorage'>;

export default function CloudStorageScreen({ navigation }: Props) {
    const [storage, setStorage] = useState<CloudStorage | null>(null);
    const [breakdown, setBreakdown] = useState<StorageBreakdown[]>([]);
    const [backupSettings, setBackupSettings] = useState<BackupSettings | null>(null);
    const [backupHistory, setBackupHistory] = useState<BackupHistory[]>([]);
    const [storagePlans, setStoragePlans] = useState<StoragePlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [backingUp, setBackingUp] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [storageData, breakdownData, settingsData, historyData, plansData] = await Promise.all([
                monetizationService.getCloudStorage('user-123'),
                monetizationService.getStorageBreakdown('user-123'),
                monetizationService.getBackupSettings('user-123'),
                monetizationService.getBackupHistory('user-123'),
                monetizationService.getStoragePlans(),
            ]);
            setStorage(storageData);
            setBreakdown(breakdownData);
            setBackupSettings(settingsData);
            setBackupHistory(historyData);
            setStoragePlans(plansData);
        } catch (error) {
            Alert.alert('Error', 'Failed to load storage data');
        } finally {
            setLoading(false);
        }
    };

    const handleTriggerBackup = async () => {
        if (!backupSettings?.enabled) {
            Alert.alert('Backup Disabled', 'Please enable backups in settings first.');
            return;
        }

        setBackingUp(true);
        try {
            const newBackup = await monetizationService.triggerManualBackup('user-123');
            setBackupHistory([newBackup, ...backupHistory]);
            Alert.alert('Success', 'Backup completed successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to create backup');
        } finally {
            setBackingUp(false);
        }
    };

    const handleUpdateBackupSettings = async (updates: Partial<BackupSettings>) => {
        if (!backupSettings) return;

        try {
            const updated = await monetizationService.updateBackupSettings('user-123', updates);
            setBackupSettings(updated);
        } catch (error) {
            Alert.alert('Error', 'Failed to update settings');
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'medical_records': return '🩺';
            case 'prescriptions': return '💊';
            case 'lab_results': return '🧪';
            case 'imaging': return '🔬';
            case 'documents': return '📄';
            default: return '📦';
        }
    };

    const getBackupFrequencyLabel = (frequency: string) => {
        switch (frequency) {
            case 'manual': return 'Manual only';
            case 'daily': return 'Every day';
            case 'weekly': return 'Every week';
            case 'realtime': return 'Real-time sync';
            default: return frequency;
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196f3" />
                <Text style={styles.loadingText}>Loading storage data...</Text>
            </View>
        );
    }

    if (!storage || !backupSettings) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load storage information</Text>
            </View>
        );
    }

    const storagePercentage = (storage.usedStorage / storage.totalStorage) * 100;

    return (
        <ScrollView style={styles.container}>
            {/* Storage Overview */}
            <View style={styles.overviewSection}>
                <Text style={styles.sectionTitle}>Storage Overview</Text>
                
                <View style={styles.storageCard}>
                    <View style={styles.storageHeader}>
                        <Text style={styles.storageTitle}>Cloud Storage</Text>
                        <View style={styles.tierBadge}>
                            <Text style={styles.tierBadgeText}>{storage.tier.toUpperCase()}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.storageBar}>
                        <View style={[styles.storageBarFill, { width: `${storagePercentage}%` }]} />
                    </View>
                    
                    <View style={styles.storageStats}>
                        <Text style={styles.storageUsed}>
                            {formatBytes(storage.usedStorage)} used
                        </Text>
                        <Text style={styles.storageTotal}>
                            of {formatBytes(storage.totalStorage)}
                        </Text>
                    </View>
                    
                    <View style={styles.storageDetails}>
                        <View style={styles.storageDetailItem}>
                            <Text style={styles.storageDetailIcon}>📁</Text>
                            <Text style={styles.storageDetailText}>{storage.fileCount} files</Text>
                        </View>
                        <View style={styles.storageDetailItem}>
                            <Text style={styles.storageDetailIcon}>💾</Text>
                            <Text style={styles.storageDetailText}>
                                {formatBytes(storage.availableStorage)} available
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Storage Breakdown */}
            <View style={styles.breakdownSection}>
                <Text style={styles.sectionTitle}>Storage Breakdown</Text>
                
                {breakdown.map((item, index) => (
                    <View key={index} style={styles.breakdownItem}>
                        <View style={styles.breakdownHeader}>
                            <View style={styles.breakdownLeft}>
                                <Text style={styles.breakdownIcon}>{getCategoryIcon(item.category)}</Text>
                                <View>
                                    <Text style={styles.breakdownCategory}>
                                        {item.category.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </Text>
                                    <Text style={styles.breakdownCount}>{item.fileCount} files</Text>
                                </View>
                            </View>
                            <Text style={styles.breakdownSize}>{formatBytes(item.size)}</Text>
                        </View>
                        <View style={styles.breakdownBar}>
                            <View style={[styles.breakdownBarFill, { width: `${item.percentage}%` }]} />
                        </View>
                        <Text style={styles.breakdownPercentage}>{item.percentage.toFixed(1)}%</Text>
                    </View>
                ))}
            </View>

            {/* Backup Settings */}
            <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Backup Settings</Text>
                
                <View style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Auto Backup</Text>
                        <Text style={styles.settingDescription}>
                            Automatically backup your data
                        </Text>
                    </View>
                    <Switch
                        value={backupSettings.enabled}
                        onValueChange={(value) => handleUpdateBackupSettings({ enabled: value })}
                        trackColor={{ false: '#ccc', true: '#4caf50' }}
                        thumbColor="#fff"
                    />
                </View>

                {backupSettings.enabled && (
                    <>
                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Backup Frequency</Text>
                                <Text style={styles.settingDescription}>
                                    {getBackupFrequencyLabel(backupSettings.frequency)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Include Attachments</Text>
                                <Text style={styles.settingDescription}>
                                    Backup images and documents
                                </Text>
                            </View>
                            <Switch
                                value={backupSettings.includeAttachments}
                                onValueChange={(value) => handleUpdateBackupSettings({ includeAttachments: value })}
                                trackColor={{ false: '#ccc', true: '#4caf50' }}
                                thumbColor="#fff"
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>WiFi Only</Text>
                                <Text style={styles.settingDescription}>
                                    Only backup when connected to WiFi
                                </Text>
                            </View>
                            <Switch
                                value={backupSettings.wifiOnly}
                                onValueChange={(value) => handleUpdateBackupSettings({ wifiOnly: value })}
                                trackColor={{ false: '#ccc', true: '#4caf50' }}
                                thumbColor="#fff"
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Encrypt Backups</Text>
                                <Text style={styles.settingDescription}>
                                    🔒 End-to-end encryption
                                </Text>
                            </View>
                            <Switch
                                value={backupSettings.encryptBackups}
                                onValueChange={(value) => handleUpdateBackupSettings({ encryptBackups: value })}
                                trackColor={{ false: '#ccc', true: '#4caf50' }}
                                thumbColor="#fff"
                            />
                        </View>
                    </>
                )}

                <TouchableOpacity
                    style={[styles.backupButton, backingUp && styles.backupButtonDisabled]}
                    onPress={handleTriggerBackup}
                    disabled={backingUp || !backupSettings.enabled}
                >
                    {backingUp ? (
                        <>
                            <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.backupButtonText}>Backing up...</Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.backupButtonIcon}>☁️</Text>
                            <Text style={styles.backupButtonText}>Backup Now</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Backup History */}
            <View style={styles.historySection}>
                <Text style={styles.sectionTitle}>Backup History</Text>
                
                {backupHistory.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>📦</Text>
                        <Text style={styles.emptyText}>No backups yet</Text>
                    </View>
                ) : (
                    backupHistory.map((backup, index) => (
                        <View key={backup.id} style={styles.historyItem}>
                            <View style={styles.historyLeft}>
                                <Text style={[
                                    styles.historyStatus,
                                    backup.status === 'completed' && styles.historyStatusCompleted,
                                    backup.status === 'failed' && styles.historyStatusFailed,
                                ]}>
                                    {backup.status === 'completed' ? '✓' : '✗'}
                                </Text>
                                <View>
                                    <Text style={styles.historyDate}>
                                        {new Date(backup.backupDate).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </Text>
                                    <Text style={styles.historyDetails}>
                                        {formatBytes(backup.size)} • {backup.fileCount} files • {formatDuration(backup.duration)}
                                    </Text>
                                </View>
                            </View>
                            {backup.errorMessage && (
                                <Text style={styles.historyError}>{backup.errorMessage}</Text>
                            )}
                        </View>
                    ))
                )}
            </View>

            {/* Storage Plans */}
            <View style={styles.plansSection}>
                <Text style={styles.sectionTitle}>Upgrade Storage</Text>
                <Text style={styles.sectionSubtitle}>
                    Need more space? Choose a plan that fits your needs
                </Text>
                
                {storagePlans.map((plan) => {
                    const isCurrentPlan = plan.tier === storage.tier;
                    
                    return (
                        <View
                            key={plan.id}
                            style={[
                                styles.planCard,
                                isCurrentPlan && styles.planCardCurrent,
                            ]}
                        >
                            <View style={styles.planHeader}>
                                <Text style={styles.planName}>{plan.name}</Text>
                                {isCurrentPlan && (
                                    <View style={styles.currentBadge}>
                                        <Text style={styles.currentBadgeText}>Current</Text>
                                    </View>
                                )}
                            </View>
                            
                            <View style={styles.planPricing}>
                                <Text style={styles.planPrice}>₹{plan.price}</Text>
                                <Text style={styles.planPeriod}>/{plan.billingPeriod}</Text>
                            </View>
                            
                            <Text style={styles.planStorage}>
                                💾 {plan.storage === -1 ? 'Unlimited' : `${plan.storage}GB`} storage
                            </Text>
                            
                            <View style={styles.planFeatures}>
                                {plan.features.map((feature, index) => (
                                    <Text key={index} style={styles.planFeature}>
                                        • {feature}
                                    </Text>
                                ))}
                            </View>
                            
                            {!isCurrentPlan && (
                                <TouchableOpacity style={styles.planButton}>
                                    <Text style={styles.planButtonText}>Upgrade</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}
            </View>
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    overviewSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    storageCard: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
    },
    storageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    storageTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    tierBadge: {
        backgroundColor: '#2196f3',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tierBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    storageBar: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 12,
    },
    storageBarFill: {
        height: '100%',
        backgroundColor: '#2196f3',
    },
    storageStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    storageUsed: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    storageTotal: {
        fontSize: 14,
        color: '#666',
    },
    storageDetails: {
        flexDirection: 'row',
        gap: 16,
    },
    storageDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    storageDetailIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    storageDetailText: {
        fontSize: 14,
        color: '#666',
    },
    breakdownSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    breakdownItem: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    breakdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    breakdownLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    breakdownIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    breakdownCategory: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    breakdownCount: {
        fontSize: 12,
        color: '#666',
    },
    breakdownSize: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2196f3',
    },
    breakdownBar: {
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 4,
    },
    breakdownBarFill: {
        height: '100%',
        backgroundColor: '#2196f3',
    },
    breakdownPercentage: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
    },
    settingsSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingInfo: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#666',
    },
    backupButton: {
        marginTop: 16,
        backgroundColor: '#2196f3',
        padding: 14,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backupButtonDisabled: {
        backgroundColor: '#ccc',
    },
    backupButtonIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    backupButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    historySection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    historyItem: {
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 8,
    },
    historyLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    historyStatus: {
        width: 24,
        height: 24,
        borderRadius: 12,
        textAlign: 'center',
        lineHeight: 24,
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 12,
    },
    historyStatusCompleted: {
        backgroundColor: '#4caf50',
        color: '#fff',
    },
    historyStatusFailed: {
        backgroundColor: '#f44336',
        color: '#fff',
    },
    historyDate: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    historyDetails: {
        fontSize: 12,
        color: '#666',
    },
    historyError: {
        fontSize: 12,
        color: '#f44336',
        marginTop: 8,
        marginLeft: 36,
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
        fontSize: 14,
        color: '#666',
    },
    plansSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    planCard: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    planCardCurrent: {
        borderColor: '#4caf50',
        backgroundColor: '#f1f8e9',
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    planName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    currentBadge: {
        backgroundColor: '#4caf50',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    currentBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    planPricing: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    planPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    planPeriod: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    planStorage: {
        fontSize: 14,
        color: '#555',
        marginBottom: 12,
    },
    planFeatures: {
        marginBottom: 12,
    },
    planFeature: {
        fontSize: 13,
        color: '#666',
        marginBottom: 6,
    },
    planButton: {
        backgroundColor: '#2196f3',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    planButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
