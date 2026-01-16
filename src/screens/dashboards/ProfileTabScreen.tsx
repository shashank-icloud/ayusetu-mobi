import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../../navigation/AppNavigator';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = BottomTabScreenProps<TabParamList, 'ProfileTab'>;

export default function ProfileTabScreen({ navigation }: Props) {
    const rootNavigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Image
                        source={require('../../../assets/images/Images/ayusetu-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>
                <TouchableOpacity style={styles.settingsButton} onPress={() => rootNavigation.navigate('Profile')}>
                    <Text style={styles.settingsIcon}>⚙️</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>SC</Text>
                    </View>
                    <Text style={styles.userName}>Shashank Macherla</Text>
                    <Text style={styles.userEmail}>username@abdm</Text>
                </View>

                {/* ABHA Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ABHA Information</Text>
                    <TouchableOpacity style={styles.menuCard}>
                        <View style={styles.menuLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#000' }]}>
                                <Text style={styles.menuEmoji}>🆔</Text>
                            </View>
                            <View>
                                <Text style={styles.menuTitle}>ABHA Number</Text>
                                <Text style={styles.menuSubtitle}>12-3456-7890-1234</Text>
                            </View>
                        </View>
                        <Text style={styles.menuArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuCard}>
                        <View style={styles.menuLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#3b82f6' }]}>
                                <Text style={styles.menuEmoji}>📇</Text>
                            </View>
                            <View>
                                <Text style={styles.menuTitle}>ABHA Address</Text>
                                <Text style={styles.menuSubtitle}>username@abdm</Text>
                            </View>
                        </View>
                        <Text style={styles.menuArrow}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* Consent & Privacy */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Consent & Privacy</Text>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => rootNavigation.navigate('ConsentManagement')}
                    >
                        <View style={styles.menuLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#f59e0b' }]}>
                                <Text style={styles.menuEmoji}>🔒</Text>
                            </View>
                            <Text style={styles.menuTitle}>Manage Consent</Text>
                        </View>
                        <Text style={styles.menuArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => rootNavigation.navigate('ConsentInbox')}
                    >
                        <View style={styles.menuLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#9C27B0' }]}>
                                <Text style={styles.menuEmoji}>📬</Text>
                            </View>
                            <View>
                                <Text style={styles.menuTitle}>Consent Requests</Text>
                                <Text style={styles.menuSubtitle}>2 pending</Text>
                            </View>
                        </View>
                        <Text style={styles.menuArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => rootNavigation.navigate('ConsentAudit')}
                    >
                        <View style={styles.menuLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#607D8B' }]}>
                                <Text style={styles.menuEmoji}>📋</Text>
                            </View>
                            <Text style={styles.menuTitle}>Audit Trail</Text>
                        </View>
                        <Text style={styles.menuArrow}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* Family Profiles */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Family Profiles</Text>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => rootNavigation.navigate('FamilyManagement')}
                    >
                        <View style={styles.menuLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#10b981' }]}>
                                <Text style={styles.menuEmoji}>👨‍👩‍👧‍👦</Text>
                            </View>
                            <View>
                                <Text style={styles.menuTitle}>Manage Family</Text>
                                <Text style={styles.menuSubtitle}>3 members</Text>
                            </View>
                        </View>
                        <Text style={styles.menuArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => rootNavigation.navigate('FamilyHealthDashboard')}
                    >
                        <View style={styles.menuLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#e91e63' }]}>
                                <Text style={styles.menuEmoji}>❤️</Text>
                            </View>
                            <Text style={styles.menuTitle}>Family Health</Text>
                        </View>
                        <Text style={styles.menuArrow}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => rootNavigation.navigate('SecuritySettings')}
                    >
                        <View style={styles.menuLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#7c3aed' }]}>
                                <Text style={styles.menuEmoji}>🔒</Text>
                            </View>
                            <Text style={styles.menuTitle}>Security</Text>
                        </View>
                        <Text style={styles.menuArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => rootNavigation.navigate('NotificationInbox')}
                    >
                        <View style={styles.menuLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#ff9800' }]}>
                                <Text style={styles.menuEmoji}>🔔</Text>
                            </View>
                            <Text style={styles.menuTitle}>Notifications</Text>
                        </View>
                        <Text style={styles.menuArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => rootNavigation.navigate('LanguageSettings')}
                    >
                        <View style={styles.menuLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#06b6d4' }]}>
                                <Text style={styles.menuEmoji}>🌍</Text>
                            </View>
                            <Text style={styles.menuTitle}>Language</Text>
                        </View>
                        <Text style={styles.menuArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => rootNavigation.navigate('DataExport')}
                    >
                        <View style={styles.menuLeft}>
                            <View style={[styles.menuIcon, { backgroundColor: '#00bcd4' }]}>
                                <Text style={styles.menuEmoji}>📤</Text>
                            </View>
                            <Text style={styles.menuTitle}>Export Data</Text>
                        </View>
                        <Text style={styles.menuArrow}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* Sign Out */}
                <TouchableOpacity style={styles.signOutButton}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logo: {
        width: 40,
        height: 40,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsIcon: {
        fontSize: 20,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
        paddingBottom: 100,
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    menuCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuEmoji: {
        fontSize: 22,
    },
    menuTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 13,
        color: '#666',
    },
    menuArrow: {
        fontSize: 20,
        color: '#000',
    },
    signOutButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#ef4444',
    },
    signOutText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ef4444',
    },
    versionText: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8,
    },
});
