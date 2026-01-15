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
    LifestyleEntry,
    LifestyleSummary,
    COMPLIANCE_DISCLAIMER,
} from '../services/insightsService';

/**
 * Lifestyle Tracking Screen
 * 
 * Track daily lifestyle activities:
 * - Diet and nutrition
 * - Exercise and physical activity
 * - Sleep duration and quality
 * - Water intake
 * - Stress levels
 * - Healthy habits
 * 
 * ⚠️ For personal tracking only, not medical advice
 */

export const LifestyleTrackingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [entries, setEntries] = useState<LifestyleEntry[]>([]);
    const [summary, setSummary] = useState<LifestyleSummary | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<LifestyleEntry['category']>('exercise');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        loadData();
    }, [selectedDate]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [entriesData, summaryData] = await Promise.all([
                insightsService.getLifestyleEntries(selectedDate, selectedDate),
                insightsService.getLifestyleSummary(selectedDate),
            ]);
            setEntries(entriesData);
            setSummary(summaryData);
        } catch (error) {
            console.error('Failed to load lifestyle data:', error);
            Alert.alert('Error', 'Failed to load lifestyle data.');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryIcon = (category: LifestyleEntry['category']): string => {
        const icons: Record<string, string> = {
            exercise: '🏃',
            diet: '🍎',
            sleep: '😴',
            water: '💧',
            stress: '🧘',
            habit: '✅',
        };
        return icons[category] || '📝';
    };

    const getCategoryColor = (category: LifestyleEntry['category']): string => {
        const colors: Record<string, string> = {
            exercise: '#10b981',
            diet: '#f59e0b',
            sleep: '#8b5cf6',
            water: '#0ea5e9',
            stress: '#ec4899',
            habit: '#6366f1',
        };
        return colors[category] || '#94a3b8';
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0ea5e9" />
                <Text style={styles.loadingText}>Loading lifestyle data...</Text>
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

                {/* Date Selector */}
                <View style={styles.dateSelector}>
                    <TouchableOpacity
                        onPress={() => {
                            const prev = new Date(selectedDate);
                            prev.setDate(prev.getDate() - 1);
                            setSelectedDate(prev.toISOString().split('T')[0]);
                        }}
                    >
                        <Text style={styles.dateArrow}>◀</Text>
                    </TouchableOpacity>
                    <Text style={styles.selectedDate}>
                        {new Date(selectedDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            const next = new Date(selectedDate);
                            next.setDate(next.getDate() + 1);
                            if (next <= new Date()) {
                                setSelectedDate(next.toISOString().split('T')[0]);
                            }
                        }}
                    >
                        <Text style={styles.dateArrow}>▶</Text>
                    </TouchableOpacity>
                </View>

                {/* Daily Summary */}
                {summary && (
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>Daily Summary</Text>
                        <View style={styles.summaryGrid}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryIcon}>🍽️</Text>
                                <Text style={styles.summaryValue}>{summary.totalCaloriesConsumed}</Text>
                                <Text style={styles.summaryLabel}>Calories In</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryIcon}>🔥</Text>
                                <Text style={styles.summaryValue}>{summary.totalCaloriesBurned}</Text>
                                <Text style={styles.summaryLabel}>Burned</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryIcon}>💧</Text>
                                <Text style={styles.summaryValue}>{summary.waterIntake} ml</Text>
                                <Text style={styles.summaryLabel}>Water</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryIcon}>😴</Text>
                                <Text style={styles.summaryValue}>{summary.sleepDuration}h</Text>
                                <Text style={styles.summaryLabel}>Sleep</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryIcon}>🏃</Text>
                                <Text style={styles.summaryValue}>{summary.exerciseDuration} min</Text>
                                <Text style={styles.summaryLabel}>Exercise</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryIcon}>✅</Text>
                                <Text style={styles.summaryValue}>
                                    {summary.habitsCompleted}/{summary.habitsTotal}
                                </Text>
                                <Text style={styles.summaryLabel}>Habits</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Category Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
                    {(['exercise', 'diet', 'sleep', 'water', 'stress', 'habit'] as const).map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.categoryTab,
                                selectedCategory === cat && styles.categoryTabActive,
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={styles.categoryIcon}>{getCategoryIcon(cat)}</Text>
                            <Text
                                style={[
                                    styles.categoryTabText,
                                    selectedCategory === cat && styles.categoryTabTextActive,
                                ]}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Entries List */}
                {entries.filter(e => e.category === selectedCategory).length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>{getCategoryIcon(selectedCategory)}</Text>
                        <Text style={styles.emptyText}>No {selectedCategory} entries yet</Text>
                        <Text style={styles.emptySubtext}>Track your {selectedCategory} activities</Text>
                    </View>
                ) : (
                    entries
                        .filter(e => e.category === selectedCategory)
                        .map(entry => (
                            <View
                                key={entry.id}
                                style={[styles.entryCard, { borderLeftColor: getCategoryColor(entry.category) }]}
                            >
                                <View style={styles.entryHeader}>
                                    <Text style={styles.entryIcon}>{getCategoryIcon(entry.category)}</Text>
                                    <View style={styles.entryInfo}>
                                        {entry.category === 'exercise' && 'type' in entry.data && (
                                            <>
                                                <Text style={styles.entryTitle}>{entry.data.type}</Text>
                                                <Text style={styles.entryDetail}>
                                                    {entry.data.duration} min • {entry.data.intensity} intensity
                                                </Text>
                                                {'caloriesBurned' in entry.data && entry.data.caloriesBurned && (
                                                    <Text style={styles.entryDetail}>🔥 {entry.data.caloriesBurned} calories</Text>
                                                )}
                                            </>
                                        )}
                                        {entry.category === 'sleep' && 'duration' in entry.data && 'quality' in entry.data && (
                                            <>
                                                <Text style={styles.entryTitle}>Sleep</Text>
                                                <Text style={styles.entryDetail}>
                                                    {entry.data.duration} hours • {entry.data.quality} quality
                                                </Text>
                                                {'bedTime' in entry.data && entry.data.bedTime && (
                                                    <Text style={styles.entryDetail}>
                                                        {entry.data.bedTime} - {entry.data.wakeTime}
                                                    </Text>
                                                )}
                                            </>
                                        )}
                                        {entry.category === 'diet' && 'mealType' in entry.data && (
                                            <>
                                                <Text style={styles.entryTitle}>{entry.data.mealType || 'Meal'}</Text>
                                                {'calories' in entry.data && entry.data.calories && (
                                                    <Text style={styles.entryDetail}>{entry.data.calories} calories</Text>
                                                )}
                                            </>
                                        )}
                                        {entry.category === 'water' && 'totalML' in entry.data && (
                                            <>
                                                <Text style={styles.entryTitle}>Water Intake</Text>
                                                <Text style={styles.entryDetail}>{entry.data.totalML} ml</Text>
                                            </>
                                        )}
                                        {entry.category === 'stress' && 'level' in entry.data && (
                                            <>
                                                <Text style={styles.entryTitle}>Stress Level</Text>
                                                <Text style={styles.entryDetail}>Level: {entry.data.level}/10</Text>
                                            </>
                                        )}
                                        {entry.category === 'habit' && 'habitName' in entry.data && (
                                            <>
                                                <Text style={styles.entryTitle}>{entry.data.habitName}</Text>
                                                <Text style={styles.entryDetail}>
                                                    {entry.data.completed ? '✅ Completed' : '⏳ Pending'}
                                                </Text>
                                            </>
                                        )}
                                    </View>
                                </View>
                            </View>
                        ))
                )}
            </ScrollView>

            {/* Add Entry Button */}
            <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

            {/* Add Entry Modal - Placeholder */}
            <Modal visible={showAddModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add {selectedCategory} Entry</Text>
                        <Text style={styles.modalSubtext}>
                            Feature coming soon. Detailed entry forms for each category will be available here.
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
    dateSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 8,
    },
    dateArrow: {
        fontSize: 20,
        color: '#0ea5e9',
        paddingHorizontal: 20,
    },
    selectedDate: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        minWidth: 150,
        textAlign: 'center',
    },
    summaryCard: {
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
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 16,
    },
    summaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    summaryItem: {
        width: '33.33%',
        alignItems: 'center',
        marginBottom: 16,
    },
    summaryIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 2,
    },
    summaryLabel: {
        fontSize: 11,
        color: '#64748b',
    },
    categoryTabs: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    categoryTab: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    categoryTabActive: {
        backgroundColor: '#0ea5e9',
        borderColor: '#0ea5e9',
    },
    categoryIcon: {
        fontSize: 18,
        marginRight: 6,
    },
    categoryTabText: {
        fontSize: 13,
        color: '#475569',
        fontWeight: '500',
    },
    categoryTabTextActive: {
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
    entryCard: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    entryHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    entryIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    entryInfo: {
        flex: 1,
    },
    entryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    entryDetail: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 2,
    },
    entryNotes: {
        fontSize: 12,
        color: '#94a3b8',
        fontStyle: 'italic',
        marginTop: 4,
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
