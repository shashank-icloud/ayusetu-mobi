import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { securityService } from '../services/securityService';
import type { SecuritySettings, PrivacyShieldScore } from '../services/securityService';

const SecuritySettingsScreen: React.FC = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<SecuritySettings | null>(null);
    const [privacyScore, setPrivacyScore] = useState<PrivacyShieldScore | null>(null);

    useEffect(() => {
        loadSecuritySettings();
    }, []);

    const loadSecuritySettings = async () => {
        try {
            setLoading(true);
            const [settingsData, scoreData] = await Promise.all([
                securityService.getSecuritySettings(),
                securityService.getPrivacyShieldScore(),
            ]);
            setSettings(settingsData);
            setPrivacyScore(scoreData);
        } catch (error) {
            console.error('Error loading security settings:', error);
            Alert.alert('Error', 'Failed to load security settings');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSwitch = async (key: keyof SecuritySettings, value: boolean) => {
        if (!settings) return;

        try {
            const updated = await securityService.updateSecuritySettings({
                [key]: value,
            });
            setSettings(updated);

            // Reload privacy score after changes
            const scoreData = await securityService.getPrivacyShieldScore();
            setPrivacyScore(scoreData);
        } catch (error) {
            console.error('Error updating setting:', error);
            Alert.alert('Error', 'Failed to update security setting');
        }
    };

    const handleSetupPIN = () => {
        navigation.navigate('SetupPIN' as never);
    };

    const handleChangePIN = () => {
        navigation.navigate('ChangePIN' as never);
    };

    const handleRemovePIN = async () => {
        Alert.alert(
            'Remove PIN',
            'Are you sure you want to remove your PIN? This will reduce your security.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await securityService.removePIN();
                            await loadSecuritySettings();
                            Alert.alert('Success', 'PIN removed successfully');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to remove PIN');
                        }
                    },
                },
            ]
        );
    };

    const handleEnableBiometric = async () => {
        try {
            await securityService.enableBiometric({
                biometricType: 'fingerprint',
            });
            await loadSecuritySettings();
            Alert.alert('Success', 'Biometric authentication enabled');
        } catch (error) {
            Alert.alert('Error', 'Failed to enable biometric authentication');
        }
    };

    const handleDisableBiometric = async () => {
        Alert.alert(
            'Disable Biometric',
            'Are you sure you want to disable biometric authentication?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Disable',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await securityService.disableBiometric();
                            await loadSecuritySettings();
                            Alert.alert('Success', 'Biometric authentication disabled');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to disable biometric authentication');
                        }
                    },
                },
            ]
        );
    };

    const getScoreColor = (score: number): string => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const getScoreLabel = (level: string): string => {
        switch (level) {
            case 'high': return 'Strong';
            case 'medium': return 'Moderate';
            case 'low': return 'Weak';
            default: return 'Unknown';
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading security settings...</Text>
            </View>
        );
    }

    if (!settings || !privacyScore) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load security settings</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadSecuritySettings}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Privacy Shield Score */}
            <View style={styles.scoreCard}>
                <Text style={styles.scoreTitle}>Privacy Shield Score</Text>
                <View style={styles.scoreCircle}>
                    <Text style={[styles.scoreValue, { color: getScoreColor(privacyScore.score) }]}>
                        {privacyScore.score}
                    </Text>
                    <Text style={styles.scoreLabel}>{getScoreLabel(privacyScore.level)}</Text>
                </View>

                {privacyScore.strengths.length > 0 && (
                    <View style={styles.scoreSection}>
                        <Text style={styles.scoreSectionTitle}>✓ Strengths</Text>
                        {privacyScore.strengths.map((strength, index) => (
                            <Text key={index} style={styles.strengthText}>• {strength}</Text>
                        ))}
                    </View>
                )}

                {privacyScore.recommendations.length > 0 && (
                    <View style={styles.scoreSection}>
                        <Text style={styles.scoreSectionTitle}>⚠ Recommendations</Text>
                        {privacyScore.recommendations.map((rec, index) => (
                            <Text key={index} style={styles.recommendationText}>• {rec}</Text>
                        ))}
                    </View>
                )}
            </View>

            {/* Authentication Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Authentication</Text>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>PIN Protection</Text>
                        <Text style={styles.settingDescription}>
                            {settings.pinEnabled ? 'PIN is active' : 'Set a PIN to secure your app'}
                        </Text>
                    </View>
                    {settings.pinEnabled ? (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.smallButton} onPress={handleChangePIN}>
                                <Text style={styles.smallButtonText}>Change</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.smallButton, styles.dangerButton]} onPress={handleRemovePIN}>
                                <Text style={styles.smallButtonText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.setupButton} onPress={handleSetupPIN}>
                            <Text style={styles.setupButtonText}>Setup</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Biometric Authentication</Text>
                        <Text style={styles.settingDescription}>
                            Use fingerprint or face recognition
                        </Text>
                    </View>
                    {settings.biometricEnabled ? (
                        <TouchableOpacity style={[styles.smallButton, styles.dangerButton]} onPress={handleDisableBiometric}>
                            <Text style={styles.smallButtonText}>Disable</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.setupButton} onPress={handleEnableBiometric}>
                            <Text style={styles.setupButtonText}>Enable</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Device Security Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Device Security</Text>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Device Binding</Text>
                        <Text style={styles.settingDescription}>
                            Restrict access to trusted devices only
                        </Text>
                    </View>
                    <Switch
                        value={settings.deviceBindingEnabled}
                        onValueChange={(value) => handleToggleSwitch('deviceBindingEnabled', value)}
                        trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                        thumbColor={settings.deviceBindingEnabled ? '#3b82f6' : '#f3f4f6'}
                    />
                </View>

                <TouchableOpacity
                    style={styles.linkRow}
                    onPress={() => navigation.navigate('DeviceManagement' as never)}
                >
                    <Text style={styles.linkText}>Manage Trusted Devices</Text>
                    <Text style={styles.linkArrow}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkRow}
                    onPress={() => navigation.navigate('SessionManagement' as never)}
                >
                    <Text style={styles.linkText}>Active Sessions</Text>
                    <Text style={styles.linkArrow}>→</Text>
                </TouchableOpacity>
            </View>

            {/* Session Management Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Session Settings</Text>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Auto-Lock</Text>
                        <Text style={styles.settingDescription}>
                            Lock app after {settings.autoLockDuration} minutes of inactivity
                        </Text>
                    </View>
                    <Switch
                        value={settings.autoLockEnabled}
                        onValueChange={(value) => handleToggleSwitch('autoLockEnabled', value)}
                        trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                        thumbColor={settings.autoLockEnabled ? '#3b82f6' : '#f3f4f6'}
                    />
                </View>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Logout on Screen Lock</Text>
                        <Text style={styles.settingDescription}>
                            Automatically logout when device is locked
                        </Text>
                    </View>
                    <Switch
                        value={settings.logoutOnScreenLock}
                        onValueChange={(value) => handleToggleSwitch('logoutOnScreenLock', value)}
                        trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                        thumbColor={settings.logoutOnScreenLock ? '#3b82f6' : '#f3f4f6'}
                    />
                </View>
            </View>

            {/* Privacy Controls Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Privacy Controls</Text>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Screenshot Prevention</Text>
                        <Text style={styles.settingDescription}>
                            Prevent screenshots of sensitive data
                        </Text>
                    </View>
                    <Switch
                        value={settings.screenshotPrevention}
                        onValueChange={(value) => handleToggleSwitch('screenshotPrevention', value)}
                        trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                        thumbColor={settings.screenshotPrevention ? '#3b82f6' : '#f3f4f6'}
                    />
                </View>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Hide Notification Content</Text>
                        <Text style={styles.settingDescription}>
                            Only show app name in notifications
                        </Text>
                    </View>
                    <Switch
                        value={settings.hideNotificationContent}
                        onValueChange={(value) => handleToggleSwitch('hideNotificationContent', value)}
                        trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                        thumbColor={settings.hideNotificationContent ? '#3b82f6' : '#f3f4f6'}
                    />
                </View>

                <TouchableOpacity
                    style={styles.linkRow}
                    onPress={() => navigation.navigate('DataVisibilitySettings' as never)}
                >
                    <Text style={styles.linkText}>Data Visibility Settings</Text>
                    <Text style={styles.linkArrow}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkRow}
                    onPress={() => navigation.navigate('SectionLockSettings' as never)}
                >
                    <Text style={styles.linkText}>Section Lock Settings</Text>
                    <Text style={styles.linkArrow}>→</Text>
                </TouchableOpacity>
            </View>

            {/* Alerts Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Security Alerts</Text>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Login Alerts</Text>
                        <Text style={styles.settingDescription}>
                            Notify me of successful logins
                        </Text>
                    </View>
                    <Switch
                        value={settings.loginAlerts}
                        onValueChange={(value) => handleToggleSwitch('loginAlerts', value)}
                        trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                        thumbColor={settings.loginAlerts ? '#3b82f6' : '#f3f4f6'}
                    />
                </View>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>New Device Alerts</Text>
                        <Text style={styles.settingDescription}>
                            Notify me when a new device is added
                        </Text>
                    </View>
                    <Switch
                        value={settings.newDeviceAlerts}
                        onValueChange={(value) => handleToggleSwitch('newDeviceAlerts', value)}
                        trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                        thumbColor={settings.newDeviceAlerts ? '#3b82f6' : '#f3f4f6'}
                    />
                </View>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Suspicious Activity Alerts</Text>
                        <Text style={styles.settingDescription}>
                            Notify me of unusual account activity
                        </Text>
                    </View>
                    <Switch
                        value={settings.suspiciousActivityAlerts}
                        onValueChange={(value) => handleToggleSwitch('suspiciousActivityAlerts', value)}
                        trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                        thumbColor={settings.suspiciousActivityAlerts ? '#3b82f6' : '#f3f4f6'}
                    />
                </View>

                <TouchableOpacity
                    style={styles.linkRow}
                    onPress={() => navigation.navigate('SecurityEvents' as never)}
                >
                    <Text style={styles.linkText}>View Security Events</Text>
                    <Text style={styles.linkArrow}>→</Text>
                </TouchableOpacity>
            </View>

            {/* Advanced Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Advanced</Text>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Re-authenticate for Sensitive Actions</Text>
                        <Text style={styles.settingDescription}>
                            Require authentication before consent, deletion, etc.
                        </Text>
                    </View>
                    <Switch
                        value={settings.requireReAuthForSensitiveActions}
                        onValueChange={(value) => handleToggleSwitch('requireReAuthForSensitiveActions', value)}
                        trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                        thumbColor={settings.requireReAuthForSensitiveActions ? '#3b82f6' : '#f3f4f6'}
                    />
                </View>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
                        <Text style={styles.settingDescription}>
                            Add an extra layer of security (coming soon)
                        </Text>
                    </View>
                    <Switch
                        value={settings.twoFactorEnabled}
                        onValueChange={(value) => handleToggleSwitch('twoFactorEnabled', value)}
                        disabled={true}
                        trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                        thumbColor={'#9ca3af'}
                    />
                </View>
            </View>
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#ef4444',
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    scoreCard: {
        backgroundColor: '#ffffff',
        margin: 16,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scoreTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
        textAlign: 'center',
    },
    scoreCircle: {
        alignItems: 'center',
        marginBottom: 20,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: '700',
    },
    scoreLabel: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 4,
    },
    scoreSection: {
        marginTop: 16,
    },
    scoreSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    strengthText: {
        fontSize: 14,
        color: '#10b981',
        marginBottom: 4,
    },
    recommendationText: {
        fontSize: 14,
        color: '#f59e0b',
        marginBottom: 4,
    },
    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    settingInfo: {
        flex: 1,
        marginRight: 12,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#6b7280',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    smallButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    dangerButton: {
        backgroundColor: '#ef4444',
    },
    smallButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    setupButton: {
        backgroundColor: '#10b981',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    setupButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    linkRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    linkText: {
        fontSize: 15,
        color: '#3b82f6',
        fontWeight: '500',
    },
    linkArrow: {
        fontSize: 18,
        color: '#9ca3af',
    },
});

export default SecuritySettingsScreen;
