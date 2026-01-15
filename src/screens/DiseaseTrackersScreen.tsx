import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    TextInput,
    Modal,
} from 'react-native';
import { insightsService, DiseaseTracker, COMPLIANCE_DISCLAIMER } from '../services/insightsService';

/**
 * Disease Trackers Screen
 * 
 * Chronic disease management and tracking:
 * - Track multiple chronic conditions
 * - Set and monitor health goals
 * - Record metrics and adherence
 * - View progress over time
 * 
 * ⚠️ Informational tracking only, not for diagnosis
 */

export const DiseaseTrackersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [trackers, setTrackers] = useState<DiseaseTracker[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newDiseaseName, setNewDiseaseName] = useState('');

    useEffect(() => {
        loadTrackers();
    }, []);

    const loadTrackers = async () => {
        try {
            setLoading(true);
            const data = await insightsService.getDiseaseTrackers();
            setTrackers(data);
        } catch (error) {
            console.error('Failed to load trackers:', error);
            Alert.alert('Error', 'Failed to load disease trackers.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTracker = async () => {
        if (!newDiseaseName.trim()) {
            Alert.alert('Error', 'Please enter a disease name');
            return;
        }

        try {
            await insightsService.createDiseaseTracker('other', newDiseaseName);
            setShowAddModal(false);
            setNewDiseaseName('');
            loadTrackers();
            Alert.alert('Success', 'Disease tracker created successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to create tracker');
        }
    };

    const getAdherenceColor = (score: number): string => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const getStatusColor = (status: DiseaseTracker['status']): string => {
        if (status === 'active') return '#0ea5e9';
        if (status === 'managed') return '#10b981';
        return '#94a3b8';
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0ea5e9" />
                <Text style={styles.loadingText}>Loading disease trackers...</Text>
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

                {trackers.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📋</Text>
                        <Text style={styles.emptyText}>No disease trackers yet</Text>
                        <Text style={styles.emptySubtext}>Track chronic conditions and monitor your progress</Text>
                    </View>
                ) : (
                    trackers.map(tracker => (
                        <View key={tracker.id} style={styles.trackerCard}>
                            {/* Header */}
                            <View style={styles.trackerHeader}>
                                <View style={styles.trackerTitleContainer}>
                                    <Text style={styles.trackerTitle}>{tracker.displayName}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tracker.status) + '20' }]}>
                                        <Text style={[styles.statusText, { color: getStatusColor(tracker.status) }]}>
                                            {tracker.status.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.trackerDate}>
                                    Since {new Date(tracker.startDate).toLocaleDateString()}
                                </Text>
                            </View>

                            {/* Adherence Score */}
                            {tracker.adherenceScore !== undefined && (
                                <View style={styles.adherenceContainer}>
                                    <Text style={styles.adherenceLabel}>Overall Adherence</Text>
                                    <View style={styles.adherenceBar}>
                                        <View
                                            style={[
                                                styles.adherenceProgress,
                                                {
                                                    width: `${tracker.adherenceScore}%`,
                                                    backgroundColor: getAdherenceColor(tracker.adherenceScore),
                                                },
                                            ]}
                                        />
                                    </View>
                                    <Text style={[styles.adherenceScore, { color: getAdherenceColor(tracker.adherenceScore) }]}>
                                        {tracker.adherenceScore}%
                                    </Text>
                                </View>
                            )}

                            {/* Goals */}
                            {tracker.goals && tracker.goals.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Health Goals</Text>
                                    {tracker.goals.map(goal => (
                                        <View key={goal.id} style={styles.goalItem}>
                                            <View style={styles.goalHeader}>
                                                <Text style={styles.goalDescription}>{goal.description}</Text>
                                                {goal.achieved && <Text style={styles.achievedBadge}>✓ Achieved</Text>}
                                            </View>
                                            <View style={styles.goalProgress}>
                                                <View style={styles.goalBar}>
                                                    <View
                                                        style={[
                                                            styles.goalBarFill,
                                                            {
                                                                width: `${Math.min(goal.progress, 100)}%`,
                                                                backgroundColor: goal.achieved ? '#10b981' : '#0ea5e9',
                                                            },
                                                        ]}
                                                    />
                                                </View>
                                                <Text style={styles.goalValue}>
                                                    {goal.currentValue}/{goal.targetValue} {goal.unit}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Metrics */}
                            {tracker.metrics && tracker.metrics.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Key Metrics</Text>
                                    <View style={styles.metricsGrid}>
                                        {tracker.metrics.map((metric, index) => (
                                            <View key={index} style={styles.metricCard}>
                                                <Text style={styles.metricName}>{metric.name}</Text>
                                                <Text style={styles.metricValue}>
                                                    {metric.value} {metric.unit}
                                                </Text>
                                                <View style={[styles.metricStatus, { backgroundColor: getMetricStatusColor(metric.status) }]}>
                                                    <Text style={styles.metricStatusText}>{metric.status.toUpperCase()}</Text>
                                                </View>
                                                {metric.lastRecorded && (
                                                    <Text style={styles.metricDate}>
                                                        Last: {new Date(metric.lastRecorded).toLocaleDateString()}
                                                    </Text>
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            <Text style={styles.lastUpdated}>
                                Last updated: {new Date(tracker.lastUpdated).toLocaleString()}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Add Tracker Button */}
            <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

            {/* Add Tracker Modal */}
            <Modal visible={showAddModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Disease Tracker</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Enter disease name (e.g., Diabetes, Hypertension)"
                            value={newDiseaseName}
                            onChangeText={setNewDiseaseName}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setShowAddModal(false);
                                    setNewDiseaseName('');
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.addButton]} onPress={handleAddTracker}>
                                <Text style={styles.addButtonText}>Add Tracker</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const getMetricStatusColor = (status: string): string => {
    if (status === 'good') return '#10b981';
    if (status === 'warning') return '#f59e0b';
    if (status === 'critical') return '#ef4444';
    return '#94a3b8';
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
        textAlign: 'center',
    },
    trackerCard: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    trackerHeader: {
        marginBottom: 16,
    },
    trackerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    trackerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
    },
    trackerDate: {
        fontSize: 13,
        color: '#94a3b8',
    },
    adherenceContainer: {
        marginBottom: 20,
    },
    adherenceLabel: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 8,
    },
    adherenceBar: {
        height: 8,
        backgroundColor: '#e2e8f0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    adherenceProgress: {
        height: '100%',
    },
    adherenceScore: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'right',
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 10,
    },
    goalItem: {
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    goalDescription: {
        fontSize: 14,
        color: '#1e293b',
        flex: 1,
    },
    achievedBadge: {
        fontSize: 11,
        color: '#10b981',
        fontWeight: '600',
    },
    goalProgress: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    goalBar: {
        flex: 1,
        height: 6,
        backgroundColor: '#e2e8f0',
        borderRadius: 3,
        overflow: 'hidden',
        marginRight: 8,
    },
    goalBarFill: {
        height: '100%',
    },
    goalValue: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    metricCard: {
        width: '48%',
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 8,
        margin: '1%',
    },
    metricName: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 6,
    },
    metricStatus: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 4,
    },
    metricStatusText: {
        fontSize: 9,
        color: '#ffffff',
        fontWeight: '600',
    },
    metricDate: {
        fontSize: 10,
        color: '#94a3b8',
    },
    lastUpdated: {
        fontSize: 11,
        color: '#94a3b8',
        textAlign: 'right',
        marginTop: 8,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#0ea5e9',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    fabIcon: {
        fontSize: 28,
        color: '#ffffff',
        fontWeight: '300',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        width: '85%',
        padding: 24,
        borderRadius: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 16,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    modalButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        marginLeft: 8,
    },
    cancelButton: {
        backgroundColor: '#f1f5f9',
    },
    cancelButtonText: {
        color: '#475569',
        fontWeight: '600',
    },
    addButton: {
        backgroundColor: '#0ea5e9',
    },
    addButtonText: {
        color: '#ffffff',
        fontWeight: '600',
    },
});
