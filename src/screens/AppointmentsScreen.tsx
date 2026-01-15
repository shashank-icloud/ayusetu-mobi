import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { appointmentsService, Appointment } from '../services/appointmentsService';

/**
 * Appointments Screen
 * 
 * Shows all appointments (doctor, lab, hospital OPD)
 * Allows booking, viewing, and cancellation
 */

export const AppointmentsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsService.getMyAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      Alert.alert('Error', 'Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await appointmentsService.cancelAppointment(appointmentId, 'User requested cancellation');
              Alert.alert('Success', 'Appointment cancelled successfully');
              loadAppointments();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel appointment');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'scheduled':
      case 'confirmed':
        return '#10b981';
      case 'completed':
        return '#64748b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#94a3b8';
    }
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'doctor':
        return '👨‍⚕️';
      case 'lab':
        return '🧪';
      case 'hospital_opd':
        return '🏥';
      default:
        return '📅';
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    const apptDate = new Date(appt.scheduledDate);
    const today = new Date();

    if (filter === 'upcoming') {
      return apptDate >= today && appt.status !== 'cancelled' && appt.status !== 'completed';
    } else if (filter === 'past') {
      return apptDate < today || appt.status === 'completed' || appt.status === 'cancelled';
    }
    return true;
  });

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointments</Text>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('BookAppointment')}
        >
          <Text style={styles.bookButtonText}>+ Book</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'upcoming' && styles.filterTabActive]}
          onPress={() => setFilter('upcoming')}
        >
          <Text style={[styles.filterTabText, filter === 'upcoming' && styles.filterTabTextActive]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'past' && styles.filterTabActive]}
          onPress={() => setFilter('past')}
        >
          <Text style={[styles.filterTabText, filter === 'past' && styles.filterTabTextActive]}>
            Past
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
            All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No appointments found</Text>
            <Text style={styles.emptySubtext}>Book your first appointment to get started</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('BookAppointment')}
            >
              <Text style={styles.emptyButtonText}>Book Appointment</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredAppointments.map(appt => (
            <View key={appt.id} style={styles.appointmentCard}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={styles.typeIcon}>{getTypeIcon(appt.type)}</Text>
                  <View>
                    <Text style={styles.appointmentTitle}>
                      {appt.doctorName || appt.labName || appt.hospitalName}
                    </Text>
                    {appt.specialization && (
                      <Text style={styles.appointmentSubtitle}>{appt.specialization}</Text>
                    )}
                    {appt.testNames && appt.testNames.length > 0 && (
                      <Text style={styles.appointmentSubtitle}>{appt.testNames.join(', ')}</Text>
                    )}
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(appt.status) + '20' },
                  ]}
                >
                  <Text style={[styles.statusText, { color: getStatusColor(appt.status) }]}>
                    {appt.status}
                  </Text>
                </View>
              </View>

              {/* Date & Time */}
              <View style={styles.dateTimeRow}>
                <View style={styles.dateTimeItem}>
                  <Text style={styles.dateTimeIcon}>📅</Text>
                  <Text style={styles.dateTimeText}>
                    {new Date(appt.scheduledDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={styles.dateTimeItem}>
                  <Text style={styles.dateTimeIcon}>🕐</Text>
                  <Text style={styles.dateTimeText}>{appt.scheduledTime}</Text>
                </View>
                {appt.consultationType === 'teleconsultation' && (
                  <View style={styles.dateTimeItem}>
                    <Text style={styles.dateTimeIcon}>💻</Text>
                    <Text style={styles.dateTimeText}>Online</Text>
                  </View>
                )}
              </View>

              {/* Location */}
              {appt.location && (
                <View style={styles.locationRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={styles.locationText}>{appt.location}</Text>
                </View>
              )}

              {/* Token Number */}
              {appt.tokenNumber && (
                <View style={styles.tokenRow}>
                  <Text style={styles.tokenLabel}>Token:</Text>
                  <Text style={styles.tokenValue}>{appt.tokenNumber}</Text>
                </View>
              )}

              {/* Fee */}
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Fee:</Text>
                <Text style={styles.feeValue}>₹{appt.fee}</Text>
                <View
                  style={[
                    styles.paymentBadge,
                    {
                      backgroundColor:
                        appt.paymentStatus === 'paid'
                          ? '#10b98120'
                          : appt.paymentStatus === 'pending'
                          ? '#f59e0b20'
                          : '#94a3b820',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.paymentText,
                      {
                        color:
                          appt.paymentStatus === 'paid'
                            ? '#10b981'
                            : appt.paymentStatus === 'pending'
                            ? '#f59e0b'
                            : '#94a3b8',
                      },
                    ]}
                  >
                    {appt.paymentStatus}
                  </Text>
                </View>
              </View>

              {/* Notes */}
              {appt.notes && (
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>📝 {appt.notes}</Text>
                </View>
              )}

              {/* Actions */}
              {appt.status === 'scheduled' || appt.status === 'confirmed' ? (
                <View style={styles.actionsRow}>
                  {appt.consultationType === 'teleconsultation' && (
                    <TouchableOpacity style={styles.actionButtonPrimary}>
                      <Text style={styles.actionButtonPrimaryText}>Join Call</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.actionButtonSecondary}
                    onPress={() => handleCancelAppointment(appt.id)}
                  >
                    <Text style={styles.actionButtonSecondaryText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  bookButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  filterTabActive: {
    backgroundColor: '#0ea5e9',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
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
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  appointmentCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  typeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  appointmentSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    height: 24,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dateTimeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  dateTimeIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  dateTimeText: {
    fontSize: 13,
    color: '#475569',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  locationText: {
    fontSize: 13,
    color: '#475569',
    flex: 1,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tokenLabel: {
    fontSize: 13,
    color: '#64748b',
    marginRight: 8,
  },
  tokenValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  feeLabel: {
    fontSize: 13,
    color: '#64748b',
    marginRight: 8,
  },
  feeValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
    marginRight: 12,
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  paymentText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  notesBox: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  notesText: {
    fontSize: 13,
    color: '#475569',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonPrimary: {
    flex: 1,
    backgroundColor: '#0ea5e9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonPrimaryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonSecondaryText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
});
