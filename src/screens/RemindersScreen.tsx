import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { appointmentsService, Reminder, FollowUpReminder } from '../services/appointmentsService';

type Props = NativeStackScreenProps<RootStackParamList, 'Reminders'>;

const RemindersScreen: React.FC<Props> = ({ navigation }) => {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [followUpReminders, setFollowUpReminders] = useState<FollowUpReminder[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'followups'>('all');

    useEffect(() => {
        loadReminders();
    }, []);

    const loadReminders = async () => {
        setLoading(true);
        try {
            const [remindersList, followUpsList] = await Promise.all([
                appointmentsService.getReminders(),
                appointmentsService.getFollowUpReminders(),
            ]);
            setReminders(remindersList);
            setFollowUpReminders(followUpsList);
        } catch (error) {
            Alert.alert('Error', 'Failed to load reminders');
        } finally {
            setLoading(false);
        }
    };

    const handleSnooze = async (reminderId: string, duration: number) => {
        try {
            await appointmentsService.snoozeReminder(reminderId, duration);
            Alert.alert('Snoozed', `Reminder snoozed for ${duration} minutes`);
            loadReminders();
        } catch (error) {
            Alert.alert('Error', 'Failed to snooze reminder');
        }
    };

    const showSnoozeOptions = (reminderId: string) => {
        Alert.alert(
            'Snooze Reminder',
            'How long would you like to snooze?',
            [
                { text: '15 minutes', onPress: () => handleSnooze(reminderId, 15) },
                { text: '30 minutes', onPress: () => handleSnooze(reminderId, 30) },
                { text: '1 hour', onPress: () => handleSnooze(reminderId, 60) },
                { text: '2 hours', onPress: () => handleSnooze(reminderId, 120) },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const getReminderTypeIcon = (type: string) => {
        switch (type) {
            case 'appointment': return '📅';
            case 'medication': return '💊';
            case 'lab-test': return '🔬';
            case 'follow-up': return '🔄';
            default: return '🔔';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return '#FF3B30';
            case 'medium': return '#FF9500';
            case 'low': return '#34C759';
            default: return '#8E8E93';
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 0) return 'Overdue';
        if (diffMins < 60) return `in ${diffMins} minutes`;
        if (diffMins < 1440) return `in ${Math.floor(diffMins / 60)} hours`;
        return `in ${Math.floor(diffMins / 1440)} days`;
    };

    const renderReminder = (reminder: Reminder) => (
        <View key={reminder.id} style={styles.reminderCard}>
            <View style={styles.reminderHeader}>
                <Text style={styles.reminderIcon}>{getReminderTypeIcon(reminder.type)}</Text>
                <View style={styles.reminderInfo}>
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                    <Text style={styles.reminderMessage}>{reminder.description}</Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(reminder.priority) }]}>
                    <Text style={styles.priorityText}>{reminder.priority.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.reminderDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>⏰ Time</Text>
                    <Text style={styles.detailValue}>{formatTime(reminder.scheduledFor)}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>📅 Date</Text>
                    <Text style={styles.detailValue}>{new Date(reminder.scheduledFor).toLocaleDateString()}</Text>
                </View>
            </View>

            <View style={styles.reminderActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.snoozeButton]}
                    onPress={() => showSnoozeOptions(reminder.id)}
                >
                    <Text style={styles.actionButtonText}>💤 Snooze</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.doneButton]}
                    onPress={() => {
                        Alert.alert('Completed', 'Reminder marked as completed');
                        loadReminders();
                    }}
                >
                    <Text style={styles.actionButtonText}>✓ Done</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderFollowUpReminder = (reminder: FollowUpReminder) => (
        <View key={reminder.id} style={styles.followUpCard}>
            <View style={styles.followUpHeader}>
                <Text style={styles.followUpIcon}>🔄</Text>
                <View style={styles.followUpInfo}>
                    <Text style={styles.followUpDoctor}>Follow-up with {reminder.doctorName}</Text>
                    <Text style={styles.followUpReason}>{reminder.reason}</Text>
                </View>
            </View>

            <View style={styles.followUpDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>📅 Next Visit Due</Text>
                    <Text style={styles.detailValue}>{new Date(reminder.nextVisitDue).toLocaleDateString()}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Last Visit</Text>
                    <Text style={styles.detailValue}>{new Date(reminder.lastVisitDate).toLocaleDateString()}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.bookButton}
                onPress={() => navigation.navigate('BookAppointment', { type: 'doctor' })}
            >
                <Text style={styles.bookButtonText}>📅 Book Appointment</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading reminders...</Text>
            </View>
        );
    }

    const allRemindersEmpty = reminders.length === 0 && followUpReminders.length === 0;

    if (allRemindersEmpty) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Reminders</Text>
                </View>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyEmoji}>🔔</Text>
                    <Text style={styles.emptyTitle}>No Reminders</Text>
                    <Text style={styles.emptyText}>
                        You're all caught up! Reminders for appointments, medications, and follow-ups will appear here.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reminders</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'all' && styles.tabActive]}
                    onPress={() => setActiveTab('all')}
                >
                    <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
                        All Reminders ({reminders.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'followups' && styles.tabActive]}
                    onPress={() => setActiveTab('followups')}
                >
                    <Text style={[styles.tabText, activeTab === 'followups' && styles.tabTextActive]}>
                        Follow-ups ({followUpReminders.length})
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {activeTab === 'all' && (
                    <>
                        {reminders.length === 0 ? (
                            <View style={styles.emptySection}>
                                <Text style={styles.emptySectionText}>No active reminders</Text>
                            </View>
                        ) : (
                            reminders.map(renderReminder)
                        )}
                    </>
                )}

                {activeTab === 'followups' && (
                    <>
                        {followUpReminders.length === 0 ? (
                            <View style={styles.emptySection}>
                                <Text style={styles.emptySectionText}>No follow-up appointments</Text>
                            </View>
                        ) : (
                            followUpReminders.map(renderFollowUpReminder)
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backArrow: {
        fontSize: 24,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    emptyText: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: '#007AFF',
    },
    tabText: {
        fontSize: 15,
        color: '#666',
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#007AFF',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    emptySection: {
        padding: 32,
        alignItems: 'center',
    },
    emptySectionText: {
        fontSize: 16,
        color: '#999',
    },
    reminderCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    reminderHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    reminderIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    reminderInfo: {
        flex: 1,
    },
    reminderTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    reminderMessage: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    priorityText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '700',
    },
    reminderDetails: {
        marginBottom: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    reminderActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    snoozeButton: {
        backgroundColor: '#FF9500',
    },
    doneButton: {
        backgroundColor: '#34C759',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    followUpCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    followUpHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    followUpIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    followUpInfo: {
        flex: 1,
    },
    followUpDoctor: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    followUpReason: {
        fontSize: 14,
        color: '#007AFF',
        lineHeight: 20,
    },
    followUpDetails: {
        marginBottom: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    notesContainer: {
        marginTop: 8,
        padding: 12,
        backgroundColor: '#f0f8ff',
        borderRadius: 8,
    },
    notesLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    notesText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    bookButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
});

export default RemindersScreen;
