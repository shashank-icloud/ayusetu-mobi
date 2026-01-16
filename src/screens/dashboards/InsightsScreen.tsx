import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../../navigation/AppNavigator';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = BottomTabScreenProps<TabParamList, 'Insights'>;

export default function InsightsScreen({ navigation }: Props) {
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
                    <Text style={styles.headerTitle}>Insights</Text>
                </View>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterIcon}>⚙️</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Health Score */}
                <View style={styles.scoreCard}>
                    <Text style={styles.scoreLabel}>Your Health Score</Text>
                    <View style={styles.scoreCircle}>
                        <Text style={styles.scoreValue}>85</Text>
                        <Text style={styles.scoreOutOf}>/100</Text>
                    </View>
                    <Text style={styles.scoreStatus}>🟢 Good</Text>
                    <Text style={styles.scoreDescription}>
                        Your health metrics are within normal ranges. Keep it up!
                    </Text>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActionsGrid}>
                    <TouchableOpacity
                        style={[styles.quickActionCard, { backgroundColor: '#8b5cf6' }]}
                        onPress={() => rootNavigation.navigate('HealthSummary')}
                    >
                        <Text style={styles.quickActionIcon}>📊</Text>
                        <Text style={styles.quickActionText}>Health Summary</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.quickActionCard, { backgroundColor: '#7c3aed' }]}
                        onPress={() => rootNavigation.navigate('TrendAnalysis')}
                    >
                        <Text style={styles.quickActionIcon}>📈</Text>
                        <Text style={styles.quickActionText}>Trends</Text>
                    </TouchableOpacity>
                </View>

                {/* Health Trends */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Health Trends</Text>
                        <TouchableOpacity onPress={() => rootNavigation.navigate('TrendAnalysis')}>
                            <Text style={styles.seeAllText}>See all →</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.trendCard}>
                        <View style={styles.trendHeader}>
                            <View style={styles.trendLeft}>
                                <Text style={styles.trendIcon}>❤️</Text>
                                <View>
                                    <Text style={styles.trendTitle}>Heart Rate</Text>
                                    <Text style={styles.trendSubtitle}>Last 7 days</Text>
                                </View>
                            </View>
                            <View style={styles.trendBadge}>
                                <Text style={styles.trendChange}>↓ 5%</Text>
                            </View>
                        </View>
                        <View style={styles.trendChart}>
                            <Text style={styles.trendValue}>72 BPM</Text>
                            <Text style={styles.trendRange}>Normal range</Text>
                        </View>
                    </View>

                    <View style={styles.trendCard}>
                        <View style={styles.trendHeader}>
                            <View style={styles.trendLeft}>
                                <Text style={styles.trendIcon}>🩸</Text>
                                <View>
                                    <Text style={styles.trendTitle}>Blood Pressure</Text>
                                    <Text style={styles.trendSubtitle}>Last 7 days</Text>
                                </View>
                            </View>
                            <View style={[styles.trendBadge, { backgroundColor: '#dcfce7' }]}>
                                <Text style={[styles.trendChange, { color: '#16a34a' }]}>→ Stable</Text>
                            </View>
                        </View>
                        <View style={styles.trendChart}>
                            <Text style={styles.trendValue}>120/80 mmHg</Text>
                            <Text style={styles.trendRange}>Normal range</Text>
                        </View>
                    </View>
                </View>

                {/* Disease Trackers */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Active Trackers</Text>
                        <TouchableOpacity onPress={() => rootNavigation.navigate('DiseaseTrackers')}>
                            <Text style={styles.seeAllText}>See all →</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.trackerCard}
                        onPress={() => rootNavigation.navigate('DiseaseTrackers')}
                    >
                        <View style={styles.trackerLeft}>
                            <View style={[styles.trackerIcon, { backgroundColor: '#fef3c7' }]}>
                                <Text style={styles.trackerEmoji}>🩺</Text>
                            </View>
                            <View style={styles.trackerInfo}>
                                <Text style={styles.trackerTitle}>Diabetes Tracker</Text>
                                <Text style={styles.trackerSubtitle}>12 entries this month</Text>
                            </View>
                        </View>
                        <Text style={styles.trackerArrow}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* Preventive Reminders */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preventive Reminders</Text>

                    <View style={styles.reminderCard}>
                        <View style={styles.reminderLeft}>
                            <View style={[styles.reminderIcon, { backgroundColor: '#dbeafe' }]}>
                                <Text style={styles.reminderEmoji}>💉</Text>
                            </View>
                            <View style={styles.reminderInfo}>
                                <Text style={styles.reminderTitle}>Annual Checkup Due</Text>
                                <Text style={styles.reminderDate}>Due in 15 days</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.scheduleButton}>
                            <Text style={styles.scheduleText}>Schedule</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.reminderCard}>
                        <View style={styles.reminderLeft}>
                            <View style={[styles.reminderIcon, { backgroundColor: '#fce7f3' }]}>
                                <Text style={styles.reminderEmoji}>🧪</Text>
                            </View>
                            <View style={styles.reminderInfo}>
                                <Text style={styles.reminderTitle}>Blood Test Recommended</Text>
                                <Text style={styles.reminderDate}>Every 6 months</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.scheduleButton}>
                            <Text style={styles.scheduleText}>Schedule</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Lifestyle Tracking */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Lifestyle</Text>
                        <TouchableOpacity onPress={() => rootNavigation.navigate('LifestyleTracking')}>
                            <Text style={styles.seeAllText}>See all →</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.lifestyleGrid}>
                        <View style={styles.lifestyleCard}>
                            <Text style={styles.lifestyleIcon}>🚶</Text>
                            <Text style={styles.lifestyleValue}>8,542</Text>
                            <Text style={styles.lifestyleLabel}>Steps today</Text>
                        </View>
                        <View style={styles.lifestyleCard}>
                            <Text style={styles.lifestyleIcon}>💧</Text>
                            <Text style={styles.lifestyleValue}>6/8</Text>
                            <Text style={styles.lifestyleLabel}>Glasses</Text>
                        </View>
                        <View style={styles.lifestyleCard}>
                            <Text style={styles.lifestyleIcon}>😴</Text>
                            <Text style={styles.lifestyleValue}>7.5h</Text>
                            <Text style={styles.lifestyleLabel}>Sleep</Text>
                        </View>
                        <View style={styles.lifestyleCard}>
                            <Text style={styles.lifestyleIcon}>🍎</Text>
                            <Text style={styles.lifestyleValue}>1,850</Text>
                            <Text style={styles.lifestyleLabel}>Calories</Text>
                        </View>
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
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterIcon: {
        fontSize: 20,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
        paddingBottom: 100,
    },
    scoreCard: {
        backgroundColor: '#8b5cf6',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
    },
    scoreLabel: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
        marginBottom: 16,
    },
    scoreCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: '700',
        color: '#fff',
    },
    scoreOutOf: {
        fontSize: 20,
        color: '#fff',
        opacity: 0.8,
    },
    scoreStatus: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    scoreDescription: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
        textAlign: 'center',
    },
    quickActionsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 28,
    },
    quickActionCard: {
        flex: 1,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
    },
    quickActionIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    quickActionText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
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
    },
    seeAllText: {
        fontSize: 14,
        color: '#3b82f6',
        fontWeight: '600',
    },
    trendCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    trendHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    trendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    trendIcon: {
        fontSize: 32,
    },
    trendTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 2,
    },
    trendSubtitle: {
        fontSize: 13,
        color: '#666',
    },
    trendBadge: {
        backgroundColor: '#fef3c7',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    trendChange: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ca8a04',
    },
    trendChart: {
        marginTop: 8,
    },
    trendValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    trendRange: {
        fontSize: 13,
        color: '#22c55e',
        fontWeight: '600',
    },
    trackerCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    trackerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    trackerIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    trackerEmoji: {
        fontSize: 24,
    },
    trackerInfo: {
        flex: 1,
    },
    trackerTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    trackerSubtitle: {
        fontSize: 13,
        color: '#666',
    },
    trackerArrow: {
        fontSize: 20,
        color: '#000',
    },
    reminderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    reminderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    reminderIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    reminderEmoji: {
        fontSize: 24,
    },
    reminderInfo: {
        flex: 1,
    },
    reminderTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    reminderDate: {
        fontSize: 13,
        color: '#666',
    },
    scheduleButton: {
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    scheduleText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    lifestyleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    lifestyleCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    lifestyleIcon: {
        fontSize: 36,
        marginBottom: 8,
    },
    lifestyleValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    lifestyleLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});
