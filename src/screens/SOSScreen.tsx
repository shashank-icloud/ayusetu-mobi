import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import { emergencyService, SOSRequest, NearbyFacility } from '../services/emergencyService';

type SOSScreenNavigationProp = StackNavigationProp<AppStackParamList, 'SOS'>;

interface Props {
  navigation: SOSScreenNavigationProp;
}

const SOSScreen: React.FC<Props> = ({ navigation }) => {
  const [sosActive, setSOSActive] = useState(false);
  const [activeSOS, setActiveSOS] = useState<SOSRequest | null>(null);
  const [nearbyFacilities, setNearbyFacilities] = useState<NearbyFacility[]>([]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (sosActive && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (sosActive && countdown === 0) {
      confirmSOS();
    }
  }, [sosActive, countdown]);

  const handleSOSPress = () => {
    setSOSActive(true);
    setCountdown(5);
  };

  const handleCancel = () => {
    setSOSActive(false);
    setCountdown(5);
  };

  const confirmSOS = async () => {
    setLoading(true);
    try {
      // Trigger SOS
      const sos = await emergencyService.triggerSOS({
        type: 'panic',
        location: {
          latitude: 28.6139,
          longitude: 77.209,
        },
        userNote: 'Emergency SOS triggered',
      });
      
      setActiveSOS(sos);

      // Get nearby facilities
      const facilities = await emergencyService.getNearbyFacilities({
        location: {
          latitude: 28.6139,
          longitude: 77.209,
        },
        radius: 5,
        hasEmergency: true,
      });
      
      setNearbyFacilities(facilities);

      Alert.alert(
        'SOS Activated! 🚨',
        'Emergency services have been notified.\nYour emergency contacts have been alerted.\nHelp is on the way!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to trigger SOS. Please try again or call emergency services directly.');
      setSOSActive(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSOS = async () => {
    if (!activeSOS) return;

    Alert.alert(
      'Cancel SOS',
      'Are you sure you want to cancel the emergency request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await emergencyService.cancelSOS(activeSOS.id);
              setActiveSOS(null);
              setSOSActive(false);
              setNearbyFacilities([]);
              Alert.alert('SOS Cancelled', 'Emergency request has been cancelled.');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel SOS');
            }
          },
        },
      ]
    );
  };

  const callEmergency = () => {
    Alert.alert('Emergency Numbers', 'Ambulance: 108\nPolice: 100\nFire: 101', [
      { text: 'OK' },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>Activating SOS...</Text>
        <Text style={styles.loadingSubtext}>Notifying emergency services</Text>
      </View>
    );
  }

  if (sosActive && !activeSOS) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownTitle}>⚠️ SOS Alert</Text>
          <Text style={styles.countdownText}>{countdown}</Text>
          <Text style={styles.countdownSubtext}>
            Emergency services will be notified in {countdown} seconds
          </Text>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (activeSOS) {
    return (
      <View style={styles.container}>
        <View style={styles.activeHeader}>
          <Text style={styles.activeHeaderText}>🚨 SOS ACTIVE</Text>
          <Text style={styles.activeHeaderSubtext}>Help is on the way</Text>
        </View>

        <ScrollView style={styles.content}>
          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(activeSOS.status) }]}>
                <Text style={styles.statusBadgeText}>{activeSOS.status.toUpperCase()}</Text>
              </View>
            </View>

            {activeSOS.ambulanceETA && (
              <View style={styles.etaContainer}>
                <Text style={styles.etaLabel}>🚑 Ambulance ETA</Text>
                <Text style={styles.etaTime}>{activeSOS.ambulanceETA}</Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{activeSOS.location.address || 'Current location'}</Text>
            </View>

            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{new Date(activeSOS.timestamp).toLocaleTimeString()}</Text>
            </View>

            {activeSOS.contactsNotified.length > 0 && (
              <View style={styles.notifiedContainer}>
                <Text style={styles.notifiedLabel}>✓ Contacts Notified</Text>
                <Text style={styles.notifiedCount}>{activeSOS.contactsNotified.length} people alerted</Text>
              </View>
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <Text style={styles.actionsTitle}>Quick Actions</Text>
            <TouchableOpacity style={styles.actionButton} onPress={callEmergency}>
              <Text style={styles.actionEmoji}>📞</Text>
              <Text style={styles.actionText}>Call Emergency (108)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionEmoji}>💬</Text>
              <Text style={styles.actionText}>Message Emergency Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionEmoji}>📍</Text>
              <Text style={styles.actionText}>Share Live Location</Text>
            </TouchableOpacity>
          </View>

          {/* Nearby Facilities */}
          {nearbyFacilities.length > 0 && (
            <View style={styles.facilitiesContainer}>
              <Text style={styles.facilitiesTitle}>🏥 Nearby Hospitals</Text>
              {nearbyFacilities.map(facility => (
                <View key={facility.id} style={styles.facilityCard}>
                  <View style={styles.facilityHeader}>
                    <Text style={styles.facilityName}>{facility.name}</Text>
                    <View style={styles.facilityDistance}>
                      <Text style={styles.distanceText}>{facility.distance.toFixed(1)} km</Text>
                    </View>
                  </View>
                  <Text style={styles.facilityAddress}>{facility.address}</Text>
                  <View style={styles.facilityFeatures}>
                    {facility.hasEmergency && (
                      <View style={styles.featureTag}>
                        <Text style={styles.featureText}>🚑 Emergency</Text>
                      </View>
                    )}
                    {facility.hasICU && (
                      <View style={styles.featureTag}>
                        <Text style={styles.featureText}>🏥 ICU</Text>
                      </View>
                    )}
                    {facility.availability === 'open-24x7' && (
                      <View style={styles.featureTag}>
                        <Text style={styles.featureText}>⏰ 24x7</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity style={styles.facilityCallButton}>
                    <Text style={styles.facilityCallText}>📞 Call {facility.phone}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.cancelSOSButton} onPress={handleCancelSOS}>
            <Text style={styles.cancelSOSButtonText}>Cancel SOS Request</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency SOS</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoEmoji}>🚨</Text>
          <Text style={styles.infoTitle}>Emergency SOS</Text>
          <Text style={styles.infoText}>
            Press and hold the SOS button below to trigger an emergency alert.
            {'\n\n'}
            This will:
            {'\n'}• Notify emergency services (108)
            {'\n'}• Alert your emergency contacts
            {'\n'}• Share your current location
            {'\n'}• Send your medical information
          </Text>
        </View>

        <TouchableOpacity style={styles.sosButton} onLongPress={handleSOSPress}>
          <Text style={styles.sosButtonText}>SOS</Text>
          <Text style={styles.sosButtonSubtext}>Press & Hold</Text>
        </TouchableOpacity>

        <View style={styles.quickCallsContainer}>
          <Text style={styles.quickCallsTitle}>Quick Emergency Numbers</Text>
          <TouchableOpacity style={styles.quickCallButton}>
            <Text style={styles.quickCallEmoji}>🚑</Text>
            <View style={styles.quickCallInfo}>
              <Text style={styles.quickCallLabel}>Ambulance</Text>
              <Text style={styles.quickCallNumber}>108 / 102</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCallButton}>
            <Text style={styles.quickCallEmoji}>👮</Text>
            <View style={styles.quickCallInfo}>
              <Text style={styles.quickCallLabel}>Police</Text>
              <Text style={styles.quickCallNumber}>100</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCallButton}>
            <Text style={styles.quickCallEmoji}>🚒</Text>
            <View style={styles.quickCallInfo}>
              <Text style={styles.quickCallLabel}>Fire</Text>
              <Text style={styles.quickCallNumber}>101</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('EmergencySettings')}
        >
          <Text style={styles.settingsButtonText}>⚙️ Emergency Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'triggered':
      return '#FF9500';
    case 'dispatched':
      return '#007AFF';
    case 'arrived':
      return '#34C759';
    case 'resolved':
      return '#8E8E93';
    case 'cancelled':
      return '#666';
    default:
      return '#FF3B30';
  }
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
  activeHeader: {
    backgroundColor: '#FF3B30',
    padding: 20,
    alignItems: 'center',
  },
  activeHeaderText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  activeHeaderSubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#FF3B30',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  countdownContainer: {
    alignItems: 'center',
    padding: 32,
  },
  countdownTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF3B30',
    marginBottom: 24,
  },
  countdownText: {
    fontSize: 96,
    fontWeight: '700',
    color: '#FF3B30',
    marginBottom: 16,
  },
  countdownSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  sosButton: {
    backgroundColor: '#FF3B30',
    margin: 16,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  sosButtonText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  sosButtonSubtext: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  quickCallsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  quickCallsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  quickCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  quickCallEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  quickCallInfo: {
    flex: 1,
  },
  quickCallLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  quickCallNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  settingsButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  etaContainer: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  etaLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  etaTime: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  notifiedContainer: {
    backgroundColor: '#f0fff4',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  notifiedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
    marginBottom: 4,
  },
  notifiedCount: {
    fontSize: 13,
    color: '#666',
  },
  actionsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  actionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  facilitiesContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  facilitiesTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  facilityCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  facilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  facilityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  facilityDistance: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  distanceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  facilityAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  facilityFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  featureTag: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#333',
  },
  facilityCallButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  facilityCallText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelSOSButton: {
    backgroundColor: '#8E8E93',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelSOSButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SOSScreen;
