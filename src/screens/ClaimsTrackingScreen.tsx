import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import insuranceService, { Claim, ClaimStatus } from '../services/insuranceService';

type Props = NativeStackScreenProps<RootStackParamList, 'ClaimsTracking'>;

export default function ClaimsTrackingScreen({ navigation, route }: Props) {
    const { policyId } = route.params || {};
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<ClaimStatus | 'all'>('all');

    useEffect(() => {
        loadClaims();
    }, [policyId]);

    const loadClaims = async () => {
        try {
            // If policyId is provided, filter by it. Otherwise show all.
            // The service mock might need updating to support no filters or we just fetch for all policies we have access to
            // For now, let's assume getClaims can handle optional policyId or we fetch for all policies
            const data = await insuranceService.getClaims({ policyId });
            setClaims(data);
        } catch (error) {
            console.error('Failed to load claims:', error);
            Alert.alert('Error', 'Failed to load claims history');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: ClaimStatus): string => {
        const colors: Record<string, string> = {
            draft: '#94a3b8',
            submitted: '#3b82f6',
            'under-review': '#f59e0b',
            approved: '#10b981',
            settled: '#059669',
            rejected: '#ef4444',
            reimbursed: '#059669',
        };
        return colors[status] || '#94a3b8';
    };

    const getStatusLabel = (status: ClaimStatus): string => {
        return status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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

    const filteredClaims = filter === 'all'
        ? claims
        : claims.filter(c => c.status === filter);

    const filters: (ClaimStatus | 'all')[] = ['all', 'submitted', 'under-review', 'approved', 'rejected'];

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Claims Tracking</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0ea5e9" />
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
                <Text style={styles.title}>Claims Tracking</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {filters.map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterChip, filter === f && styles.activeFilterChip]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>
                                {f === 'all' ? 'All Claims' : getStatusLabel(f as ClaimStatus)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {filteredClaims.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No claims found</Text>
                    </View>
                ) : (
                    filteredClaims.map((claim) => (
                        <View key={claim.id} style={styles.claimCard}>
                            <View style={styles.claimHeader}>
                                <View>
                                    <Text style={styles.claimNumber}>#{claim.claimNumber}</Text>
                                    <Text style={styles.claimDate}>{formatDate(claim.claimDate)}</Text>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(claim.status) + '20' }]}>
                                    <Text style={[styles.statusText, { color: getStatusColor(claim.status) }]}>
                                        {getStatusLabel(claim.status)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.claimDetails}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Treatment</Text>
                                    <Text style={styles.detailValue}>{claim.treatmentType}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Hospital</Text>
                                    <Text style={styles.detailValue}>{claim.hospitalName}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Claim Type</Text>
                                    <Text style={styles.detailValue}>
                                        {claim.claimType.charAt(0).toUpperCase() + claim.claimType.slice(1)}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.amountSection}>
                                <View style={styles.amountBlock}>
                                    <Text style={styles.amountLabel}>Claim Amount</Text>
                                    <Text style={styles.amountValue}>{formatCurrency(claim.claimAmount)}</Text>
                                </View>
                                {claim.approvedAmount && (
                                    <>
                                        <View style={styles.verticalDivider} />
                                        <View style={styles.amountBlock}>
                                            <Text style={[styles.amountLabel, { color: '#10b981' }]}>Approved</Text>
                                            <Text style={[styles.amountValue, { color: '#10b981' }]}>
                                                {formatCurrency(claim.approvedAmount)}
                                            </Text>
                                        </View>
                                    </>
                                )}
                            </View>

                            {/* Status Timeline - simplified showing last update */}
                            <View style={styles.timelineSection}>
                                <Text style={styles.timelineTitle}>Latest Update</Text>
                                {claim.statusHistory.slice(-1).map((history, idx) => (
                                    <View key={idx} style={styles.timelineItem}>
                                        <View style={[styles.timelineDot, { backgroundColor: getStatusColor(history.status) }]} />
                                        <View style={styles.timelineContent}>
                                            <Text style={styles.timelineStatus}>{getStatusLabel(history.status)}</Text>
                                            <Text style={styles.timelineDate}>{formatDate(history.date)}</Text>
                                            {history.remarks && (
                                                <Text style={styles.timelineRemarks}>{history.remarks}</Text>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>

                            {/* Actions */}
                            <View style={styles.cardActions}>
                                <TouchableOpacity
                                    style={styles.outlineButton}
                                    onPress={() => Alert.alert('Documents', `${claim.documents.length} documents attached`)}
                                >
                                    <Text style={styles.outlineButtonText}>View Documents</Text>
                                </TouchableOpacity>
                                {claim.status === 'rejected' && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => Alert.alert('Appeal', 'Start appeal process')}
                                    >
                                        <Text style={styles.actionButtonText}>Appeal Rejection</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))
                )}
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* FAB to submit new claim */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => Alert.alert('New Claim', 'Start new claim submission')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    backButtonText: { fontSize: 28, color: '#0ea5e9' },
    title: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    filterContainer: { backgroundColor: '#fff', paddingVertical: 12 },
    filterScroll: { paddingHorizontal: 20, gap: 8 },
    filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
    activeFilterChip: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
    filterText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
    activeFilterText: { color: '#fff' },
    content: { flex: 1, padding: 20 },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
    emptyText: { fontSize: 16, color: '#94a3b8' },
    claimCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    claimHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    claimNumber: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    claimDate: { fontSize: 12, color: '#64748b', marginTop: 2 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    statusText: { fontSize: 12, fontWeight: '700' },
    divider: { height: 1, backgroundColor: '#e2e8f0', marginBottom: 16 },
    claimDetails: { gap: 8, marginBottom: 16 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
    detailLabel: { fontSize: 14, color: '#64748b' },
    detailValue: { fontSize: 14, fontWeight: '600', color: '#1e293b', flex: 1, textAlign: 'right' },
    amountSection: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16 },
    amountBlock: { flex: 1, alignItems: 'center' },
    verticalDivider: { width: 1, backgroundColor: '#e2e8f0' },
    amountLabel: { fontSize: 12, color: '#64748b', marginBottom: 4 },
    amountValue: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    timelineSection: { marginBottom: 16 },
    timelineTitle: { fontSize: 12, fontWeight: '700', color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase' },
    timelineItem: { flexDirection: 'row', gap: 12 },
    timelineDot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
    timelineContent: { flex: 1 },
    timelineStatus: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
    timelineDate: { fontSize: 12, color: '#64748b' },
    timelineRemarks: { fontSize: 12, color: '#64748b', marginTop: 4, fontStyle: 'italic' },
    cardActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
    outlineButton: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
    outlineButtonText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
    actionButton: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#ef4444', alignItems: 'center' },
    actionButtonText: { fontSize: 13, fontWeight: '600', color: '#fff' },
    fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#0ea5e9', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
    fabText: { fontSize: 32, color: '#fff', fontWeight: '300', marginTop: -4 },
});
