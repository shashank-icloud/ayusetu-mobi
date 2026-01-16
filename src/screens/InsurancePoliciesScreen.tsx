import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import insuranceService, { InsurancePolicy } from '../services/insuranceService';

type Props = NativeStackScreenProps<RootStackParamList, 'InsurancePolicies'>;

export default function InsurancePoliciesScreen({ navigation }: Props) {
    const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPolicies();
    }, []);

    const loadPolicies = async () => {
        try {
            const data = await insuranceService.getPolicies({ includeExpired: false });
            setPolicies(data);
        } catch (error) {
            console.error('Failed to load policies:', error);
            Alert.alert('Error', 'Failed to load insurance policies');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number): string => {
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            active: '#10b981',
            expired: '#ef4444',
            'grace-period': '#f59e0b',
            lapsed: '#64748b',
        };
        return colors[status] || '#64748b';
    };

    const calculateUsagePercent = (policy: InsurancePolicy): number => {
        return (policy.usedAmount / policy.sumInsured) * 100;
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Insurance Policies</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0ea5e9" />
                </View>
            </SafeAreaView>
        );
    }

    const totalCoverage = policies.reduce((sum, p) => sum + p.remainingAmount, 0);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Insurance Policies</Text>
                <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Add new policy')}>
                    <Text style={styles.addButton}>+</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Total Coverage Available</Text>
                    <Text style={styles.summaryAmount}>{formatCurrency(totalCoverage)}</Text>
                    <View style={styles.summaryStats}>
                        <View style={styles.summaryStat}>
                            <Text style={styles.summaryStatValue}>{policies.length}</Text>
                            <Text style={styles.summaryStatLabel}>Active Policies</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryStat}>
                            <Text style={styles.summaryStatValue}>{policies.filter(p => p.isPrimary).length}</Text>
                            <Text style={styles.summaryStatLabel}>Primary</Text>
                        </View>
                    </View>
                </View>

                {/* Policies List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Policies ({policies.length})</Text>

                    {policies.map((policy) => {
                        const usagePercent = calculateUsagePercent(policy);

                        return (
                            <View key={policy.id} style={styles.policyCard}>
                                <View style={styles.policyHeader}>
                                    <View style={styles.policyTitleRow}>
                                        <Text style={styles.policyProvider}>{policy.providerName}</Text>
                                        {policy.isPrimary && (
                                            <View style={styles.primaryBadge}>
                                                <Text style={styles.primaryBadgeText}>PRIMARY</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(policy.status) }]}>
                                        <Text style={styles.statusText}>{policy.status.toUpperCase()}</Text>
                                    </View>
                                </View>

                                <Text style={styles.policyNumber}>Policy: {policy.policyNumber}</Text>
                                <Text style={styles.policyType}>{policy.policyType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</Text>

                                {/* Coverage Progress */}
                                <View style={styles.coverageSection}>
                                    <View style={styles.coverageHeader}>
                                        <Text style={styles.coverageLabel}>Coverage Used</Text>
                                        <Text style={styles.coveragePercent}>{usagePercent.toFixed(0)}%</Text>
                                    </View>
                                    <View style={styles.progressBar}>
                                        <View style={[styles.progressFill, { width: `${Math.min(usagePercent, 100)}%` }]} />
                                    </View>
                                    <View style={styles.coverageAmounts}>
                                        <Text style={styles.usedAmount}>Used: {formatCurrency(policy.usedAmount)}</Text>
                                        <Text style={styles.remainingAmount}>Available: {formatCurrency(policy.remainingAmount)}</Text>
                                    </View>
                                </View>

                                {/* Members */}
                                <View style={styles.membersSection}>
                                    <Text style={styles.membersLabel}>Covered Members ({policy.membersCovered.length})</Text>
                                    <View style={styles.membersList}>
                                        {policy.membersCovered.map((member, idx) => (
                                            <View key={idx} style={styles.memberChip}>
                                                <Text style={styles.memberName}>{member.name}</Text>
                                                <Text style={styles.memberRelation}>({member.relation})</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                {/* Policy Details */}
                                <View style={styles.detailsGrid}>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Sum Insured</Text>
                                        <Text style={styles.detailValue}>{formatCurrency(policy.sumInsured)}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Cashless Hospitals</Text>
                                        <Text style={styles.detailValue}>{policy.cashlessHospitals.toLocaleString()}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Room Rent</Text>
                                        <Text style={styles.detailValue}>{formatCurrency(policy.roomRentLimit)}/day</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Co-payment</Text>
                                        <Text style={styles.detailValue}>{policy.coPaymentPercentage}%</Text>
                                    </View>
                                </View>

                                {/* Validity */}
                                <View style={styles.validitySection}>
                                    <View style={styles.validityRow}>
                                        <Text style={styles.validityLabel}>📅 Valid Until:</Text>
                                        <Text style={styles.validityDate}>{formatDate(policy.endDate)}</Text>
                                    </View>
                                    <View style={styles.validityRow}>
                                        <Text style={styles.validityLabel}>💰 Premium:</Text>
                                        <Text style={styles.validityDate}>{formatCurrency(policy.premiumAmount)}/{policy.premiumFrequency}</Text>
                                    </View>
                                </View>

                                {/* Actions */}
                                <View style={styles.actionsRow}>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => navigation.navigate('ClaimsTracking', { policyId: policy.id })}
                                    >
                                        <Text style={styles.actionButtonText}>View Claims</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => navigation.navigate('CashlessFlow', { policyId: policy.id })}
                                    >
                                        <Text style={styles.actionButtonText}>Cashless Hospitals</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    backButtonText: { fontSize: 28, color: '#0ea5e9' },
    title: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
    addButton: { fontSize: 32, color: '#0ea5e9', fontWeight: '300' },
    content: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    summaryCard: { margin: 20, padding: 20, backgroundColor: '#0ea5e9', borderRadius: 16 },
    summaryLabel: { fontSize: 14, color: '#e0f2fe', marginBottom: 8 },
    summaryAmount: { fontSize: 32, fontWeight: '700', color: '#fff', marginBottom: 16 },
    summaryStats: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
    summaryStat: { alignItems: 'center' },
    summaryStatValue: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 4 },
    summaryStatLabel: { fontSize: 12, color: '#e0f2fe' },
    summaryDivider: { width: 1, height: 40, backgroundColor: '#7dd3fc' },
    section: { marginBottom: 24, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
    policyCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    policyHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 },
    policyTitleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
    policyProvider: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
    primaryBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    primaryBadgeText: { fontSize: 10, fontWeight: '700', color: '#92400e' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
    statusText: { fontSize: 11, fontWeight: '700', color: '#fff' },
    policyNumber: { fontSize: 14, color: '#64748b', marginBottom: 4 },
    policyType: { fontSize: 14, color: '#64748b', marginBottom: 16 },
    coverageSection: { marginBottom: 16, padding: 16, backgroundColor: '#f8fafc', borderRadius: 12 },
    coverageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    coverageLabel: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
    coveragePercent: { fontSize: 14, fontWeight: '700', color: '#0ea5e9' },
    progressBar: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
    progressFill: { height: '100%', backgroundColor: '#0ea5e9' },
    coverageAmounts: { flexDirection: 'row', justifyContent: 'space-between' },
    usedAmount: { fontSize: 12, color: '#64748b' },
    remainingAmount: { fontSize: 12, fontWeight: '600', color: '#10b981' },
    membersSection: { marginBottom: 16 },
    membersLabel: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 8 },
    membersList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    memberChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#f1f5f9', borderRadius: 16 },
    memberName: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
    memberRelation: { fontSize: 12, color: '#64748b' },
    detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
    detailItem: { flex: 1, minWidth: '45%' },
    detailLabel: { fontSize: 12, color: '#64748b', marginBottom: 4 },
    detailValue: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
    validitySection: { marginBottom: 16, padding: 12, backgroundColor: '#fef3c7', borderRadius: 8 },
    validityRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    validityLabel: { fontSize: 13, color: '#92400e' },
    validityDate: { fontSize: 13, fontWeight: '600', color: '#92400e' },
    actionsRow: { flexDirection: 'row', gap: 12 },
    actionButton: { flex: 1, backgroundColor: '#0ea5e9', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    actionButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});
