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
import type { LoginSession } from '../services/securityService';

const SessionManagementScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<LoginSession[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const sessionsData = await securityService.getActiveSessions();
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading sessions:', error);
      Alert.alert('Error', 'Failed to load active sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateSession = (session: LoginSession) => {
    Alert.alert(
      'Terminate Session',
      `Are you sure you want to terminate the session on "${session.deviceName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Terminate',
          style: 'destructive',
          onPress: async () => {
            try {
              await securityService.terminateSession({ sessionId: session.id });
              await loadSessions();
              Alert.alert('Success', 'Session terminated successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to terminate session');
            }
          },
        },
      ]
    );
  };

  const handleTerminateAllOthers = () => {
    const otherSessionsCount = sessions.filter(s => !s.isActive).length;
    if (otherSessionsCount === 0) {
      Alert.alert('No Sessions', 'There are no other active sessions to terminate');
      return;
    }

    Alert.alert(
      'Terminate All Other Sessions',
      `This will terminate ${otherSessionsCount} other active session(s). You will remain logged in on this device.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Terminate All',
          style: 'destructive',
          onPress: async () => {
            try {
              await securityService.terminateAllOtherSessions();
              await loadSessions();
              Alert.alert('Success', 'All other sessions terminated successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to terminate other sessions');
            }
          },
        },
      ]
    );
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

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getTimeUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / 60000);
      return `${diffMins}m`;
    }
    if (diffHours < 24) return `${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'ios':
        return '📱';
      case 'android':
        return '🤖';
      case 'web':
        return '💻';
      default:
        return '🔧';
    }
  };

  const currentSession = sessions.find(s => s.isActive);
  const otherSessions = sessions.filter(s => !s.isActive);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading sessions...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Current Session */}
      {currentSession && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Session</Text>
          <View style={[styles.sessionCard, styles.currentSessionCard]}>
            <View style={styles.sessionHeader}>
              <Text style={styles.platformIcon}>{getPlatformIcon(currentSession.platform)}</Text>
              <View style={styles.sessionInfo}>
                <View style={styles.deviceNameRow}>
                  <Text style={styles.deviceName}>{currentSession.deviceName}</Text>
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>Active</Text>
                  </View>
                </View>
                <Text style={styles.sessionDetail}>{currentSession.platform}</Text>
                <Text style={styles.sessionDetail}>{currentSession.location}</Text>
                <Text style={styles.sessionDetail}>IP: {currentSession.ipAddress}</Text>
              </View>
            </View>

            <View style={styles.sessionFooter}>
              <View style={styles.sessionDates}>
                <Text style={styles.dateLabel}>Logged in:</Text>
                <Text style={styles.dateValue}>{formatDate(currentSession.loginTime)}</Text>
              </View>
              <View style={styles.sessionDates}>
                <Text style={styles.dateLabel}>Last activity:</Text>
                <Text style={styles.dateValue}>{getTimeAgo(currentSession.lastActivity)}</Text>
              </View>
              <View style={styles.sessionDates}>
                <Text style={styles.dateLabel}>Expires in:</Text>
                <Text style={styles.dateValue}>{getTimeUntilExpiry(currentSession.expiresAt)}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Other Sessions */}
      {otherSessions.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Other Sessions</Text>
            <TouchableOpacity
              style={styles.terminateAllButton}
              onPress={handleTerminateAllOthers}
            >
              <Text style={styles.terminateAllText}>Terminate All</Text>
            </TouchableOpacity>
          </View>

          {otherSessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <Text style={styles.platformIcon}>{getPlatformIcon(session.platform)}</Text>
                <View style={styles.sessionInfo}>
                  <Text style={styles.deviceName}>{session.deviceName}</Text>
                  <Text style={styles.sessionDetail}>{session.platform}</Text>
                  <Text style={styles.sessionDetail}>{session.location}</Text>
                  <Text style={styles.sessionDetail}>IP: {session.ipAddress}</Text>
                </View>
              </View>

              <View style={styles.sessionFooter}>
                <View style={styles.sessionDates}>
                  <Text style={styles.dateLabel}>Logged in:</Text>
                  <Text style={styles.dateValue}>{formatDate(session.loginTime)}</Text>
                </View>
                <View style={styles.sessionDates}>
                  <Text style={styles.dateLabel}>Last activity:</Text>
                  <Text style={styles.dateValue}>{getTimeAgo(session.lastActivity)}</Text>
                </View>
                <View style={styles.sessionDates}>
                  <Text style={styles.dateLabel}>Expires in:</Text>
                  <Text style={styles.dateValue}>{getTimeUntilExpiry(session.expiresAt)}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.terminateButton}
                onPress={() => handleTerminateSession(session)}
              >
                <Text style={styles.terminateButtonText}>Terminate Session</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {sessions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔐</Text>
          <Text style={styles.emptyText}>No active sessions</Text>
        </View>
      )}

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>About Sessions</Text>
        <Text style={styles.infoText}>
          A session is created each time you log in to Ayusetu. Sessions expire
          automatically after a period of inactivity to keep your account secure.
        </Text>
        <Text style={styles.infoText}>
          • Review active sessions regularly{'\n'}
          • Terminate unknown or suspicious sessions immediately{'\n'}
          • Each device can have only one active session{'\n'}
          • You'll be logged out if your session expires
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  terminateAllButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  terminateAllText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  sessionCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  currentSessionCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  platformIcon: {
    fontSize: 32,
  },
  sessionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  activeBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  sessionDetail: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  sessionFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8,
    marginTop: 8,
  },
  sessionDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  dateValue: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  terminateButton: {
    marginTop: 12,
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  terminateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
});

export default SessionManagementScreen;
