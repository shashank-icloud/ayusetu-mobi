import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import familyWellnessService, { FamilyMember } from '../services/familyWellnessService';

type Props = NativeStackScreenProps<RootStackParamList, 'FamilyHealthDashboard'>;

export default function FamilyHealthDashboardScreen({ navigation }: Props) {
    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFamilyMembers();
    }, []);

    const loadFamilyMembers = async () => {
        try {
            const data = await familyWellnessService.getFamilyMembers({});
            setMembers(data);
        } catch (error) {
            console.error('Failed to load family members:', error);
            Alert.alert('Error', 'Failed to load family members');
        } finally {
            setLoading(false);
        }
    };

    const getAgeGroupIcon = (ageGroup: string): string => {
        const icons: Record<string, string> = {
            infant: '👶',
            toddler: '🧒',
            child: '👧',
            teen: '🧑',
            adult: '👤',
            senior: '👴',
        };
        return icons[ageGroup] || '👤';
    };

    const getRelationIcon = (relation: string): string => {
        const icons: Record<string, string> = {
            self: '👤',
            spouse: '💑',
            child: '👶',
            parent: '👴',
            sibling: '👫',
            grandparent: '👵',
        };
        return icons[relation] || '👤';
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Family Health</Text>
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
                <Text style={styles.title}>Family Health</Text>
                <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Add family member')}>
                    <Text style={styles.addButton}>+</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Family Overview</Text>
                    <View style={styles.summaryStats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{members.length}</Text>
                            <Text style={styles.statLabel}>Members</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {members.filter(m => m.vaccinationsUpToDate).length}
                            </Text>
                            <Text style={styles.statLabel}>Vaccinated</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {members.filter(m => m.nextCheckupDue).length}
                            </Text>
                            <Text style={styles.statLabel}>Checkups Due</Text>
                        </View>
                    </View>
                </View>

                {/* Family Members List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Family Members ({members.length})</Text>

                    {members.map((member) => (
                        <View key={member.id} style={styles.memberCard}>
                            <View style={styles.memberHeader}>
                                <View style={styles.memberInfo}>
                                    <View style={styles.iconRow}>
                                        <Text style={styles.memberIcon}>{getRelationIcon(member.relation)}</Text>
                                        <View>
                                            <Text style={styles.memberName}>{member.name}</Text>
                                            <Text style={styles.memberRelation}>
                                                {member.relation.charAt(0).toUpperCase() + member.relation.slice(1)} • {member.age} years
                                            </Text>
                                        </View>
                                    </View>
                                    {member.isPrimary && (
                                        <View style={styles.primaryBadge}>
                                            <Text style={styles.primaryText}>PRIMARY</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Health Stats Grid */}
                            <View style={styles.statsGrid}>
                                <View style={styles.statBox}>
                                    <Text style={styles.statBoxLabel}>Blood Group</Text>
                                    <Text style={styles.statBoxValue}>{member.bloodGroup || 'N/A'}</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statBoxLabel}>BMI</Text>
                                    <Text style={styles.statBoxValue}>{member.bmi?.toFixed(1) || 'N/A'}</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statBoxLabel}>Weight</Text>
                                    <Text style={styles.statBoxValue}>{member.weight ? `${member.weight}kg` : 'N/A'}</Text>
                                </View>
                            </View>

                            {/* Health Indicators */}
                            {member.chronicConditions.length > 0 && (
                                <View style={styles.conditionsSection}>
                                    <Text style={styles.conditionsLabel}>⚠️ Chronic Conditions:</Text>
                                    <View style={styles.chipContainer}>
                                        {member.chronicConditions.map((condition, idx) => (
                                            <View key={idx} style={styles.conditionChip}>
                                                <Text style={styles.chipText}>{condition}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {member.allergies.length > 0 && (
                                <View style={styles.allergiesSection}>
                                    <Text style={styles.allergiesLabel}>🚫 Allergies:</Text>
                                    <View style={styles.chipContainer}>
                                        {member.allergies.map((allergy, idx) => (
                                            <View key={idx} style={styles.allergyChip}>
                                                <Text style={styles.chipText}>{allergy}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Vaccination Status */}
                            <View style={styles.vaccinationRow}>
                                <Text style={styles.vaccinationLabel}>💉 Vaccinations:</Text>
                                <View style={[
                                    styles.vaccinationBadge,
                                    { backgroundColor: member.vaccinationsUpToDate ? '#dcfce7' : '#fef3c7' }
                                ]}>
                                    <Text style={[
                                        styles.vaccinationText,
                                        { color: member.vaccinationsUpToDate ? '#166534' : '#92400e' }
                                    ]}>
                                        {member.vaccinationsUpToDate ? 'Up to Date' : 'Pending'}
                                    </Text>
                                </View>
                            </View>

                            {/* Next Checkup */}
                            {member.nextCheckupDue && (
                                <View style={styles.checkupRow}>
                                    <Text style={styles.checkupLabel}>📅 Next Checkup:</Text>
                                    <Text style={styles.checkupDate}>
                                        {new Date(member.nextCheckupDue).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </Text>
                                </View>
                            )}

                            {/* Actions */}
                            <View style={styles.actionsRow}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => navigation.navigate('VaccinationCalendar', { memberId: member.id })}
                                >
                                    <Text style={styles.actionButtonText}>Vaccinations</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => navigation.navigate('WellnessTracking', { memberId: member.id })}
                                >
                                    <Text style={styles.actionButtonText}>Wellness</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => navigation.navigate('PreventiveCare', { memberId: member.id })}
                                >
                                    <Text style={styles.actionButtonText}>Checkups</Text>
                                </TouchableOpacity>
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
    summaryCard: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    summaryTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
    summaryStats: { flexDirection: 'row', justifyContent: 'space-around' },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 24, fontWeight: '700', color: '#0ea5e9', marginBottom: 4 },
    statLabel: { fontSize: 12, color: '#64748b' },
    divider: { width: 1, backgroundColor: '#e2e8f0' },
    section: { paddingHorizontal: 20, marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
    memberCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    memberHeader: { marginBottom: 16 },
    memberInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    iconRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    memberIcon: { fontSize: 32 },
    memberName: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
    memberRelation: { fontSize: 13, color: '#64748b', marginTop: 2 },
    primaryBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    primaryText: { fontSize: 10, fontWeight: '700', color: '#92400e' },
    statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
    statBox: { flex: 1, backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, alignItems: 'center' },
    statBoxLabel: { fontSize: 11, color: '#64748b', marginBottom: 4 },
    statBoxValue: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    conditionsSection: { marginBottom: 12 },
    conditionsLabel: { fontSize: 13, fontWeight: '600', color: '#dc2626', marginBottom: 6 },
    allergiesSection: { marginBottom: 12 },
    allergiesLabel: { fontSize: 13, fontWeight: '600', color: '#ea580c', marginBottom: 6 },
    chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    conditionChip: { backgroundColor: '#fee2e2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    allergyChip: { backgroundColor: '#fed7aa', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    chipText: { fontSize: 12, color: '#1e293b' },
    vaccinationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    vaccinationLabel: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
    vaccinationBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    vaccinationText: { fontSize: 12, fontWeight: '600' },
    checkupRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    checkupLabel: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
    checkupDate: { fontSize: 13, color: '#64748b' },
    actionsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
    actionButton: { flex: 1, backgroundColor: '#f1f5f9', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    actionButtonText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
});
