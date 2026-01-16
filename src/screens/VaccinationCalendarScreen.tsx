import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import familyWellnessService, { VaccinationRecord, VaccineSchedule, FamilyMember } from '../services/familyWellnessService';

type Props = NativeStackScreenProps<RootStackParamList, 'VaccinationCalendar'>;

export default function VaccinationCalendarScreen({ navigation, route }: Props) {
    const { memberId } = route.params || {};
    const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
    const [schedule, setSchedule] = useState<VaccineSchedule[]>([]);
    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>(memberId);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'all' | 'due' | 'completed'>('all');

    useEffect(() => {
        loadData();
    }, [selectedMemberId]);

    const loadData = async () => {
        try {
            const [vaccinationsData, scheduleData, membersData] = await Promise.all([
                familyWellnessService.getVaccinations({ familyMemberId: selectedMemberId }),
                familyWellnessService.getVaccineSchedule(),
                familyWellnessService.getFamilyMembers({}),
            ]);
            setVaccinations(vaccinationsData);
            setSchedule(scheduleData);
            setMembers(membersData);
        } catch (error) {
            console.error('Failed to load vaccinations:', error);
            Alert.alert('Error', 'Failed to load vaccination data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            completed: '#10b981',
            due: '#f59e0b',
            overdue: '#ef4444',
            upcoming: '#0ea5e9',
            skipped: '#94a3b8',
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

    const filteredVaccinations = filterStatus === 'all'
        ? vaccinations
        : vaccinations.filter(v =>
            filterStatus === 'completed' ? v.status === 'completed' : (v.status === 'due' || v.status === 'overdue')
        );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Vaccination Calendar</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0ea5e9" />
                </View>
            </SafeAreaView>
        );
    }

    const selectedMember = members.find(m => m.id === selectedMemberId);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Vaccinations</Text>
                <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Record new vaccination')}>
                    <Text style={styles.addButton}>+</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                        style={[styles.filterTab, filterStatus === 'all' && styles.activeFilterTab]}
                        onPress={() => setFilterStatus('all')}
                    >
                        <Text style={[styles.filterText, filterStatus === 'all' && styles.activeFilterText]}>
                            All ({vaccinations.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterTab, filterStatus === 'due' && styles.activeFilterTab]}
                        onPress={() => setFilterStatus('due')}
                    >
                        <Text style={[styles.filterText, filterStatus === 'due' && styles.activeFilterText]}>
                            Due ({vaccinations.filter(v => v.status === 'due' || v.status === 'overdue').length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterTab, filterStatus === 'completed' && styles.activeFilterTab]}
                        onPress={() => setFilterStatus('completed')}
                    >
                        <Text style={[styles.filterText, filterStatus === 'completed' && styles.activeFilterText]}>
                            Completed ({vaccinations.filter(v => v.status === 'completed').length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Vaccination Records */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vaccination History</Text>
                    {filteredVaccinations.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No vaccinations found</Text>
                        </View>
                    ) : (
                        filteredVaccinations.map((vaccination) => {
                            const member = members.find(m => m.id === vaccination.familyMemberId);
                            return (
                                <View key={vaccination.id} style={styles.vaccinationCard}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.vaccineName}>
                                            <Text style={styles.vaccineTitle}>{vaccination.vaccineName}</Text>
                                            <Text style={styles.vaccineSubtitle}>
                                                Dose {vaccination.doseNumber}/{vaccination.totalDoses}
                                                {member && ` • ${member.name}`}
                                            </Text>
                                        </View>
                                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(vaccination.status) }]}>
                                            <Text style={styles.statusText}>
                                                {vaccination.status.toUpperCase().replace('-', ' ')}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailsGrid}>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.detailLabel}>
                                                {vaccination.status === 'completed' ? 'Administered' : 'Scheduled'}
                                            </Text>
                                            <Text style={styles.detailValue}>
                                                {formatDate(vaccination.administeredDate || vaccination.scheduledDate)}
                                            </Text>
                                        </View>
                                        {vaccination.nextDueDate && (
                                            <View style={styles.detailItem}>
                                                <Text style={styles.detailLabel}>Next Due</Text>
                                                <Text style={styles.detailValue}>{formatDate(vaccination.nextDueDate)}</Text>
                                            </View>
                                        )}
                                    </View>

                                    {vaccination.hospitalName && (
                                        <View style={styles.hospitalRow}>
                                            <Text style={styles.hospitalIcon}>🏥</Text>
                                            <Text style={styles.hospitalName}>{vaccination.hospitalName}</Text>
                                        </View>
                                    )}

                                    {vaccination.status === 'due' || vaccination.status === 'overdue' ? (
                                        <TouchableOpacity
                                            style={styles.recordButton}
                                            onPress={() => Alert.alert('Record Vaccination', 'Mark as administered?')}
                                        >
                                            <Text style={styles.recordButtonText}>Record Vaccination</Text>
                                        </TouchableOpacity>
                                    ) : vaccination.certificateUrl ? (
                                        <TouchableOpacity style={styles.certificateButton}>
                                            <Text style={styles.certificateButtonText}>View Certificate</Text>
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                            );
                        })
                    )}
                </View>

                {/* Vaccine Schedule Reference */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recommended Vaccine Schedule</Text>
                    {schedule.map((vaccine, idx) => (
                        <View key={idx} style={styles.scheduleCard}>
                            <View style={styles.scheduleHeader}>
                                <Text style={styles.scheduleName}>{vaccine.vaccineName}</Text>
                                <View style={[styles.ageBadge, { backgroundColor: '#e0f2fe' }]}>
                                    <Text style={styles.ageText}>
                                        {vaccine.ageGroup.charAt(0).toUpperCase() + vaccine.ageGroup.slice(1)}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.scheduleDescription}>{vaccine.description}</Text>
                            <View style={styles.scheduleDetails}>
                                <Text style={styles.scheduleInfo}>📅 {vaccine.recommendedAge}</Text>
                                <Text style={styles.scheduleInfo}>💉 {vaccine.totalDoses} dose(s)</Text>
                            </View>
                            <View style={styles.protectionRow}>
                                <Text style={styles.protectionLabel}>Protects against:</Text>
                                <Text style={styles.protectionText}>{vaccine.protectsAgainst.join(', ')}</Text>
                            </View>
                        </View>
                    ))}
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
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { flex: 1 },
    memberSelector: { backgroundColor: '#fff', paddingVertical: 12 },
    memberScroll: { paddingHorizontal: 20, gap: 8 },
    memberChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
    activeMemberChip: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
    memberChipText: { fontSize: 13, color: '#64748b' },
    activeMemberChipText: { color: '#fff', fontWeight: '600' },
    filterContainer: { flexDirection: 'row', padding: 16, gap: 8, backgroundColor: '#fff' },
    filterTab: { flex: 1, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f8fafc', alignItems: 'center' },
    activeFilterTab: { backgroundColor: '#e0f2fe' },
    filterText: { fontSize: 13, color: '#64748b' },
    activeFilterText: { color: '#0369a1', fontWeight: '600' },
    section: { paddingHorizontal: 20, marginTop: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
    emptyState: { alignItems: 'center', padding: 40 },
    emptyText: { color: '#94a3b8', fontSize: 16 },
    vaccinationCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    vaccineName: { flex: 1, marginRight: 12 },
    vaccineTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    vaccineSubtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    statusText: { fontSize: 11, fontWeight: '700', color: '#fff' },
    detailsGrid: { flexDirection: 'row', gap: 16, marginBottom: 12 },
    detailItem: {},
    detailLabel: { fontSize: 12, color: '#64748b', marginBottom: 2 },
    detailValue: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
    hospitalRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    hospitalIcon: { fontSize: 14 },
    hospitalName: { fontSize: 13, color: '#64748b' },
    recordButton: { backgroundColor: '#0ea5e9', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    recordButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
    certificateButton: { backgroundColor: '#f1f5f9', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    certificateButtonText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
    scheduleCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    scheduleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    scheduleName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
    ageBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    ageText: { fontSize: 11, fontWeight: '600', color: '#0369a1' },
    scheduleDescription: { fontSize: 13, color: '#64748b', marginBottom: 8 },
    scheduleDetails: { flexDirection: 'row', gap: 16, marginBottom: 8 },
    scheduleInfo: { fontSize: 12, color: '#64748b' },
    protectionRow: { flexDirection: 'row', gap: 8 },
    protectionLabel: { fontSize: 12, fontWeight: '600', color: '#1e293b' },
    protectionText: { fontSize: 12, color: '#64748b', flex: 1 },
});
