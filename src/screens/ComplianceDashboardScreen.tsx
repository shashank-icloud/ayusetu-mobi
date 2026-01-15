import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { complianceService } from '../services/complianceService';
import type { ComplianceDashboard } from '../services/complianceService';

const ComplianceDashboardScreen: React.FC = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState<ComplianceDashboard | null>(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const data = await complianceService.getComplianceDashboard('user-001');
            setDashboard(data);
        } catch (error) {
            console.error('Error loading compliance dashboard:', error);
            Alert.alert('Error', 'Failed to load compliance dashboard');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number): string => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const getScoreLabel = (level: string): string => {
        switch (level) {
            case 'excellent': return 'Excellent';
            case 'good': return 'Good';
            case 'needs-attention': return 'Needs Attention';
            default: return 'Unknown';
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading compliance data...</Text>
            </View>
        );
    }

    if (!dashboard) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load compliance dashboard</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadDashboard}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Compliance Score Card */}
            <View style={styles.scoreCard}>
                <Text style={styles.scoreTitle}>Compliance Score</Text>
                <View style={styles.scoreCircle}>
                    <Text style={[styles.scoreValue, { color: getScoreColor(dashboard.complianceScore) }]}>
                        {dashboard.complianceScore}
                    </Text>
                    <Text style={styles.scoreLabel}>{getScoreLabel(dashboard.complianceLevel)}</Text>
                </View>

                {dashboard.recommendations.length > 0 && (
                    <View style={styles.recommendationsSection}>
                        <Text style={styles.recommendationsTitle}>📋 Recommendations</Text>
                        {dashboard.recommendations.map((rec, index) => (
                            <Text key={index} style={styles.recommendationText}>• {rec}</Text>
                        ))}
                    </View>
                )}
            </View>

            {/* Quick Stats Grid */}
            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{dashboard.totalDataAccesses}</Text>
                    <Text style={styles.statLabel}>Total Accesses</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{dashboard.activeConsents}</Text>
                    <Text style={styles.statLabel}>Active Consents</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{dashboard.linkedFacilities}</Text>
                    <Text style={styles.statLabel}>Linked Facilities</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{dashboard.accessesLast30Days}</Text>
                    <Text style={styles.statLabel}>Last 30 Days</Text>
                </View>
            </View>

            {/* Consent Overview */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Consent Overview</Text>
                <View style={styles.consentStats}>
                    <View style={styles.consentRow}>
                        <Text style={styles.consentLabel}>Total Consents:</Text>
                        <Text style={styles.consentValue}>{dashboard.totalConsents}</Text>
                    </View>
                    <View style={styles.consentRow}>
                        <Text style={[styles.consentLabel, styles.activeText]}>Active:</Text>
                        <Text style={[styles.consentValue, styles.activeText]}>{dashboard.activeConsents}</Text>
                    </View>
                    <View style={styles.consentRow}>
                        <Text style={[styles.consentLabel, styles.revokedText]}>Revoked:</Text>
                        <Text style={[styles.consentValue, styles.revokedText]}>{dashboard.revokedConsents}</Text>
                    </View>
                    <View style={styles.consentRow}>
                        <Text style={[styles.consentLabel, styles.expiredText]}>Expired:</Text>
                        <Text style={[styles.consentValue, styles.expiredText]}>{dashboard.expiredConsents}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => navigation.navigate('ConsentHistory' as never)}
                >
                    <Text style={styles.viewButtonText}>View Consent History →</Text>
                </TouchableOpacity>
            </View>

            {/* Data Access Overview */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data Access Breakdown</Text>
                <View style={styles.accessStats}>
                    <Text style={styles.accessStatsTitle}>By Source Type:</Text>
                    {Object.entries(dashboard.accessesBySource)
                        .filter(([_, count]) => count > 0)
                        .sort((a, b) => b[1] - a[1])
                        .map(([source, count]) => (
                            <View key={source} style={styles.accessRow}>
                                <Text style={styles.accessSource}>{source.charAt(0).toUpperCase() + source.slice(1)}</Text>
                                <View style={styles.accessBarContainer}>
                                    <View
                                        style={[
                                            styles.accessBar,
                                            { width: `${(count / dashboard.totalDataAccesses) * 100}%` },
                                        ]}
                                    />
                                    <Text style={styles.accessCount}>{count}</Text>
                                </View>
                            </View>
                        ))}
                </View>
                <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => navigation.navigate('DataAccessLogs' as never)}
                >
                    <Text style={styles.viewButtonText}>View Access Logs →</Text>
                </TouchableOpacity>
            </View>

            {/* ABDM Integration Stats */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>ABDM Integration</Text>
                <View style={styles.abdmStats}>
                    <View style={styles.abdmRow}>
                        <Text style={styles.abdmLabel}>Total Data Transfers:</Text>
                        <Text style={styles.abdmValue}>{dashboard.totalDataTransfers}</Text>
                    </View>
                    <View style={styles.abdmRow}>
                        <Text style={styles.abdmLabel}>Failed Transfers:</Text>
                        <Text style={[styles.abdmValue, dashboard.failedTransfers > 0 && styles.failedText]}>
                            {dashboard.failedTransfers}
                        </Text>
                    </View>
                    <View style={styles.abdmRow}>
                        <Text style={styles.abdmLabel}>Success Rate:</Text>
                        <Text style={styles.abdmValue}>
                            {((dashboard.totalDataTransfers - dashboard.failedTransfers) / dashboard.totalDataTransfers * 100).toFixed(1)}%
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => navigation.navigate('ABDMLogs' as never)}
                >
                    <Text style={styles.viewButtonText}>View ABDM Logs →</Text>
                </TouchableOpacity>
            </View>

            {/* Privacy Metrics */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Privacy Metrics</Text>
                <View style={styles.privacyStats}>
                    <View style={styles.privacyRow}>
                        <Text style={styles.privacyIcon}>📊</Text>
                        <View style={styles.privacyInfo}>
                            <Text style={styles.privacyLabel}>Records Shared</Text>
                            <Text style={styles.privacyValue}>{dashboard.recordsShared}</Text>
                        </View>
                    </View>
                    <View style={styles.privacyRow}>
                        <Text style={styles.privacyIcon}>👁️</Text>
                        <View style={styles.privacyInfo}>
                            <Text style={styles.privacyLabel}>Records Viewed</Text>
                            <Text style={styles.privacyValue}>{dashboard.recordsViewed}</Text>
                        </View>
                    </View>
                    <View style={styles.privacyRow}>
                        <Text style={styles.privacyIcon}>⬇️</Text>
                        <View style={styles.privacyInfo}>
                            <Text style={styles.privacyLabel}>Downloads</Text>
                            <Text style={styles.privacyValue}>{dashboard.downloadsCount}</Text>
                        </View>
                    </View>
                    <View style={styles.privacyRow}>
                        <Text style={styles.privacyIcon}>🚨</Text>
                        <View style={styles.privacyInfo}>
                            <Text style={styles.privacyLabel}>Emergency Accesses</Text>
                            <Text style={styles.privacyValue}>{dashboard.emergencyAccesses}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsSection}>
                <Text style={styles.actionsSectionTitle}>Audit Reports & Logs</Text>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => navigation.navigate('DataAccessLogs' as never)}
                >
                    <Text style={styles.actionIcon}>👥</Text>
                    <View style={styles.actionInfo}>
                        <Text style={styles.actionTitle}>Who Accessed My Data</Text>
                        <Text style={styles.actionSubtitle}>View all data access logs</Text>
                    </View>
                    <Text style={styles.actionArrow}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => navigation.navigate('ConsentHistory' as never)}
                >
                    <Text style={styles.actionIcon}>📜</Text>
                    <View style={styles.actionInfo}>
                        <Text style={styles.actionTitle}>Consent History</Text>
                        <Text style={styles.actionSubtitle}>Track all consent activities</Text>
                    </View>
                    <Text style={styles.actionArrow}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => navigation.navigate('ABDMLogs' as never)}
                >
                    <Text style={styles.actionIcon}>🔗</Text>
                    <View style={styles.actionInfo}>
                        <Text style={styles.actionTitle}>ABDM Transactions</Text>
                        <Text style={styles.actionSubtitle}>Gateway interaction logs</Text>
                    </View>
                    <Text style={styles.actionArrow}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => navigation.navigate('GenerateAuditReport' as never)}
                >
                    <Text style={styles.actionIcon}>📄</Text>
                    <View style={styles.actionInfo}>
                        <Text style={styles.actionTitle}>Generate Audit Report</Text>
                        <Text style={styles.actionSubtitle}>Download comprehensive report</Text>
                    </View>
                    <Text style={styles.actionArrow}>→</Text>
                </TouchableOpacity>
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>About Compliance Dashboard</Text>
                <Text style={styles.infoText}>
                    This dashboard provides complete transparency into how your health data is being
                    accessed and shared. All activities are logged and auditable in compliance with
                    ABDM regulations.
                </Text>
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
    recommendationsSection: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    recommendationsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    recommendationText: {
        fontSize: 14,
        color: '#f59e0b',
        marginBottom: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#3b82f6',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
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
    consentStats: {
        marginBottom: 12,
    },
    consentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    consentLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    consentValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    activeText: {
        color: '#10b981',
    },
    revokedText: {
        color: '#f59e0b',
    },
    expiredText: {
        color: '#9ca3af',
    },
    accessStats: {
        marginBottom: 12,
    },
    accessStatsTitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#6b7280',
        marginBottom: 12,
    },
    accessRow: {
        marginBottom: 12,
    },
    accessSource: {
        fontSize: 13,
        color: '#374151',
        marginBottom: 4,
    },
    accessBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    accessBar: {
        height: 8,
        backgroundColor: '#3b82f6',
        borderRadius: 4,
    },
    accessCount: {
        fontSize: 12,
        fontWeight: '600',
        color: '#3b82f6',
        minWidth: 30,
    },
    abdmStats: {
        marginBottom: 12,
    },
    abdmRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    abdmLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    abdmValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    failedText: {
        color: '#ef4444',
    },
    privacyStats: {
        gap: 12,
    },
    privacyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    privacyIcon: {
        fontSize: 24,
    },
    privacyInfo: {
        flex: 1,
    },
    privacyLabel: {
        fontSize: 13,
        color: '#6b7280',
    },
    privacyValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    viewButton: {
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    viewButtonText: {
        fontSize: 14,
        color: '#3b82f6',
        fontWeight: '500',
    },
    actionsSection: {
        marginHorizontal: 16,
        marginTop: 16,
    },
    actionsSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    actionIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    actionInfo: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    actionSubtitle: {
        fontSize: 13,
        color: '#6b7280',
    },
    actionArrow: {
        fontSize: 20,
        color: '#9ca3af',
    },
    infoSection: {
        backgroundColor: '#eff6ff',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e40af',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#1e3a8a',
        lineHeight: 20,
    },
});

export default ComplianceDashboardScreen;
