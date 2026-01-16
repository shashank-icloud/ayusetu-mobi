import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../../navigation/AppNavigator';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = BottomTabScreenProps<TabParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
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
                    <Text style={styles.brandName}>Home</Text>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                    <Text style={styles.notificationIcon}>🔔</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* ABHA Card */}
                <View style={styles.abhaCard}>
                    <View style={styles.abhaHeader}>
                        <Text style={styles.abhaLabel}>ABHA Number</Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>● Active</Text>
                        </View>
                    </View>
                    <Text style={styles.abhaNumber}>12-3456-7890-1234</Text>
                    <Text style={styles.abhaAddress}>username@abdm</Text>
                    <TouchableOpacity style={styles.viewCardButton}>
                        <Text style={styles.viewCardText}>View Full Card →</Text>
                    </TouchableOpacity>
                </View>

                {/* Health Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Health Summary</Text>
                    <View style={styles.summaryGrid}>
                        <View style={[styles.summaryCard, { backgroundColor: '#fef3c7' }]}>
                            <Text style={styles.summaryIcon}>📊</Text>
                            <Text style={styles.summaryValue}>42</Text>
                            <Text style={styles.summaryLabel}>Total Records</Text>
                        </View>
                        <View style={[styles.summaryCard, { backgroundColor: '#dbeafe' }]}>
                            <Text style={styles.summaryIcon}>📅</Text>
                            <Text style={styles.summaryValue}>3</Text>
                            <Text style={styles.summaryLabel}>Appointments</Text>
                        </View>
                        <View style={[styles.summaryCard, { backgroundColor: '#fce7f3' }]}>
                            <Text style={styles.summaryIcon}>💊</Text>
                            <Text style={styles.summaryValue}>5</Text>
                            <Text style={styles.summaryLabel}>Medications</Text>
                        </View>
                        <View style={[styles.summaryCard, { backgroundColor: '#dcfce7' }]}>
                            <Text style={styles.summaryIcon}>🔒</Text>
                            <Text style={styles.summaryValue}>2</Text>
                            <Text style={styles.summaryLabel}>Consents</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.quickActionsGrid}>
                        <TouchableOpacity
                            style={[styles.quickActionCard, { backgroundColor: '#ef4444' }]}
                            onPress={() => rootNavigation.navigate('SOS')}
                        >
                            <Text style={styles.quickActionIcon}>🚨</Text>
                            <Text style={styles.quickActionText}>Emergency SOS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.quickActionCard, { backgroundColor: '#3b82f6' }]}
                            onPress={() => rootNavigation.navigate('HealthRecords')}
                        >
                            <Text style={styles.quickActionIcon}>📄</Text>
                            <Text style={styles.quickActionText}>My Records</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recent Activity */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Activity</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.activityCard}>
                        <View style={[styles.activityIcon, { backgroundColor: '#dbeafe' }]}>
                            <Text style={styles.activityEmoji}>📄</Text>
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityTitle}>Blood Test Report Added</Text>
                            <Text style={styles.activityTime}>2 hours ago</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.activityCard}>
                        <View style={[styles.activityIcon, { backgroundColor: '#fef3c7' }]}>
                            <Text style={styles.activityEmoji}>📅</Text>
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityTitle}>Appointment Scheduled</Text>
                            <Text style={styles.activityTime}>Yesterday</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.activityCard}>
                        <View style={[styles.activityIcon, { backgroundColor: '#fce7f3' }]}>
                            <Text style={styles.activityEmoji}>🔒</Text>
                        </View>
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityTitle}>Consent Request Approved</Text>
                            <Text style={styles.activityTime}>2 days ago</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Health Tip */}
                <View style={styles.tipCard}>
                    <Text style={styles.tipIcon}>💡</Text>
                    <View style={styles.tipContent}>
                        <Text style={styles.tipTitle}>Health Tip of the Day</Text>
                        <Text style={styles.tipText}>
                            Drink at least 8 glasses of water daily to stay hydrated and maintain optimal health.
                        </Text>
                    </View>
                </View>
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
    brandName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationIcon: {
        fontSize: 20,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
        paddingBottom: 100,
    },
    abhaCard: {
        backgroundColor: '#000',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
    },
    abhaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    abhaLabel: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.8,
        fontWeight: '600',
    },
    statusBadge: {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#22c55e',
        fontSize: 12,
        fontWeight: '600',
    },
    abhaNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
        letterSpacing: 1,
    },
    abhaAddress: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        marginBottom: 16,
    },
    viewCardButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    viewCardText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    section: {
        marginBottom: 28,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    seeAllText: {
        fontSize: 14,
        color: '#3b82f6',
        fontWeight: '600',
    },
    summaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    summaryCard: {
        width: '48%',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    summaryIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
        textAlign: 'center',
    },
    quickActionsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    quickActionCard: {
        flex: 1,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
    },
    quickActionIcon: {
        fontSize: 40,
        marginBottom: 8,
    },
    quickActionText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    activityCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    activityIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityEmoji: {
        fontSize: 24,
    },
    activityInfo: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    activityTime: {
        fontSize: 13,
        color: '#666',
    },
    tipCard: {
        backgroundColor: '#fef3c7',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#fde68a',
    },
    tipIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    tipText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
});
