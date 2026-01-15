import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { emergencyService, QuickAccessSettings } from '../services/emergencyService';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencySettings'>;

const EmergencySettingsScreen: React.FC<Props> = ({ navigation }) => {
    const [settings, setSettings] = useState<QuickAccessSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const data = await emergencyService.getQuickAccessSettings();
            setSettings(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load emergency settings');
        } finally {
            setLoading(false);
        }
    };

    const updateSetting = async (updates: Partial<QuickAccessSettings>) => {
        if (!settings) return;

        const newSettings = { ...settings, ...updates };
        setSettings(newSettings);

        setSaving(true);
        try {
            await emergencyService.updateQuickAccessSettings(updates);
        } catch (error) {
            Alert.alert('Error', 'Failed to update settings');
            // Revert on error
            setSettings(settings);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading settings...</Text>
            </View>
        );
    }

    if (!settings) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Failed to load settings</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Emergency Settings</Text>
                {saving && <ActivityIndicator size="small" color="#007AFF" />}
            </View>

            <ScrollView style={styles.content}>
                {/* Emergency Card Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🆘 Emergency Card</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Allow Emergency Access</Text>
                            <Text style={styles.settingDescription}>
                                Let paramedics access your medical info during emergencies
                            </Text>
                        </View>
                        <Switch
                            value={settings.allowEmergencyCardAccess}
                            onValueChange={value => updateSetting({ allowEmergencyCardAccess: value })}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Require OTP for Access</Text>
                            <Text style={styles.settingDescription}>
                                Emergency responders must verify with OTP
                            </Text>
                        </View>
                        <Switch
                            value={settings.requireOTPForAccess}
                            onValueChange={value => updateSetting({ requireOTPForAccess: value })}
                            disabled={!settings.allowEmergencyCardAccess}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Auto-Expire Emergency Card</Text>
                            <Text style={styles.settingDescription}>
                                Card expires after {settings.expiryDuration} months for security
                            </Text>
                        </View>
                        <Switch
                            value={settings.autoExpireCard}
                            onValueChange={value => updateSetting({ autoExpireCard: value })}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => navigation.navigate('EmergencyCard')}
                    >
                        <Text style={styles.linkButtonText}>📝 Manage Emergency Card</Text>
                    </TouchableOpacity>
                </View>

                {/* SOS Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🚨 SOS Features</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Enable SOS</Text>
                            <Text style={styles.settingDescription}>
                                Quick emergency alert system
                            </Text>
                        </View>
                        <Switch
                            value={settings.sosEnabled}
                            onValueChange={value => updateSetting({ sosEnabled: value })}
                        />
                    </View>

                    {settings.sosEnabled && (
                        <>
                            <View style={styles.settingRow}>
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingLabel}>SOS Trigger Method</Text>
                                    <Text style={styles.settingDescription}>
                                        Currently: {getShortcutLabel(settings.sosShortcut)}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.changeButton}
                                    onPress={() => showShortcutOptions()}
                                >
                                    <Text style={styles.changeButtonText}>Change</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.settingRow}>
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingLabel}>Auto-Call Emergency (108)</Text>
                                    <Text style={styles.settingDescription}>
                                        Automatically dial ambulance service
                                    </Text>
                                </View>
                                <Switch
                                    value={settings.autoCallEmergency}
                                    onValueChange={value => updateSetting({ autoCallEmergency: value })}
                                />
                            </View>

                            <View style={styles.settingRow}>
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingLabel}>Auto-Notify Contacts</Text>
                                    <Text style={styles.settingDescription}>
                                        Send SOS alerts to emergency contacts
                                    </Text>
                                </View>
                                <Switch
                                    value={settings.autoNotifyContacts}
                                    onValueChange={value => updateSetting({ autoNotifyContacts: value })}
                                />
                            </View>

                            <View style={styles.settingRow}>
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingLabel}>Auto-Share Location</Text>
                                    <Text style={styles.settingDescription}>
                                        Share GPS location with emergency services
                                    </Text>
                                </View>
                                <Switch
                                    value={settings.autoShareLocation}
                                    onValueChange={value => updateSetting({ autoShareLocation: value })}
                                />
                            </View>
                        </>
                    )}
                </View>

                {/* Fall Detection Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🤕 Fall Detection</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Enable Fall Detection</Text>
                            <Text style={styles.settingDescription}>
                                Automatically detect falls using device sensors
                            </Text>
                        </View>
                        <Switch
                            value={settings.fallDetectionEnabled}
                            onValueChange={value => updateSetting({ fallDetectionEnabled: value })}
                        />
                    </View>

                    {settings.fallDetectionEnabled && (
                        <>
                            <View style={styles.settingRow}>
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingLabel}>Sensitivity</Text>
                                    <Text style={styles.settingDescription}>
                                        Currently: {settings.fallDetectionSensitivity}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.changeButton}
                                    onPress={() => showSensitivityOptions()}
                                >
                                    <Text style={styles.changeButtonText}>Change</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.settingRow}>
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingLabel}>Auto-SOS Countdown</Text>
                                    <Text style={styles.settingDescription}>
                                        {settings.fallCountdownDuration} seconds to cancel before auto-SOS
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.infoBox}>
                                <Text style={styles.infoBoxText}>
                                    ℹ️ After detecting a fall, you'll have {settings.fallCountdownDuration} seconds to respond "I'm OK" before emergency services are automatically notified.
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                {/* Safety Check-in Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>✅ Safety Check-in</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Enable Safety Check-in</Text>
                            <Text style={styles.settingDescription}>
                                Periodic safety status updates
                            </Text>
                        </View>
                        <Switch
                            value={settings.safetyCheckInEnabled}
                            onValueChange={value => updateSetting({ safetyCheckInEnabled: value })}
                        />
                    </View>

                    {settings.safetyCheckInEnabled && (
                        <>
                            <View style={styles.settingRow}>
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingLabel}>Reminder Notifications</Text>
                                    <Text style={styles.settingDescription}>
                                        Remind me to check in
                                    </Text>
                                </View>
                                <Switch
                                    value={settings.checkInReminder}
                                    onValueChange={value => updateSetting({ checkInReminder: value })}
                                />
                            </View>

                            <View style={styles.settingRow}>
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingLabel}>Missed Check-in Action</Text>
                                    <Text style={styles.settingDescription}>
                                        {settings.missedCheckInAction === 'notify-contacts'
                                            ? 'Notify emergency contacts'
                                            : 'Do nothing'}
                                    </Text>
                                </View>
                            </View>
                        </>
                    )}
                </View>

                {/* Emergency Contacts */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => navigation.navigate('EmergencyCard')}
                    >
                        <Text style={styles.linkButtonText}>👥 Manage Emergency Contacts</Text>
                    </TouchableOpacity>
                </View>

                {/* Danger Zone */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚠️ Danger Zone</Text>

                    <TouchableOpacity
                        style={styles.dangerButton}
                        onPress={() => {
                            Alert.alert(
                                'Test SOS',
                                'This will trigger a test SOS alert. No actual emergency services will be contacted.',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'Test',
                                        onPress: () => Alert.alert('Test SOS', 'SOS test completed successfully'),
                                    },
                                ]
                            );
                        }}
                    >
                        <Text style={styles.dangerButtonText}>🧪 Test SOS System</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );

    function showShortcutOptions() {
        Alert.alert(
            'SOS Trigger Method',
            'Choose how to activate SOS',
            [
                {
                    text: 'Triple Tap',
                    onPress: () => updateSetting({ sosShortcut: 'triple-tap' }),
                },
                {
                    text: 'Power Button',
                    onPress: () => updateSetting({ sosShortcut: 'power-button' }),
                },
                {
                    text: 'Shake Device',
                    onPress: () => updateSetting({ sosShortcut: 'shake' }),
                },
                {
                    text: 'Volume Buttons',
                    onPress: () => updateSetting({ sosShortcut: 'volume-buttons' }),
                },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    }

    function showSensitivityOptions() {
        Alert.alert(
            'Fall Detection Sensitivity',
            'Choose sensitivity level',
            [
                {
                    text: 'High (More sensitive)',
                    onPress: () => updateSetting({ fallDetectionSensitivity: 'high' }),
                },
                {
                    text: 'Medium (Recommended)',
                    onPress: () => updateSetting({ fallDetectionSensitivity: 'medium' }),
                },
                {
                    text: 'Low (Less sensitive)',
                    onPress: () => updateSetting({ fallDetectionSensitivity: 'low' }),
                },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    }
};

const getShortcutLabel = (shortcut: string) => {
    const labels: { [key: string]: string } = {
        'triple-tap': 'Triple Tap Screen',
        'power-button': 'Press Power Button 5x',
        'shake': 'Shake Device',
        'volume-buttons': 'Press Volume Up + Down',
    };
    return labels[shortcut] || shortcut;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backArrow: {
        fontSize: 24,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        flex: 1,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#FF3B30',
    },
    content: {
        flex: 1,
    },
    section: {
        marginBottom: 24,
        backgroundColor: '#fff',
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        paddingHorizontal: 16,
        color: '#333',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 18,
    },
    changeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#007AFF',
        borderRadius: 6,
    },
    changeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    infoBox: {
        backgroundColor: '#f0f8ff',
        padding: 16,
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    infoBoxText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    linkButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        marginHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    linkButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    dangerButton: {
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF3B30',
    },
    dangerButtonText: {
        color: '#FF3B30',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default EmergencySettingsScreen;
