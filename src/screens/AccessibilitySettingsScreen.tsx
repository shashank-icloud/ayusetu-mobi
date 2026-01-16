import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import accessibilityService, { AccessibilitySettings, TextSize, ThemeMode, VoiceGender, VoiceSpeed } from '../services/accessibilityService';

type Props = NativeStackScreenProps<RootStackParamList, 'AccessibilitySettings'>;

export default function AccessibilitySettingsScreen({ navigation }: Props) {
    const [settings, setSettings] = useState<AccessibilitySettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await accessibilityService.getAccessibilitySettings();
            setSettings(data);
        } catch (error) {
            console.error('Failed to load accessibility settings:', error);
            Alert.alert('Error', 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const updateSetting = async (key: keyof AccessibilitySettings, value: any) => {
        if (!settings) return;

        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);

        try {
            await accessibilityService.updateAccessibilitySettings({
                settings: { [key]: value },
            });
        } catch (error) {
            console.error('Failed to update setting:', error);
            // Revert on error
            setSettings(settings);
            Alert.alert('Error', 'Failed to update setting');
        }
    };

    const enableElderlyMode = async () => {
        if (!settings) return;

        Alert.alert(
            'Enable Elderly Mode',
            'This will enable larger text, simplified navigation, bigger buttons, and confirmation dialogs. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Enable',
                    onPress: async () => {
                        setSaving(true);
                        try {
                            const elderlySettings: Partial<AccessibilitySettings> = {
                                elderlyMode: true,
                                textSize: 'extra-large',
                                themeMode: 'elder-friendly',
                                boldText: true,
                                simplifiedNavigation: true,
                                largerTouchTargets: true,
                                confirmationDialogs: true,
                                audioFeedbackEnabled: true,
                            };
                            await accessibilityService.updateAccessibilitySettings({
                                settings: elderlySettings,
                            });
                            setSettings({ ...settings, ...elderlySettings });
                            Alert.alert('Success', 'Elderly mode enabled');
                        } catch (error) {
                            console.error('Failed to enable elderly mode:', error);
                            Alert.alert('Error', 'Failed to enable elderly mode');
                        } finally {
                            setSaving(false);
                        }
                    },
                },
            ]
        );
    };

    if (loading || !settings) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Accessibility</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0ea5e9" />
                    <Text style={styles.loadingText}>Loading settings...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Accessibility</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Elder-Friendly Mode Quick Action */}
                {!settings.elderlyMode && (
                    <TouchableOpacity
                        style={styles.quickActionCard}
                        onPress={enableElderlyMode}
                        disabled={saving}
                    >
                        <Text style={styles.quickActionIcon}>👴</Text>
                        <View style={styles.quickActionInfo}>
                            <Text style={styles.quickActionTitle}>Enable Elderly Mode</Text>
                            <Text style={styles.quickActionDesc}>
                                Larger text, simplified interface, and easier navigation
                            </Text>
                        </View>
                        <Text style={styles.quickActionArrow}>→</Text>
                    </TouchableOpacity>
                )}

                {settings.elderlyMode && (
                    <View style={styles.activeMode}>
                        <Text style={styles.activeModeIcon}>✓</Text>
                        <Text style={styles.activeModeText}>Elderly Mode Active</Text>
                    </View>
                )}

                {/* Text & Display */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📱 Text & Display</Text>

                    {/* Text Size */}
                    <View style={styles.settingCard}>
                        <Text style={styles.settingLabel}>Text Size</Text>
                        <View style={styles.chipGroup}>
                            {(['small', 'medium', 'large', 'extra-large'] as TextSize[]).map((size) => (
                                <TouchableOpacity
                                    key={size}
                                    style={[
                                        styles.chip,
                                        settings.textSize === size && styles.chipActive,
                                    ]}
                                    onPress={() => updateSetting('textSize', size)}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        settings.textSize === size && styles.chipTextActive,
                                    ]}>
                                        {size.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Theme Mode */}
                    <View style={styles.settingCard}>
                        <Text style={styles.settingLabel}>Theme</Text>
                        <View style={styles.chipGroup}>
                            {(['light', 'dark', 'high-contrast', 'elder-friendly'] as ThemeMode[]).map((theme) => (
                                <TouchableOpacity
                                    key={theme}
                                    style={[
                                        styles.chip,
                                        settings.themeMode === theme && styles.chipActive,
                                    ]}
                                    onPress={() => updateSetting('themeMode', theme)}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        settings.themeMode === theme && styles.chipTextActive,
                                    ]}>
                                        {theme.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Bold Text</Text>
                            <Text style={styles.settingDesc}>Make text easier to read</Text>
                        </View>
                        <Switch
                            value={settings.boldText}
                            onValueChange={(value) => updateSetting('boldText', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>High Contrast</Text>
                            <Text style={styles.settingDesc}>Increase color contrast</Text>
                        </View>
                        <Switch
                            value={settings.highContrast}
                            onValueChange={(value) => updateSetting('highContrast', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Reduce Motion</Text>
                            <Text style={styles.settingDesc}>Minimize animations</Text>
                        </View>
                        <Switch
                            value={settings.reducedMotion}
                            onValueChange={(value) => updateSetting('reducedMotion', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                {/* Voice & Audio */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🔊 Voice & Audio</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Voice Navigation</Text>
                            <Text style={styles.settingDesc}>Navigate using voice commands</Text>
                        </View>
                        <Switch
                            value={settings.voiceNavigationEnabled}
                            onValueChange={(value) => updateSetting('voiceNavigationEnabled', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>

                    {settings.voiceNavigationEnabled && (
                        <>
                            <View style={styles.settingCard}>
                                <Text style={styles.settingLabel}>Voice Gender</Text>
                                <View style={styles.chipGroup}>
                                    {(['female', 'male'] as VoiceGender[]).map((gender) => (
                                        <TouchableOpacity
                                            key={gender}
                                            style={[
                                                styles.chip,
                                                settings.voiceGender === gender && styles.chipActive,
                                            ]}
                                            onPress={() => updateSetting('voiceGender', gender)}
                                        >
                                            <Text style={[
                                                styles.chipText,
                                                settings.voiceGender === gender && styles.chipTextActive,
                                            ]}>
                                                {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.settingCard}>
                                <Text style={styles.settingLabel}>Voice Speed</Text>
                                <View style={styles.chipGroup}>
                                    {(['slow', 'normal', 'fast'] as VoiceSpeed[]).map((speed) => (
                                        <TouchableOpacity
                                            key={speed}
                                            style={[
                                                styles.chip,
                                                settings.voiceSpeed === speed && styles.chipActive,
                                            ]}
                                            onPress={() => updateSetting('voiceSpeed', speed)}
                                        >
                                            <Text style={[
                                                styles.chipText,
                                                settings.voiceSpeed === speed && styles.chipTextActive,
                                            ]}>
                                                {speed.charAt(0).toUpperCase() + speed.slice(1)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </>
                    )}

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Screen Reader</Text>
                            <Text style={styles.settingDesc}>Read screen content aloud</Text>
                        </View>
                        <Switch
                            value={settings.screenReaderEnabled}
                            onValueChange={(value) => updateSetting('screenReaderEnabled', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Audio Feedback</Text>
                            <Text style={styles.settingDesc}>Sound effects for actions</Text>
                        </View>
                        <Switch
                            value={settings.audioFeedbackEnabled}
                            onValueChange={(value) => updateSetting('audioFeedbackEnabled', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                {/* Navigation & Interaction */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🧭 Navigation & Interaction</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Simplified Navigation</Text>
                            <Text style={styles.settingDesc}>Reduce menu complexity</Text>
                        </View>
                        <Switch
                            value={settings.simplifiedNavigation}
                            onValueChange={(value) => updateSetting('simplifiedNavigation', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Larger Touch Targets</Text>
                            <Text style={styles.settingDesc}>Bigger buttons and controls</Text>
                        </View>
                        <Switch
                            value={settings.largerTouchTargets}
                            onValueChange={(value) => updateSetting('largerTouchTargets', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Confirmation Dialogs</Text>
                            <Text style={styles.settingDesc}>Confirm important actions</Text>
                        </View>
                        <Switch
                            value={settings.confirmationDialogs}
                            onValueChange={(value) => updateSetting('confirmationDialogs', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Voice Input</Text>
                            <Text style={styles.settingDesc}>Type using your voice</Text>
                        </View>
                        <Switch
                            value={settings.voiceInputEnabled}
                            onValueChange={(value) => updateSetting('voiceInputEnabled', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                {/* Visual Assistance */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👁️ Visual Assistance</Text>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Color Blind Mode</Text>
                            <Text style={styles.settingDesc}>Adjust colors for visibility</Text>
                        </View>
                        <Switch
                            value={settings.colorBlindMode}
                            onValueChange={(value) => updateSetting('colorBlindMode', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Reduce Transparency</Text>
                            <Text style={styles.settingDesc}>Make backgrounds opaque</Text>
                        </View>
                        <Switch
                            value={settings.reduceTransparency}
                            onValueChange={(value) => updateSetting('reduceTransparency', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Button Shapes</Text>
                            <Text style={styles.settingDesc}>Show button outlines</Text>
                        </View>
                        <Switch
                            value={settings.buttonShapes}
                            onValueChange={(value) => updateSetting('buttonShapes', value)}
                            trackColor={{ false: '#cbd5e1', true: '#0ea5e9' }}
                            thumbColor="#fff"
                        />
                    </View>
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
    quickActionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 20,
        padding: 20,
        backgroundColor: '#fef3c7',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#f59e0b',
    },
    quickActionIcon: {
        fontSize: 40,
        marginRight: 16,
    },
    quickActionInfo: {
        flex: 1,
    },
    quickActionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#92400e',
        marginBottom: 4,
    },
    quickActionDesc: {
        fontSize: 14,
        color: '#92400e',
        lineHeight: 20,
    },
    quickActionArrow: {
        fontSize: 24,
        color: '#92400e',
    },
    activeMode: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
        padding: 16,
        backgroundColor: '#dcfce7',
        borderRadius: 12,
    },
    activeModeIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    activeModeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#166534',
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
    settingCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    settingLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 12,
    },
    chipGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    chipActive: {
        backgroundColor: '#0ea5e9',
        borderColor: '#0ea5e9',
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    chipTextActive: {
        color: '#fff',
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
});
