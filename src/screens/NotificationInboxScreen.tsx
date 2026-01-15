// Notification Inbox Screen - Category 14
// View and manage all notifications

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { notificationsService } from '../services/notificationsService';
import { Notification, NotificationBadge, NotificationStatistics } from '../../backend/types/notifications';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationInbox'>;

export default function NotificationInboxScreen({ navigation }: Props) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [badge, setBadge] = useState<NotificationBadge | null>(null);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, [filter]);

    const loadData = async () => {
        try {
            const [notifs, badgeData] = await Promise.all([
                notificationsService.getNotifications(filter === 'all' ? undefined : filter),
                notificationsService.getNotificationBadge(),
            ]);
            setNotifications(notifs);
            setBadge(badgeData);
        } catch (error) {
            Alert.alert('Error', 'Failed to load notifications');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const handleNotificationPress = async (notif: Notification) => {
        // Mark as read
        if (notif.status === 'unread') {
            try {
                await notificationsService.markAsRead(notif.id);
                setNotifications(prev =>
                    prev.map(n => n.id === notif.id ? { ...n, status: 'read' as const } : n)
                );
            } catch (error) {
                console.error('Failed to mark as read:', error);
            }
        }

        // Handle action buttons or navigation
        if (notif.actionButtons && notif.actionButtons.length > 0) {
            const actions = notif.actionButtons.map(btn => ({
                text: btn.label,
                onPress: () => handleAction(btn.action),
            }));

            Alert.alert(notif.title, notif.message, [
                ...actions,
                { text: 'Dismiss', style: 'cancel' },
            ]);
        } else {
            Alert.alert(notif.title, notif.message);
        }
    };

    const handleAction = (action: string) => {
        // Parse action (e.g., "navigate://Appointments")
        if (action.startsWith('navigate://')) {
            const screen = action.replace('navigate://', '');
            navigation.navigate(screen as any);
        }
    };

    const handleArchive = async (notifId: string) => {
        try {
            await notificationsService.archiveNotification(notifId);
            setNotifications(prev => prev.filter(n => n.id !== notifId));
            Alert.alert('Success', 'Notification archived');
        } catch (error) {
            Alert.alert('Error', 'Failed to archive notification');
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return '#f44336';
            case 'high': return '#ff9800';
            case 'medium': return '#2196f3';
            case 'low': return '#999';
            default: return '#666';
        }
    };

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            health_record: '📋',
            appointment: '📅',
            medication: '💊',
            consent_request: '🔐',
            emergency: '🚨',
            insurance: '🛡️',
            system: '⚙️',
            marketing: '📢',
        };
        return icons[category] || '🔔';
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Notifications</Text>
                    {badge && (
                        <Text style={styles.subtitle}>
                            {badge.unread} unread • {badge.urgent} urgent
                        </Text>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => navigation.navigate('NotificationSettings')}
                >
                    <Text style={styles.settingsIcon}>⚙️</Text>
                </TouchableOpacity>
            </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['all', 'unread', 'read'].map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[
                                styles.filterChip,
                                filter === f && styles.filterChipActive,
                            ]}
                            onPress={() => setFilter(f as any)}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    filter === f && styles.filterChipTextActive,
                                ]}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                {f === 'unread' && badge && ` (${badge.unread})`}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Notifications List */}
            <ScrollView
                style={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                {loading ? (
                    <View style={styles.centered}>
                        <Text style={styles.loadingText}>Loading notifications...</Text>
                    </View>
                ) : notifications.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🔔</Text>
                        <Text style={styles.emptyTitle}>No Notifications</Text>
                        <Text style={styles.emptyText}>
                            {filter === 'unread'
                                ? "You're all caught up!"
                                : 'Notifications will appear here'}
                        </Text>
                    </View>
                ) : (
                    notifications.map((notif) => (
                        <TouchableOpacity
                            key={notif.id}
                            style={[
                                styles.notificationCard,
                                notif.status === 'unread' && styles.notificationCardUnread,
                            ]}
                            onPress={() => handleNotificationPress(notif)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.notificationHeader}>
                                <View style={styles.notificationLeft}>
                                    <Text style={styles.categoryIcon}>
                                        {getCategoryIcon(notif.category)}
                                    </Text>
                                    <View style={styles.notificationMeta}>
                                        <View style={styles.metaRow}>
                                            <View
                                                style={[
                                                    styles.priorityDot,
                                                    { backgroundColor: getPriorityColor(notif.priority) },
                                                ]}
                                            />
                                            <Text style={styles.timeText}>
                                                {getTimeAgo(notif.sentAt)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={styles.archiveButton}
                                    onPress={() => handleArchive(notif.id)}
                                >
                                    <Text style={styles.archiveIcon}>🗑️</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.notificationTitle}>{notif.title}</Text>
                            <Text style={styles.notificationMessage} numberOfLines={2}>
                                {notif.message}
                            </Text>

                            {notif.actionButtons && notif.actionButtons.length > 0 && (
                                <View style={styles.actionButtons}>
                                    {notif.actionButtons.slice(0, 2).map((btn) => (
                                        <TouchableOpacity
                                            key={btn.id}
                                            style={[
                                                styles.actionButton,
                                                btn.type === 'primary' && styles.actionButtonPrimary,
                                            ]}
                                            onPress={() => handleAction(btn.action)}
                                        >
                                            <Text
                                                style={[
                                                    styles.actionButtonText,
                                                    btn.type === 'primary' && styles.actionButtonTextPrimary,
                                                ]}
                                            >
                                                {btn.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {notif.status === 'unread' && (
                                <View style={styles.unreadIndicator} />
                            )}
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    settingsButton: {
        padding: 8,
    },
    settingsIcon: {
        fontSize: 24,
    },
    filtersContainer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    filterChipActive: {
        backgroundColor: '#2196f3',
        borderColor: '#2196f3',
    },
    filterChipText: {
        fontSize: 14,
        color: '#333',
    },
    filterChipTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    listContainer: {
        flex: 1,
    },
    centered: {
        padding: 40,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    notificationCard: {
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 12,
        marginTop: 12,
        borderRadius: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        position: 'relative',
    },
    notificationCardUnread: {
        borderLeftWidth: 4,
        borderLeftColor: '#2196f3',
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    notificationLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryIcon: {
        fontSize: 24,
        marginRight: 8,
    },
    notificationMeta: {
        flex: 1,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    timeText: {
        fontSize: 12,
        color: '#999',
    },
    archiveButton: {
        padding: 4,
    },
    archiveIcon: {
        fontSize: 18,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2196f3',
        alignItems: 'center',
    },
    actionButtonPrimary: {
        backgroundColor: '#2196f3',
    },
    actionButtonText: {
        fontSize: 14,
        color: '#2196f3',
        fontWeight: '500',
    },
    actionButtonTextPrimary: {
        color: '#fff',
    },
    unreadIndicator: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#2196f3',
    },
});
