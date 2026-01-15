import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import insuranceService, { CashlessHospital } from '../services/insuranceService';

type Props = NativeStackScreenProps<RootStackParamList, 'CashlessFlow'>;

export default function CashlessFlowScreen({ navigation, route }: Props) {
  const { policyId } = route.params || {};
  const [hospitals, setHospitals] = useState<CashlessHospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Hyderabad'); // Default mock location
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);

  useEffect(() => {
    searchHospitals();
  }, [location, selectedSpecialization]);

  const searchHospitals = async () => {
    setLoading(true);
    try {
      const data = await insuranceService.searchCashlessHospitals({
        city: location,
        specialization: selectedSpecialization || undefined,
        radius: 10
      });
      setHospitals(data);
    } catch (error) {
      console.error('Failed to search hospitals:', error);
      Alert.alert('Error', 'Failed to search cashless hospitals');
    } finally {
      setLoading(false);
    }
  };

  const handlePreAuthRequest = (hospital: CashlessHospital) => {
    if (!policyId) {
      Alert.alert('Select Policy', 'Please select a policy first');
      return;
    }
    
    Alert.alert(
      'Request Pre-Authorization',
      `Start pre-auth request for ${hospital.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Request', 
          onPress: async () => {
            try {
              await insuranceService.requestPreAuth({
                policyId,
                hospitalName: hospital.name,
                doctorName: 'Dr. Smith',
                proposedTreatment: 'Planned Hospitalization',
                estimatedCost: 50000,
                plannedAdmissionDate: new Date(),
                documents: []
              });
              Alert.alert('Success', 'Pre-authorization request submitted');
            } catch (error) {
              Alert.alert('Error', 'Failed to request pre-auth');
            }
          }
        }
      ]
    );
  };

  const renderRating = (rating: number) => (
    <View style={styles.ratingBadge}>
      <Text style={styles.ratingText}>★ {rating.toFixed(1)}</Text>
    </View>
  );

  const specializations = ['Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'Oncology', 'General Surgery'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Network Hospitals</Text>
        <TouchableOpacity onPress={() => Alert.alert('Map View', 'Map view coming soon')}>
          <Text style={styles.mapButton}>🗺️</Text>
        </TouchableOpacity>
      </View>

      {/* Search & Location Bar */}
      <View style={styles.searchSection}>
        <View style={styles.locationBar}>
          <Text style={styles.locationIcon}>📍</Text>
          <TextInput
            style={styles.locationInput}
            value={location}
            onChangeText={setLocation}
            placeholder="City or Pincode"
          />
        </View>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search hospital name..."
          onSubmitEditing={() => searchHospitals()}
        />
      </View>

      {/* Specialization Filters */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterChip, !selectedSpecialization && styles.activeFilterChip]}
            onPress={() => setSelectedSpecialization(null)}
          >
            <Text style={[styles.filterText, !selectedSpecialization && styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
          {specializations.map((spec) => (
            <TouchableOpacity
              key={spec}
              style={[styles.filterChip, selectedSpecialization === spec && styles.activeFilterChip]}
              onPress={() => setSelectedSpecialization(spec)}
            >
              <Text style={[styles.filterText, selectedSpecialization === spec && styles.activeFilterText]}>
                {spec}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results List */}
      <View style={styles.resultsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0ea5e9" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={hospitals}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No hospitals found in this area</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.hospitalCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <Text style={styles.hospitalName}>{item.name}</Text>
                    <Text style={styles.distanceText}>{(item.distance || 0).toFixed(1)} km away</Text>
                  </View>
                  {renderRating(item.rating || 0)}
                </View>

                <Text style={styles.addressText}>{item.address}</Text>

                <View style={styles.badgesRow}>
                  {item.hasEmergency && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>🚑 Emergency</Text>
                    </View>
                  )}
                  {item.hasICU && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>🏥 ICU</Text>
                    </View>
                  )}
                  <View style={[styles.badge, styles.tpaBadge]}>
                    <Text style={[styles.badgeText, styles.tpaText]}>Cashless</Text>
                  </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.specScroll}>
                  {item.specializations.map((spec, idx) => (
                    <Text key={idx} style={styles.specText}>• {spec}</Text>
                  ))}
                </ScrollView>

                <View style={styles.divider} />

                <View style={styles.actionsRow}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Call', `Calling ${item.phone}...`)}
                  >
                    <Text style={styles.actionIcon}>📞</Text>
                    <Text style={styles.actionText}>Call</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Directions', `Opening maps for ${item.name}`)}
                  >
                    <Text style={styles.actionIcon}>directions</Text>
                    <Text style={styles.actionText}>Navigate</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.primaryAction]}
                    onPress={() => handlePreAuthRequest(item)}
                  >
                    <Text style={[styles.actionText, styles.primaryActionText]}>Request Pre-Auth</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  backButtonText: { fontSize: 28, color: '#0ea5e9' },
  title: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  mapButton: { fontSize: 24 },
  searchSection: { padding: 16, backgroundColor: '#fff', gap: 12 },
  locationBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 8, paddingHorizontal: 12 },
  locationIcon: { fontSize: 16, marginRight: 8 },
  locationInput: { flex: 1, height: 40, fontSize: 14, color: '#1e293b' },
  searchInput: { height: 44, backgroundColor: '#f1f5f9', borderRadius: 8, paddingHorizontal: 12, fontSize: 14, color: '#1e293b' },
  filterContainer: { backgroundColor: '#fff', paddingBottom: 12 },
  filterScroll: { paddingHorizontal: 16, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
  activeFilterChip: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
  filterText: { fontSize: 13, color: '#64748b' },
  activeFilterText: { color: '#fff', fontWeight: '600' },
  resultsContainer: { flex: 1 },
  listContent: { padding: 16 },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#94a3b8', fontSize: 16 },
  hospitalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  headerLeft: { flex: 1, marginRight: 12 },
  hospitalName: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  distanceText: { fontSize: 12, color: '#64748b' },
  ratingBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#b45309' },
  addressText: { fontSize: 13, color: '#64748b', marginBottom: 12 },
  badgesRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  badge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { fontSize: 11, color: '#64748b', fontWeight: '500' },
  tpaBadge: { backgroundColor: '#dcfce7' },
  tpaText: { color: '#166534' },
  specScroll: { flexDirection: 'row', marginBottom: 12 },
  specText: { fontSize: 12, color: '#64748b', marginRight: 12 },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginBottom: 12 },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 8, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' },
  actionIcon: { fontSize: 14, color: '#64748b' },
  actionText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  primaryAction: { flex: 1.5, backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
  primaryActionText: { color: '#fff' },
});
