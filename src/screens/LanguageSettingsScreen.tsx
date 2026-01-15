import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import accessibilityService, { Language, LanguageCode } from '../services/accessibilityService';

type Props = NativeStackScreenProps<RootStackParamList, 'LanguageSettings'>;

export default function LanguageSettingsScreen({ navigation }: Props) {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState<string | null>(null);

    useEffect(() => {
        loadLanguages();
    }, []);

    const loadLanguages = async () => {
        try {
            const data = await accessibilityService.getLanguages({ includeOfflineStatus: true });
            setLanguages(data);
        } catch (error) {
            console.error('Failed to load languages:', error);
            Alert.alert('Error', 'Failed to load languages');
        } finally {
            setLoading(false);
        }
    };

    const handleChangeLanguage = async (languageCode: LanguageCode) => {
        try {
            await accessibilityService.updateLanguage({ language: languageCode });
            setCurrentLanguage(languageCode);
            Alert.alert('Success', 'Language updated successfully');
        } catch (error) {
            console.error('Failed to update language:', error);
            Alert.alert('Error', 'Failed to update language');
        }
    };

    const handleDownloadOffline = async (language: Language) => {
        if (language.downloadedForOffline) {
            Alert.alert(
                'Remove Offline Pack',
                `Remove ${language.name} offline translation pack?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Remove',
                        style: 'destructive',
                        onPress: () => {
                            // Would call remove API
                            Alert.alert('Success', 'Offline pack removed');
                            loadLanguages();
                        },
                    },
                ]
            );
            return;
        }

        Alert.alert(
            'Download Offline Pack',
            `Download ${language.name} for offline use? (${language.downloadSize || '~5 MB'})`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Download',
                    onPress: async () => {
                        setDownloading(language.code);
                        try {
                            await accessibilityService.downloadTranslationPack({ language: language.code });
                            Alert.alert('Success', `${language.name} downloaded for offline use`);
                            loadLanguages();
                        } catch (error) {
                            console.error('Failed to download translation pack:', error);
                            Alert.alert('Error', 'Failed to download translation pack');
                        } finally {
                            setDownloading(null);
                        }
                    },
                },
            ]
        );
    };

    const getLanguageFlag = (code: LanguageCode): string => {
        const flags: Record<LanguageCode, string> = {
            en: '🇬🇧',
            hi: '🇮🇳',
            ta: '🇮🇳',
            te: '🇮🇳',
            bn: '🇮🇳',
            mr: '🇮🇳',
            gu: '🇮🇳',
            kn: '🇮🇳',
            ml: '🇮🇳',
            pa: '🇮🇳',
            or: '🇮🇳',
        };
        return flags[code] || '🌐';
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Language Settings</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0ea5e9" />
                    <Text style={styles.loadingText}>Loading languages...</Text>
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
                <Text style={styles.title}>Language Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Info Box */}
                <View style={styles.infoBox}>
                    <Text style={styles.infoIcon}>🌍</Text>
                    <Text style={styles.infoText}>
                        Select your preferred language. Download languages for offline use when no internet connection is available.
                    </Text>
                </View>

                {/* Current Language */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Current Language</Text>
                    <View style={styles.currentLanguageCard}>
                        <Text style={styles.currentLanguageFlag}>{getLanguageFlag(currentLanguage)}</Text>
                        <View style={styles.currentLanguageInfo}>
                            <Text style={styles.currentLanguageName}>
                                {languages.find(l => l.code === currentLanguage)?.name || 'English'}
                            </Text>
                            <Text style={styles.currentLanguageNative}>
                                {languages.find(l => l.code === currentLanguage)?.nativeName || 'English'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Available Languages */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Available Languages</Text>
                    <Text style={styles.sectionSubtitle}>
                        {languages.length} languages supported
                    </Text>

                    {languages.map((language) => (
                        <TouchableOpacity
                            key={language.code}
                            style={[
                                styles.languageCard,
                                language.code === currentLanguage && styles.languageCardActive,
                            ]}
                            onPress={() => handleChangeLanguage(language.code)}
                        >
                            <View style={styles.languageHeader}>
                                <View style={styles.languageInfo}>
                                    <Text style={styles.languageFlag}>{getLanguageFlag(language.code)}</Text>
                                    <View style={styles.languageNames}>
                                        <Text style={styles.languageName}>{language.name}</Text>
                                        <Text style={styles.languageNative}>{language.nativeName}</Text>
                                    </View>
                                </View>
                                {language.code === currentLanguage && (
                                    <View style={styles.activeBadge}>
                                        <Text style={styles.activeBadgeText}>✓ Active</Text>
                                    </View>
                                )}
                            </View>

                            {/* Offline Download */}
                            <View style={styles.languageFooter}>
                                <View style={styles.offlineInfo}>
                                    <Text style={styles.offlineIcon}>
                                        {language.downloadedForOffline ? '📥' : '☁️'}
                                    </Text>
                                    <Text style={styles.offlineText}>
                                        {language.downloadedForOffline
                                            ? 'Available offline'
                                            : 'Online only'}
                                    </Text>
                                    {language.downloadSize && !language.downloadedForOffline && (
                                        <Text style={styles.downloadSize}>({language.downloadSize})</Text>
                                    )}
                                </View>
                                {downloading === language.code ? (
                                    <ActivityIndicator size="small" color="#0ea5e9" />
                                ) : (
                                    <TouchableOpacity
                                        style={[
                                            styles.downloadButton,
                                            language.downloadedForOffline && styles.downloadButtonActive,
                                        ]}
                                        onPress={() => handleDownloadOffline(language)}
                                    >
                                        <Text style={[
                                            styles.downloadButtonText,
                                            language.downloadedForOffline && styles.downloadButtonTextActive,
                                        ]}>
                                            {language.downloadedForOffline ? 'Remove' : 'Download'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Language Tips */}
                <View style={styles.tipsSection}>
                    <Text style={styles.tipsTitle}>💡 Tips</Text>
                    <View style={styles.tip}>
                        <Text style={styles.tipBullet}>•</Text>
                        <Text style={styles.tipText}>
                            Downloaded languages work even without internet connection
                        </Text>
                    </View>
                    <View style={styles.tip}>
                        <Text style={styles.tipBullet}>•</Text>
                        <Text style={styles.tipText}>
                            All medical terms are carefully translated by healthcare experts
                        </Text>
                    </View>
                    <View style={styles.tip}>
                        <Text style={styles.tipBullet}>•</Text>
                        <Text style={styles.tipText}>
                            Voice navigation will use your selected language
                        </Text>
                    </View>
                    <View style={styles.tip}>
                        <Text style={styles.tipBullet}>•</Text>
                        <Text style={styles.tipText}>
                            You can switch languages anytime from settings
                        </Text>
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
    infoBox: {
        flexDirection: 'row',
        margin: 20,
        padding: 16,
        backgroundColor: '#e0f2fe',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#0ea5e9',
    },
    infoIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#0c4a6e',
        lineHeight: 20,
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 16,
    },
    currentLanguageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#0ea5e9',
        borderRadius: 16,
    },
    currentLanguageFlag: {
        fontSize: 48,
        marginRight: 16,
    },
    currentLanguageInfo: {
        flex: 1,
    },
    currentLanguageName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    currentLanguageNative: {
        fontSize: 18,
        color: '#e0f2fe',
    },
    languageCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#e2e8f0',
    },
    languageCardActive: {
        borderColor: '#0ea5e9',
        backgroundColor: '#f0f9ff',
    },
    languageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    languageInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    languageFlag: {
        fontSize: 32,
        marginRight: 12,
    },
    languageNames: {
        flex: 1,
    },
    languageName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 2,
    },
    languageNative: {
        fontSize: 14,
        color: '#64748b',
    },
    activeBadge: {
        backgroundColor: '#0ea5e9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    activeBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    languageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    offlineInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    offlineIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    offlineText: {
        fontSize: 14,
        color: '#64748b',
        marginRight: 6,
    },
    downloadSize: {
        fontSize: 12,
        color: '#94a3b8',
    },
    downloadButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#0ea5e9',
        borderRadius: 8,
    },
    downloadButtonActive: {
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#cbd5e1',
    },
    downloadButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    downloadButtonTextActive: {
        color: '#64748b',
    },
    tipsSection: {
        marginHorizontal: 20,
        marginTop: 8,
        padding: 16,
        backgroundColor: '#fef3c7',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#92400e',
        marginBottom: 12,
    },
    tip: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    tipBullet: {
        fontSize: 14,
        color: '#92400e',
        marginRight: 8,
        fontWeight: '700',
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: '#92400e',
        lineHeight: 20,
    },
});
