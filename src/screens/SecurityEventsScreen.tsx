import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { securityService } from '../services/securityService';
import type { SecurityEvent } from '../services/securityService';

const SecurityEventsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<SecurityEvent[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await securityService.getSecurityEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading security events:', error);
      Alert.alert('Error', 'Failed to load security events');
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (event: SecurityEvent) => {
    try {
      await securityService.acknowledgeSecurityEvent(event.id);
      await loadEvents();
    } catch (error) {
      Alert.alert('Error', 'Failed to acknowledge event');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'login':
        return '✅';
      case 'logout':
        return '👋';
      case 'failed-login':
        return '⚠️';
      case 'new-device':
        return '📱';
      case 'password-change':
        return '🔑';
      case 'suspicious-activity':
        return '🚨';
      default:
        return '📋';
    }
  };

  const getEventColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#dc2626';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getEventTitle = (eventType: string) => {
    switch (eventType) {
      case 'login':
        return 'Successful Login';
      case 'logout':
        return 'Logout';
      case 'failed-login':
        return 'Failed Login Attempt';
      case 'new-device':
        return 'New Device Added';
      case 'password-change':
        return 'Password Changed';
      case 'suspicious-activity':
        return 'Suspicious Activity Detected';
      default:
        return 'Security Event';
    }
  };

  const unacknowledgedEvents = events.filter(e => !e.acknowledged);
  const acknowledgedEvents = events.filter(e => e.acknowledged);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading security events...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Unacknowledged Events */}
      {unacknowledgedEvents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Needs Attention ({unacknowledgedEvents.length})
          </Text>
          {unacknowledgedEvents.map((event) => (
            <View
              key={event.id}
              style={[
                styles.eventCard,
                { borderLeftColor: getEventColor(event.severity) },
              ]}
            >
              <View style={styles.eventHeader}>
                <Text style={styles.eventIcon}>{getEventIcon(event.eventType)}</Text>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{getEventTitle(event.eventType)}</Text>
                  <Text style={styles.eventTimestamp}>{formatDate(event.timestamp)}</Text>
                </View>
              </View>

              <View style={styles.eventDetails}>
                <Text style={styles.eventDetail}>{event.details}</Text>
                {event.deviceName && (
                  <Text style={styles.eventMeta}>Device: {event.deviceName}</Text>
                )}
                {event.location && (
                  <Text style={styles.eventMeta}>Location: {event.location}</Text>
                )}
                {event.ipAddress && (
                  <Text style={styles.eventMeta}>IP: {event.ipAddress}</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.acknowledgeButton}
                onPress={() => handleAcknowledge(event)}
              >
                <Text style={styles.acknowledgeButtonText}>Mark as Reviewed</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Acknowledged Events */}
      {acknowledgedEvents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {acknowledgedEvents.map((event) => (
            <View
              key={event.id}
              style={[
                styles.eventCard,
                styles.acknowledgedCard,
                { borderLeftColor: getEventColor(event.severity) },
              ]}
            >
              <View style={styles.eventHeader}>
                <Text style={styles.eventIcon}>{getEventIcon(event.eventType)}</Text>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{getEventTitle(event.eventType)}</Text>
                  <Text style={styles.eventTimestamp}>{formatDate(event.timestamp)}</Text>
                </View>
              </View>

              <View style={styles.eventDetails}>
                <Text style={styles.eventDetail}>{event.details}</Text>
                {event.deviceName && (
                  <Text style={styles.eventMeta}>Device: {event.deviceName}</Text>
                )}
                {event.location && (
                  <Text style={styles.eventMeta}>Location: {event.location}</Text>
                )}
                {event.ipAddress && (
                  <Text style={styles.eventMeta}>IP: {event.ipAddress}</Text>
                )}
              </View>

              <View style={styles.reviewedBadge}>
                <Text style={styles.reviewedBadgeText}>✓ Reviewed</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {events.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔐</Text>
          <Text style={styles.emptyText}>No security events</Text>
          <Text style={styles.emptySubtext}>
            Your security activity will appear here
          </Text>
        </View>
      )}

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>About Security Events</Text>
        <Text style={styles.infoText}>
          Security events track important activities related to your account security.
          Review them regularly to ensure all activity is legitimate.
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.infoSeverity}>🔴 Critical:</Text> Requires immediate attention{'\n'}
          <Text style={styles.infoSeverity}>🟡 Warning:</Text> Potentially suspicious{'\n'}
          <Text style={styles.infoSeverity}>🔵 Info:</Text> Normal activity
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  eventCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  acknowledgedCard: {
    opacity: 0.7,
  },
  eventHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  eventIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  eventTimestamp: {
    fontSize: 13,
    color: '#6b7280',
  },
  eventDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  eventDetail: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  eventMeta: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  acknowledgeButton: {
    marginTop: 12,
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  acknowledgeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewedBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reviewedBadgeText: {
    color: '#065f46',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
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
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#eff6ff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1e3a8a',
    marginBottom: 8,
    lineHeight: 20,
  },
  infoSeverity: {
    fontWeight: '600',
  },
});

export default SecurityEventsScreen;
