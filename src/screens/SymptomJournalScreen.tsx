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
    SymptomEntry,
    SymptomPattern,
    COMPLIANCE_DISCLAIMER,
} from '../services/insightsService';

/**
 * Symptom Journal Screen
 * 
 * Track and analyze symptoms:
 * - Log symptoms with severity
 * - Record triggers and relief methods
 * - Identify patterns over time
 * - Track duration and body parts
 * 
 * ⚠️ For tracking only, not for diagnosis. Always consult healthcare provider.
 */

export const SymptomJournalScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
    const [patterns, setPatterns] = useState<SymptomPattern[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [viewMode, setViewMode] = useState<'entries' | 'patterns'>('entries');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [symptomsData, patternsData] = await Promise.all([
                insightsService.getSymptoms(),
                insightsService.getSymptomPatterns(),
            ]);
            setSymptoms(symptomsData);
            setPatterns(patternsData);
        } catch (error) {
            console.error('Failed to load symptom data:', error);
            Alert.alert('Error', 'Failed to load symptom data.');
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (severity: number): string => {
        if (severity <= 3) return '#10b981';
        if (severity <= 6) return '#f59e0b';
        return '#ef4444';
    };

    const getSeverityLabel = (severity: number): string => {
        if (severity <= 3) return 'Mild';
        if (severity <= 6) return 'Moderate';
        if (severity <= 8) return 'Severe';
        return 'Critical';
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0ea5e9" />
                <Text style={styles.loadingText}>Loading symptom journal...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Disclaimer */}
                <View style={styles.disclaimerContainer}>
                    <Text style={styles.disclaimerIcon}>⚠️</Text>
                    <Text style={styles.disclaimerText}>
                        This journal is for tracking purposes only. If you experience severe or persistent symptoms,
                        seek immediate medical attention. {COMPLIANCE_DISCLAIMER.text}
                    </Text>
                </View>

                {/* View Mode Toggle */}
                <View style={styles.viewModeToggle}>
                    <TouchableOpacity
                        style={[styles.toggleButton, viewMode === 'entries' && styles.toggleButtonActive]}
                        onPress={() => setViewMode('entries')}
                    >
                        <Text
                            style={[
                                styles.toggleButtonText,
                                viewMode === 'entries' && styles.toggleButtonTextActive,
                            ]}
                        >
                            📝 Entries
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleButton, viewMode === 'patterns' && styles.toggleButtonActive]}
                        onPress={() => setViewMode('patterns')}
                    >
                        <Text
                            style={[
                                styles.toggleButtonText,
                                viewMode === 'patterns' && styles.toggleButtonTextActive,
                            ]}
                        >
                            📊 Patterns
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Entries View */}
                {viewMode === 'entries' && (
                    <>
                        {symptoms.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyIcon}>📝</Text>
                                <Text style={styles.emptyText}>No symptoms logged yet</Text>
                                <Text style={styles.emptySubtext}>
                                    Track your symptoms to identify patterns
                                </Text>
                            </View>
                        ) : (
                            symptoms.map(symptom => (
                                <View key={symptom.id} style={styles.symptomCard}>
                                    <View style={styles.symptomHeader}>
                                        <View>
                                            <Text style={styles.symptomName}>{symptom.symptom}</Text>
                                            <Text style={styles.symptomDate}>
                                                {new Date(symptom.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </Text>
                                        </View>
                                        <View style={styles.severityBadge}>
                                            <View
                                                style={[
                                                    styles.severityDot,
                                                    { backgroundColor: getSeverityColor(symptom.severity) },
                                                ]}
                                            />
                                            <Text style={styles.severityText}>{getSeverityLabel(symptom.severity)}</Text>
                                            <Text style={styles.severityNumber}>{symptom.severity}/10</Text>
                                        </View>
                                    </View>

                                    {symptom.bodyPart && (
                                        <View style={styles.symptomDetail}>
                                            <Text style={styles.detailLabel}>Body Part:</Text>
                                            <Text style={styles.detailValue}>{symptom.bodyPart}</Text>
                                        </View>
                                    )}

                                    {symptom.duration && (
                                        <View style={styles.symptomDetail}>
                                            <Text style={styles.detailLabel}>Duration:</Text>
                                            <Text style={styles.detailValue}>
                                                {symptom.duration} {symptom.durationUnit}
                                            </Text>
                                        </View>
                                    )}

                                    {symptom.triggers && symptom.triggers.length > 0 && (
                                        <View style={styles.tagsSection}>
                                            <Text style={styles.tagsLabel}>Triggers:</Text>
                                            <View style={styles.tags}>
                                                {symptom.triggers.map((trigger, idx) => (
                                                    <View key={idx} style={[styles.tag, styles.triggerTag]}>
                                                        <Text style={styles.tagText}>{trigger}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )}

                                    {symptom.relief && symptom.relief.length > 0 && (
                                        <View style={styles.tagsSection}>
                                            <Text style={styles.tagsLabel}>Relief:</Text>
                                            <View style={styles.tags}>
                                                {symptom.relief.map((relief, idx) => (
                                                    <View key={idx} style={[styles.tag, styles.reliefTag]}>
                                                        <Text style={styles.tagText}>{relief}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )}

                                    {symptom.notes && (
                                        <View style={styles.notesSection}>
                                            <Text style={styles.notesLabel}>Notes:</Text>
                                            <Text style={styles.notesText}>{symptom.notes}</Text>
                                        </View>
                                    )}
                                </View>
                            ))
                        )}
                    </>
                )}

                {/* Patterns View */}
                {viewMode === 'patterns' && (
                    <>
                        {patterns.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyIcon}>📊</Text>
                                <Text style={styles.emptyText}>No patterns detected yet</Text>
                                <Text style={styles.emptySubtext}>
                                    Log more symptoms to identify patterns
                                </Text>
                            </View>
                        ) : (
                            patterns.map((pattern, idx) => (
                                <View key={idx} style={styles.patternCard}>
                                    <View style={styles.patternHeader}>
                                        <Text style={styles.patternSymptom}>{pattern.symptom}</Text>
                                        <View style={styles.frequencyBadge}>
                                            <Text style={styles.frequencyText}>{pattern.frequency}x</Text>
                                        </View>
                                    </View>

                                    <View style={styles.patternStats}>
                                        <View style={styles.patternStat}>
                                            <Text style={styles.statLabel}>Avg Severity</Text>
                                            <View style={styles.statValueContainer}>
                                                <View
                                                    style={[
                                                        styles.severityIndicator,
                                                        { backgroundColor: getSeverityColor(pattern.averageSeverity) },
                                                    ]}
                                                />
                                                <Text style={styles.statValue}>{pattern.averageSeverity.toFixed(1)}/10</Text>
                                            </View>
                                        </View>

                                        {pattern.trend && (
                                            <View style={styles.patternStat}>
                                                <Text style={styles.statLabel}>Trend</Text>
                                                <Text style={styles.trendText}>
                                                    {pattern.trend === 'improving' ? '📉 Improving' :
                                                        pattern.trend === 'worsening' ? '📈 Worsening' :
                                                            '➡️ Stable'}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    {pattern.commonTriggers && pattern.commonTriggers.length > 0 && (
                                        <View style={styles.triggersSection}>
                                            <Text style={styles.triggersTitle}>Common Triggers:</Text>
                                            <View style={styles.tags}>
                                                {pattern.commonTriggers.map((trigger, idx) => (
                                                    <View key={idx} style={[styles.tag, styles.commonTriggerTag]}>
                                                        <Text style={styles.tagText}>{trigger}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )}

                                    {pattern.insight && (
                                        <View style={styles.insightBox}>
                                            <Text style={styles.insightIcon}>💡</Text>
                                            <Text style={styles.insightText}>{pattern.insight}</Text>
                                        </View>
                                    )}
                                </View>
                            ))
                        )}
                    </>
                )}
            </ScrollView>

            {/* Add Symptom Button */}
            <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

            {/* Add Symptom Modal - Placeholder */}
            <Modal visible={showAddModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Log New Symptom</Text>
                        <Text style={styles.modalSubtext}>
                            Detailed symptom entry form coming soon. You'll be able to log symptoms with
                            severity, triggers, and more.
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowAddModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
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
        backgroundColor: '#fee2e2',
        padding: 12,
        margin: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
    },
    disclaimerIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    disclaimerText: {
        flex: 1,
        fontSize: 12,
        color: '#991b1b',
        lineHeight: 18,
    },
    viewModeToggle: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 4,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 6,
    },
    toggleButtonActive: {
        backgroundColor: '#0ea5e9',
    },
    toggleButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    toggleButtonTextActive: {
        color: '#ffffff',
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
    symptomCard: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    symptomHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    symptomName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    symptomDate: {
        fontSize: 12,
        color: '#94a3b8',
    },
    severityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    severityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    severityText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
        marginRight: 6,
    },
    severityNumber: {
        fontSize: 11,
        color: '#94a3b8',
    },
    symptomDetail: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    detailLabel: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '600',
        width: 80,
    },
    detailValue: {
        flex: 1,
        fontSize: 13,
        color: '#1e293b',
    },
    tagsSection: {
        marginTop: 8,
    },
    tagsLabel: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 6,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 6,
    },
    triggerTag: {
        backgroundColor: '#fee2e2',
    },
    reliefTag: {
        backgroundColor: '#d1fae5',
    },
    tagText: {
        fontSize: 11,
        color: '#1e293b',
    },
    notesSection: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    notesLabel: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 4,
    },
    notesText: {
        fontSize: 13,
        color: '#475569',
        lineHeight: 18,
    },
    patternCard: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    patternHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    patternSymptom: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    frequencyBadge: {
        backgroundColor: '#0ea5e9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    frequencyText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffff',
    },
    patternStats: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    patternStat: {
        flex: 1,
    },
    statLabel: {
        fontSize: 11,
        color: '#64748b',
        marginBottom: 4,
    },
    statValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    severityIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
    },
    trendText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
    },
    triggersSection: {
        marginBottom: 12,
    },
    triggersTitle: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 6,
    },
    commonTriggerTag: {
        backgroundColor: '#fef3c7',
    },
    insightBox: {
        flexDirection: 'row',
        backgroundColor: '#eff6ff',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#0ea5e9',
    },
    insightIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    insightText: {
        flex: 1,
        fontSize: 13,
        color: '#1e40af',
        lineHeight: 18,
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
        marginBottom: 12,
    },
    modalSubtext: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 20,
        lineHeight: 20,
    },
    closeButton: {
        backgroundColor: '#0ea5e9',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
});
