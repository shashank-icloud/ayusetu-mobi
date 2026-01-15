import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    Modal,
    TextInput,
} from 'react-native';
import {
    insightsService,
    Medication,
    MedicationAdherence,
    COMPLIANCE_DISCLAIMER,
} from '../services/insightsService';

/**
 * Medication Adherence Screen
 * 
 * Medication tracking and adherence management:
 * - View all medications
 * - Track adherence percentage
 * - Log medication intake
 * - View streaks and statistics
 * - Set reminders
 * 
 * ⚠️ For tracking purposes only, not medical advice
 */

export const MedicationAdherenceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [medications, setMedications] = useState<Medication[]>([]);
    const [adherence, setAdherence] = useState<MedicationAdherence[]>([]);
    const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [medsData, adhData] = await Promise.all([
                insightsService.getMedications(),
                insightsService.getMedicationAdherence(),
            ]);
            setMedications(medsData);
            setAdherence(adhData);
        } catch (error) {
            console.error('Failed to load medication data:', error);
            Alert.alert('Error', 'Failed to load medication data.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogMedication = async (medicationId: string) => {
        try {
            await insightsService.logMedicationTaken(medicationId);
            Alert.alert('Success', 'Medication logged successfully');
            loadData();
        } catch (error) {
            Alert.alert('Error', 'Failed to log medication');
        }
    };

    const getAdherenceColor = (percentage: number): string => {
        if (percentage >= 90) return '#10b981';
        if (percentage >= 75) return '#f59e0b';
        return '#ef4444';
    };

    const getMedicationAdherence = (medId: string): MedicationAdherence | undefined => {
        return adherence.find(a => a.medicationId === medId);
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0ea5e9" />
                <Text style={styles.loadingText}>Loading medications...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Disclaimer */}
                <View style={styles.disclaimerContainer}>
                    <Text style={styles.disclaimerIcon}>ℹ️</Text>
                    <Text style={styles.disclaimerText}>{COMPLIANCE_DISCLAIMER.text}</Text>
                </View>

                {/* Overall Adherence Summary */}
                {adherence.length > 0 && (
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>Overall Adherence</Text>
                        <View style={styles.summaryStats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {(adherence.reduce((sum, a) => sum + a.adherencePercentage, 0) / adherence.length).toFixed(1)}%
                                </Text>
                                <Text style={styles.statLabel}>Average</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {adherence.reduce((sum, a) => sum + a.takenDoses, 0)}
                                </Text>
                                <Text style={styles.statLabel}>Doses Taken</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {Math.max(...adherence.map(a => a.streak))}
                                </Text>
                                <Text style={styles.statLabel}>Best Streak</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Medications List */}
                {medications.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>💊</Text>
                        <Text style={styles.emptyText}>No medications added yet</Text>
                        <Text style={styles.emptySubtext}>Add medications to track adherence</Text>
                    </View>
                ) : (
                    medications.map(med => {
                        const medAdherence = getMedicationAdherence(med.id);
                        return (
                            <View key={med.id} style={styles.medCard}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedMed(med);
                                        setShowDetailsModal(true);
                                    }}
                                >
                                    <View style={styles.medHeader}>
                                        <View style={styles.medInfo}>
                                            <Text style={styles.medName}>{med.name}</Text>
                                            <Text style={styles.medDosage}>{med.dosage} • {med.frequency}</Text>
                                            <Text style={styles.medPurpose}>{med.purpose}</Text>
                                        </View>
                                        {medAdherence && (
                                            <View style={styles.adherenceCircle}>
                                                <Text
                                                    style={[
                                                        styles.adherencePercent,
                                                        { color: getAdherenceColor(medAdherence.adherencePercentage) },
                                                    ]}
                                                >
                                                    {medAdherence.adherencePercentage.toFixed(0)}%
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    {medAdherence && (
                                        <View style={styles.adherenceDetails}>
                                            <View style={styles.adherenceBar}>
                                                <View
                                                    style={[
                                                        styles.adherenceBarFill,
                                                        {
                                                            width: `${medAdherence.adherencePercentage}%`,
                                                            backgroundColor: getAdherenceColor(medAdherence.adherencePercentage),
                                                        },
                                                    ]}
                                                />
                                            </View>
                                            <View style={styles.adherenceStats}>
                                                <Text style={styles.adherenceStat}>
                                                    {medAdherence.takenDoses}/{medAdherence.totalDoses} doses
                                                </Text>
                                                <Text style={styles.streakText}>🔥 {medAdherence.streak} day streak</Text>
                                            </View>
                                            {medAdherence.nextDue && (
                                                <Text style={styles.nextDue}>
                                                    Next: {new Date(medAdherence.nextDue).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </Text>
                                            )}
                                        </View>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.logButton}
                                    onPress={() => handleLogMedication(med.id)}
                                >
                                    <Text style={styles.logButtonText}>✓ Mark as Taken</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })
                )}
            </ScrollView>

            {/* Medication Details Modal */}
            <Modal visible={showDetailsModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedMed && (
                            <>
                                <Text style={styles.modalTitle}>{selectedMed.name}</Text>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Dosage:</Text>
                                    <Text style={styles.detailValue}>{selectedMed.dosage}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Frequency:</Text>
                                    <Text style={styles.detailValue}>{selectedMed.frequency}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Purpose:</Text>
                                    <Text style={styles.detailValue}>{selectedMed.purpose}</Text>
                                </View>
                                {selectedMed.activeIngredient && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Active Ingredient:</Text>
                                        <Text style={styles.detailValue}>{selectedMed.activeIngredient}</Text>
                                    </View>
                                )}
                                {selectedMed.prescribedBy && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Prescribed By:</Text>
                                        <Text style={styles.detailValue}>{selectedMed.prescribedBy}</Text>
                                    </View>
                                )}
                                {selectedMed.instructions && (
                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailSectionTitle}>Instructions:</Text>
                                        <Text style={styles.detailSectionText}>{selectedMed.instructions}</Text>
                                    </View>
                                )}
                                {selectedMed.sideEffects && selectedMed.sideEffects.length > 0 && (
                                    <View style={styles.detailSection}>
                                        <Text style={styles.detailSectionTitle}>Possible Side Effects:</Text>
                                        {selectedMed.sideEffects.map((effect, idx) => (
                                            <Text key={idx} style={styles.sideEffect}>• {effect}</Text>
                                        ))}
                                    </View>
                                )}
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setShowDetailsModal(false)}
                                >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
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
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748b',
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
    summaryCard: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 20,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 16,
    },
    summaryStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0ea5e9',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#64748b',
    },
    medCard: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    medHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    medInfo: {
        flex: 1,
    },
    medName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    medDosage: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 2,
    },
    medPurpose: {
        fontSize: 12,
        color: '#94a3b8',
        fontStyle: 'italic',
    },
    adherenceCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adherencePercent: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    adherenceDetails: {
        marginBottom: 12,
    },
    adherenceBar: {
        height: 6,
        backgroundColor: '#e2e8f0',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
    },
    adherenceBarFill: {
        height: '100%',
    },
    adherenceStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    adherenceStat: {
        fontSize: 12,
        color: '#64748b',
    },
    streakText: {
        fontSize: 12,
        color: '#f59e0b',
        fontWeight: '600',
    },
    nextDue: {
        fontSize: 12,
        color: '#0ea5e9',
        fontWeight: '500',
    },
    logButton: {
        backgroundColor: '#10b981',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    logButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        width: '90%',
        maxHeight: '80%',
        padding: 24,
        borderRadius: 12,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
        width: 120,
    },
    detailValue: {
        flex: 1,
        fontSize: 14,
        color: '#1e293b',
    },
    detailSection: {
        marginTop: 16,
        marginBottom: 12,
    },
    detailSectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 8,
    },
    detailSectionText: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
    },
    sideEffect: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 4,
    },
    closeButton: {
        backgroundColor: '#0ea5e9',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
});
