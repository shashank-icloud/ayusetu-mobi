import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { insightsService, HealthSummary, COMPLIANCE_DISCLAIMER } from '../services/insightsService';

/**
 * Health Summary Screen
 * 
 * AI-assisted health dashboard showing:
 * - Overall health score (informational)
 * - Key insights and recommendations
 * - Recent activity summary
 * - Upcoming reminders
 * - Areas of concern and positive indicators
 * 
 * ⚠️ Non-diagnostic, informational only
 */

export const HealthSummaryScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [summary, setSummary] = useState<HealthSummary | null>(null);

    useEffect(() => {
        loadHealthSummary();
    }, []);

    const loadHealthSummary = async () => {
        try {
            setLoading(true);
            const data = await insightsService.getHealthSummary();
            setSummary(data);
        } catch (error) {
            console.error('Failed to load health summary:', error);
            Alert.alert('Error', 'Failed to load health summary. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHealthSummary();
        setRefreshing(false);
    };

    const getScoreColor = (score: number): string => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const getScoreLabel = (category: string): string => {
        const labels: Record<string, string> = {
            excellent: 'Excellent',
            good: 'Good',
            fair: 'Fair',
            poor: 'Needs Attention',
        };
        return labels[category] || category;
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0ea5e9" />
                <Text style={styles.loadingText}>Loading your health summary...</Text>
            </View>
        );
    }

    if (!summary) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Unable to load health summary</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadHealthSummary}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* Compliance Disclaimer */}
            <View style={styles.disclaimerContainer}>
                <Text style={styles.disclaimerIcon}>ℹ️</Text>
                <Text style={styles.disclaimerText}>{COMPLIANCE_DISCLAIMER.text}</Text>
            </View>

            {/* Health Score Card */}
            <View style={styles.scoreCard}>
                <Text style={styles.scoreTitle}>Your Health Score</Text>
                <View style={styles.scoreCircle}>
                    <Text style={[styles.scoreValue, { color: getScoreColor(summary.overallScore) }]}>
                        {summary.overallScore}
                    </Text>
                    <Text style={styles.scoreMax}>/100</Text>
                </View>
                <Text style={styles.scoreCategory}>{getScoreLabel(summary.scoreCategory)}</Text>
                <Text style={styles.scoreSubtext}>Informational score based on tracked metrics</Text>
            </View>

            {/* Key Insights */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔍 Key Insights</Text>
                {summary.keyInsights.map((insight, index) => (
                    <View key={index} style={styles.insightItem}>
                        <View style={styles.insightBullet} />
                        <Text style={styles.insightText}>{insight}</Text>
                    </View>
                ))}
            </View>

            {/* Positive Indicators */}
            {summary.positiveIndicators && summary.positiveIndicators.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>✅ Positive Indicators</Text>
                    {summary.positiveIndicators.map((indicator, index) => (
                        <View key={index} style={styles.positiveItem}>
                            <Text style={styles.positiveIcon}>🎉</Text>
                            <Text style={styles.positiveText}>{indicator}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Areas of Concern */}
            {summary.areasOfConcern && summary.areasOfConcern.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚠️ Areas to Focus On</Text>
                    {summary.areasOfConcern.map((concern, index) => (
                        <View key={index} style={styles.concernItem}>
                            <Text style={styles.concernIcon}>⚡</Text>
                            <Text style={styles.concernText}>{concern}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Recent Activity */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📊 Recent Activity</Text>
                {summary.recentActivity.map((activity, index) => (
                    <View key={index} style={styles.activityItem}>
                        <View style={styles.activityDot} />
                        <Text style={styles.activityText}>{activity}</Text>
                    </View>
                ))}
            </View>

            {/* Upcoming Reminders */}
            {summary.upcomingReminders && summary.upcomingReminders.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⏰ Upcoming Reminders</Text>
                    {summary.upcomingReminders.map((reminder, index) => (
                        <View key={index} style={styles.reminderItem}>
                            <Text style={styles.reminderIcon}>🔔</Text>
                            <Text style={styles.reminderText}>{reminder}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('TrendAnalysis')}
                    >
                        <Text style={styles.actionIcon}>📈</Text>
                        <Text style={styles.actionText}>View Trends</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('MedicationAdherence')}
                    >
                        <Text style={styles.actionIcon}>💊</Text>
                        <Text style={styles.actionText}>Medications</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('LifestyleTracking')}
                    >
                        <Text style={styles.actionIcon}>🏃</Text>
                        <Text style={styles.actionText}>Lifestyle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('SymptomJournal')}
                    >
                        <Text style={styles.actionIcon}>📝</Text>
                        <Text style={styles.actionText}>Symptoms</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Generated Date */}
            <Text style={styles.footerText}>
                Generated on {new Date(summary.generatedDate).toLocaleDateString()} at{' '}
                {new Date(summary.generatedDate).toLocaleTimeString()}
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748b',
    },
    errorText: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#0ea5e9',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    disclaimerContainer: {
        flexDirection: 'row',
        backgroundColor: '#fef3c7',
        padding: 12,
        margin: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
    },
    disclaimerIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    disclaimerText: {
        flex: 1,
        fontSize: 12,
        color: '#92400e',
        lineHeight: 18,
    },
    scoreCard: {
        backgroundColor: '#ffffff',
        margin: 16,
        marginTop: 0,
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    scoreTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 16,
    },
    scoreCircle: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 8,
    },
    scoreValue: {
        fontSize: 56,
        fontWeight: 'bold',
    },
    scoreMax: {
        fontSize: 24,
        color: '#94a3b8',
        marginLeft: 4,
    },
    scoreCategory: {
        fontSize: 20,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 4,
    },
    scoreSubtext: {
        fontSize: 13,
        color: '#94a3b8',
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 12,
    },
    insightItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    insightBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#0ea5e9',
        marginTop: 6,
        marginRight: 10,
    },
    insightText: {
        flex: 1,
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    positiveItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f0fdf4',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#10b981',
    },
    positiveIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    positiveText: {
        flex: 1,
        fontSize: 14,
        color: '#065f46',
        lineHeight: 20,
    },
    concernItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fef2f2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#f59e0b',
    },
    concernIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    concernText: {
        flex: 1,
        fontSize: 14,
        color: '#92400e',
        lineHeight: 20,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10b981',
        marginTop: 5,
        marginRight: 10,
    },
    activityText: {
        flex: 1,
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    reminderItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#eff6ff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    reminderIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    reminderText: {
        flex: 1,
        fontSize: 14,
        color: '#1e40af',
        lineHeight: 20,
    },
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    actionButton: {
        width: '48%',
        backgroundColor: '#f1f5f9',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: '4%',
        marginBottom: 8,
    },
    actionIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    actionText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
    },
    footerText: {
        fontSize: 12,
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
});
