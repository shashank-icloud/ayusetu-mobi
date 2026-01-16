import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import familyWellnessService, { PreventiveCareItem, FamilyMember } from '../services/familyWellnessService';

type Props = NativeStackScreenProps<RootStackParamList, 'PreventiveCare'>;

export default function PreventiveCareScreen({ navigation, route }: Props) {
    const { memberId } = route.params || {};
    const [careItems, setCareItems] = useState<PreventiveCareItem[]>([]);
    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>(memberId);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'due' | 'overdue'>('all');

    useEffect(() => {
        loadData();
    }, [selectedMemberId]);

    const loadData = async () => {
        try {
            const [careData, membersData] = await Promise.all([
                familyWellnessService.getPreventiveCare({ familyMemberId: selectedMemberId }),
                familyWellnessService.getFamilyMembers({}),
            ]);
            setCareItems(careData);
            setMembers(membersData);
        } catch (error) {
            console.error('Failed to load preventive care:', error);
            Alert.alert('Error', 'Failed to load preventive care items');
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority: string): string => {
        const colors: Record<string, string> = {
            urgent: '#ef4444',
            high: '#f59e0b',
            medium: '#3b82f6',
            low: '#64748b',
        };
        return colors[priority] || '#64748b';
    };

    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            due: '#f59e0b',
            overdue: '#ef4444',
            upcoming: '#0ea5e9',
            completed: '#10b981',
            'not-applicable': '#94a3b8',
        };
        return colors[status] || '#94a3b8';
    };

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleMarkComplete = async (itemId: string) => {
        Alert.alert(
            'Mark as Completed',
            'Have you completed this checkup?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Complete',
                    onPress: async () => {
                        try {
                            await familyWellnessService.completePreventiveCare({
                                itemId,
                                completedDate: new Date(),
                            });
                            loadData();
                            Alert.alert('Success', 'Checkup marked as completed');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to update status');
                        }
                    },
                },
            ]
        );
    };

    const filteredItems = filter === 'all'
        ? careItems
        : careItems.filter(item => item.status === filter);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Preventive Care</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0ea5e9" />
                </View>
            </SafeAreaView>
        );
    }

    const dueCount = careItems.filter(i => i.status === 'due' || i.status === 'overdue').length;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Preventive Care</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Health Checkups</Text>
                    <View style={styles.summaryStats}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: '#ef4444' }]}>{dueCount}</Text>
                            <Text style={styles.statLabel}>Due Now</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: '#10b981' }]}>
                                {careItems.filter(i => i.status === 'completed').length}
                            </Text>
                            <Text style={styles.statLabel}>Completed</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: '#0ea5e9' }]}>
                                {careItems.filter(i => i.status === 'upcoming').length}
                            </Text>
                            <Text style={styles.statLabel}>Upcoming</Text>
                        </View>
                    </View>
                </View>

                {/* Member Selector */}
                <View style={styles.memberSelector}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.memberScroll}>
                        <TouchableOpacity
                            style={[styles.memberChip, !selectedMemberId && styles.activeMemberChip]}
                            onPress={() => setSelectedMemberId(undefined)}
                        >
                            <Text style={[styles.memberChipText, !selectedMemberId && styles.activeMemberChipText]}>
                                All Members
                            </Text>
                        </TouchableOpacity>
                        {members.map((member) => (
                            <TouchableOpacity
                                key={member.id}
                                style={[styles.memberChip, selectedMemberId === member.id && styles.activeMemberChip]}
                                onPress={() => setSelectedMemberId(member.id)}
                            >
                                <Text style={[styles.memberChipText, selectedMemberId === member.id && styles.activeMemberChipText]}>
                                    {member.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Filter Tabs */}
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterTab, filter === 'due' && styles.activeFilterTab]}
                        onPress={() => setFilter('due')}
                    >
                        <Text style={[styles.filterText, filter === 'due' && styles.activeFilterText]}>Due</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterTab, filter === 'overdue' && styles.activeFilterTab]}
                        onPress={() => setFilter('overdue')}
                    >
                        <Text style={[styles.filterText, filter === 'overdue' && styles.activeFilterText]}>Overdue</Text>
                    </TouchableOpacity>
                </View>

                {/* Care Items List */}
                <View style={styles.section}>
                    {filteredItems.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No checkups found</Text>
                        </View>
                    ) : (
                        filteredItems.map((item) => {
                            const member = members.find(m => m.id === item.familyMemberId);
                            return (
                                <View key={item.id} style={styles.careCard}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.careInfo}>
                                            <Text style={styles.careName}>{item.name}</Text>
                                            <Text style={styles.careSubtitle}>
                                                {item.careType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                                {member && ` • ${member.name}`}
                                            </Text>
                                        </View>
                                        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
                                            <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.careDescription}>{item.description}</Text>

                                    <View style={styles.statusRow}>
                                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                                            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                                                {item.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                            </Text>
                                        </View>
                                        <Text style={styles.frequencyText}>
                                            {item.frequency === 'yearly' ? 'Annual' : item.frequency.charAt(0).toUpperCase() + item.frequency.slice(1)}
                                        </Text>
                                    </View>

                                    <View style={styles.datesSection}>
                                        {item.lastCompletedDate && (
                                            <View style={styles.dateRow}>
                                                <Text style={styles.dateLabel}>Last Completed:</Text>
                                                <Text style={styles.dateValue}>{formatDate(item.lastCompletedDate)}</Text>
                                            </View>
                                        )}
                                        {item.nextDueDate && (
                                            <View style={styles.dateRow}>
                                                <Text style={styles.dateLabel}>Next Due:</Text>
                                                <Text style={[
                                                    styles.dateValue,
                                                    { color: item.status === 'overdue' ? '#ef4444' : '#1e293b' }
                                                ]}>
                                                    {formatDate(item.nextDueDate)}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    {(item.status === 'due' || item.status === 'overdue') && (
                                        <TouchableOpacity
                                            style={styles.completeButton}
                                            onPress={() => handleMarkComplete(item.id)}
                                        >
                                            <Text style={styles.completeButtonText}>Mark as Completed</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                        })
                    )}
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
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { flex: 1 },
    summaryCard: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    summaryTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
    summaryStats: { flexDirection: 'row', justifyContent: 'space-around' },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
    statLabel: { fontSize: 12, color: '#64748b' },
    divider: { width: 1, backgroundColor: '#e2e8f0' },
    memberSelector: { backgroundColor: '#fff', paddingVertical: 12, marginBottom: 12 },
    memberScroll: { paddingHorizontal: 20, gap: 8 },
    memberChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
    activeMemberChip: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
    memberChipText: { fontSize: 13, color: '#64748b' },
    activeMemberChipText: { color: '#fff', fontWeight: '600' },
    filterContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16 },
    filterTab: { flex: 1, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f8fafc', alignItems: 'center' },
    activeFilterTab: { backgroundColor: '#e0f2fe' },
    filterText: { fontSize: 13, color: '#64748b' },
    activeFilterText: { color: '#0369a1', fontWeight: '600' },
    section: { paddingHorizontal: 20 },
    emptyState: { alignItems: 'center', padding: 40 },
    emptyText: { color: '#94a3b8', fontSize: 16 },
    careCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    careInfo: { flex: 1, marginRight: 12 },
    careName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    careSubtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
    priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    priorityText: { fontSize: 10, fontWeight: '700', color: '#fff' },
    careDescription: { fontSize: 13, color: '#64748b', marginBottom: 12 },
    statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 12, fontWeight: '600' },
    frequencyText: { fontSize: 12, color: '#64748b' },
    datesSection: { gap: 6, marginBottom: 12 },
    dateRow: { flexDirection: 'row', justifyContent: 'space-between' },
    dateLabel: { fontSize: 13, color: '#64748b' },
    dateValue: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
    completeButton: { backgroundColor: '#0ea5e9', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    completeButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});
