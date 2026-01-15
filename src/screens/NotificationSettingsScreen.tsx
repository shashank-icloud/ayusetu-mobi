// Notification Settings Screen - Category 14
// Manage notification preferences and channels

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Switch,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { notificationsService } from '../services/notificationsService';
import { NotificationSettings, NotificationCategory, NotificationChannel } from '../../backend/types/notifications';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationSettings'>;

export default function NotificationSettingsScreen({ navigation }: Props) {
    const [settings, setSettings] = useState<NotificationSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await notificationsService.getNotificationSettings();
            setSettings(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load notification settings');
        } finally {
            setLoading(false);
        }
    };

    const updateChannelSetting = async (channel: keyof NotificationSettings['channels'], value: boolean) => {
        if (!settings) return;

        setSaving(true);
        try {
            const updated = await notificationsService.updateNotificationSettings({
                channels: { [channel]: value },
            });
            setSettings(updated);
        } catch (error) {
            Alert.alert('Error', 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const updateCategoryChannel = async (category: NotificationCategory, channels: NotificationChannel[]) => {
        if (!settings) return;

        setSaving(true);
        try {
            const updated = await notificationsService.updateNotificationSettings({
                category: {
                    category,
                    settings: { channels },
                },
            });
            setSettings(updated);
        } catch (error) {
            Alert.alert('Error', 'Failed to update category settings');
        } finally {
            setSaving(false);
        }
    };

    const toggleCategoryEnabled = async (category: NotificationCategory, enabled: boolean) => {
        if (!settings) return;

        setSaving(true);
        try {
            const updated = await notificationsService.updateNotificationSettings({
                category: {
                    category,
                    settings: { enabled },
                },
            });
            setSettings(updated);
        } catch (error) {
            Alert.alert('Error', 'Failed to update category');
        } finally {
            setSaving(false);
        }
    };

    const categoryInfo: Record<NotificationCategory, { label: string; icon: string; color: string }> = {
        health_record: { label: 'Health Records', icon: '📋', color: '#2196f3' },
        appointment: { label: 'Appointments', icon: '📅', color: '#4caf50' },
        medication: { label: 'Medications', icon: '💊', color: '#f44336' },
        consent_request: { label: 'Consent Requests', icon: '🔐', color: '#ff9800' },
        emergency: { label: 'Emergency', icon: '🚨', color: '#e91e63' },
        insurance: { label: 'Insurance', icon: '🛡️', color: '#9c27b0' },
        system: { label: 'System Updates', icon: '⚙️', color: '#607d8b' },
        marketing: { label: 'Marketing', icon: '📢', color: '#795548' },
    };

    const channelInfo: Record<NotificationChannel, { label: string; icon: string }> = {
        push: { label: 'Push', icon: '📲' },
        sms: { label: 'SMS', icon: '💬' },
        email: { label: 'Email', icon: '📧' },
        in_app: { label: 'In-App', icon: '🔔' },
    };

    if (loading || !settings) {
        return (
            <View style={styles.centered}>
                <Text style={styles.loadingText}>Loading settings...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Notification Settings</Text>
                <Text style={styles.subtitle}>Manage how you receive health updates</Text>
            </View>

            {/* Global Channels */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notification Channels</Text>
                <Text style={styles.sectionSubtitle}>Enable or disable notification methods globally</Text>

                {Object.entries(settings.channels).map(([channel, enabled]) => (
                    <View key={channel} style={styles.settingRow}>
                        <View style={styles.settingLeft}>
                            <Text style={styles.channelIcon}>
                                {channelInfo[channel as NotificationChannel].icon}
                            </Text>
                            <Text style={styles.settingLabel}>
                                {channelInfo[channel as NotificationChannel].label}
                            </Text>
                        </View>
                        <Switch
                            value={enabled}
                            onValueChange={(value) => updateChannelSetting(channel as keyof NotificationSettings['channels'], value)}
                            disabled={saving}
                        />
                    </View>
                ))}
            </View>

            {/* Sound & Vibration */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Alerts</Text>
                
                <View style={styles.settingRow}>
                    <View style={styles.settingLeft}>
                        <Text style={styles.channelIcon}>🔊</Text>
                        <Text style={styles.settingLabel}>Sound</Text>
                    </View>
                    <Switch
                        value={settings.soundEnabled}
                        onValueChange={async (value) => {
                            setSaving(true);
                            try {
                                const updated = await notificationsService.updateNotificationSettings({
                                    soundEnabled: value,
                                });
                                setSettings(updated);
                            } catch (error) {
                                Alert.alert('Error', 'Failed to update sound setting');
                            } finally {
                                setSaving(false);
                            }
                        }}
                        disabled={saving}
                    />
                </View>

                <View style={styles.settingRow}>
                    <View style={styles.settingLeft}>
                        <Text style={styles.channelIcon}>📳</Text>
                        <Text style={styles.settingLabel}>Vibration</Text>
                    </View>
                    <Switch
                        value={settings.vibrationEnabled}
                        onValueChange={async (value) => {
                            setSaving(true);
                            try {
                                const updated = await notificationsService.updateNotificationSettings({
                                    vibrationEnabled: value,
                                });
                                setSettings(updated);
                            } catch (error) {
                                Alert.alert('Error', 'Failed to update vibration setting');
                            } finally {
                                setSaving(false);
                            }
                        }}
                        disabled={saving}
                    />
                </View>
            </View>

            {/* Categories */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notification Categories</Text>
                <Text style={styles.sectionSubtitle}>Customize notifications by type</Text>

                {(Object.keys(settings.categories) as NotificationCategory[]).map((category) => {
                    const catSettings = settings.categories[category];
                    const info = categoryInfo[category];

                    return (
                        <View key={category} style={styles.categoryCard}>
                            <View style={styles.categoryHeader}>
                                <View style={styles.categoryLeft}>
                                    <Text style={styles.categoryIcon}>{info.icon}</Text>
                                    <View>
                                        <Text style={styles.categoryLabel}>{info.label}</Text>
                                        {catSettings.quietHours?.enabled && (
                                            <Text style={styles.quietHoursText}>
                                                🌙 Quiet: {catSettings.quietHours.startTime} - {catSettings.quietHours.endTime}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                <Switch
                                    value={catSettings.enabled}
                                    onValueChange={(value) => toggleCategoryEnabled(category, value)}
                                    disabled={saving}
                                />
                            </View>

                            {catSettings.enabled && (
                                <View style={styles.channelChips}>
                                    {(['push', 'sms', 'email', 'in_app'] as NotificationChannel[]).map((channel) => {
                                        const isEnabled = catSettings.channels.includes(channel);
                                        const globalEnabled = settings.channels[channel];

                                        return (
                                            <TouchableOpacity
                                                key={channel}
                                                style={[
                                                    styles.channelChip,
                                                    isEnabled && globalEnabled && styles.channelChipActive,
                                                    !globalEnabled && styles.channelChipDisabled,
                                                ]}
                                                onPress={() => {
                                                    if (!globalEnabled) {
                                                        Alert.alert(
                                                            'Channel Disabled',
                                                            `Please enable ${channelInfo[channel].label} in global settings first`
                                                        );
                                                        return;
                                                    }

                                                    const newChannels = isEnabled
                                                        ? catSettings.channels.filter(c => c !== channel)
                                                        : [...catSettings.channels, channel];
                                                    
                                                    updateCategoryChannel(category, newChannels);
                                                }}
                                                disabled={saving}
                                            >
                                                <Text style={styles.channelChipIcon}>
                                                    {channelInfo[channel].icon}
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.channelChipText,
                                                        isEnabled && globalEnabled && styles.channelChipTextActive,
                                                    ]}
                                                >
                                                    {channelInfo[channel].label}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>

            {/* Frequency */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Frequency</Text>
                
                <View style={styles.settingRow}>
                    <View style={styles.settingLeft}>
                        <Text style={styles.channelIcon}>📊</Text>
                        <View>
                            <Text style={styles.settingLabel}>Daily Digest</Text>
                            <Text style={styles.settingSubtext}>Combine non-urgent notifications</Text>
                        </View>
                    </View>
                    <Switch
                        value={settings.frequency.digestEnabled}
                        onValueChange={async (value) => {
                            setSaving(true);
                            try {
                                const updated = await notificationsService.updateNotificationSettings({
                                    frequency: { digestEnabled: value },
                                });
                                setSettings(updated);
                            } catch (error) {
                                Alert.alert('Error', 'Failed to update digest setting');
                            } finally {
                                setSaving(false);
                            }
                        }}
                        disabled={saving}
                    />
                </View>

                {settings.frequency.maxDailyNotifications && (
                    <View style={styles.infoCard}>
                        <Text style={styles.infoText}>
                            ℹ️ Maximum {settings.frequency.maxDailyNotifications} notifications per day
                        </Text>
                    </View>
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
        fontSize: 16,
        color: '#666',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#666',
        marginBottom: 16,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    channelIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    settingLabel: {
        fontSize: 16,
        color: '#333',
    },
    settingSubtext: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    categoryCard: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#fafafa',
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    categoryLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    quietHoursText: {
        fontSize: 11,
        color: '#666',
        marginTop: 2,
    },
    channelChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    channelChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    channelChipActive: {
        backgroundColor: '#2196f3',
        borderColor: '#2196f3',
    },
    channelChipDisabled: {
        opacity: 0.5,
    },
    channelChipIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    channelChipText: {
        fontSize: 12,
        color: '#666',
    },
    channelChipTextActive: {
        color: '#fff',
        fontWeight: '500',
    },
    infoCard: {
        backgroundColor: '#e3f2fd',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    infoText: {
        fontSize: 13,
        color: '#1976d2',
    },
});
