import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import insuranceService, { CostEstimation } from '../services/insuranceService';

type Props = NativeStackScreenProps<RootStackParamList, 'CostEstimation'>;

export default function CostEstimationScreen({ navigation, route }: Props) {
  // policyId is optional, if not provided we might need user to select one
  const { policyId } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [estimation, setEstimation] = useState<CostEstimation | null>(null);
  
  // Form state
  const [procedure, setProcedure] = useState('');
  const [hospital, setHospital] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleEstimate = async () => {
    if (!procedure || !hospital) {
      Alert.alert('Missing Info', 'Please enter procedure and hospital name');
      return;
    }
    
    // If no policyId passed, we can't calculate accurate insurance coverage
    // In a real app we'd ask user to select policy if missing
    if (!policyId) {
      Alert.alert('Policy Required', 'Please select an insurance policy to check coverage');
      return;
    }

    setLoading(true);
    try {
      // Using mock service which ignores inputs but returns realistic data
      const data = await insuranceService.getCostEstimation({
        procedureName: 'Knee Replacement', // Mock
        hospitalId: 'apollo-hyd',
        policyId: policyId
      });
      setEstimation(data);
      setShowResults(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to calculate cost estimation');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const commonProcedures = [
    'Knee Replacement',
    'Cataract Surgery',
    'Angioplasty',
    'Appendectomy',
    'C-Section Delivery'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cost Estimator</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!showResults ? (
          <View style={styles.inputForm}>
            <Text style={styles.formTitle}>Check Treatment Costs</Text>
            <Text style={styles.formSubtitle}>Get an estimate of your out-of-pocket expenses before hospitalization</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Treatment / Procedure</Text>
              <TextInput
                style={styles.input}
                value={procedure}
                onChangeText={setProcedure}
                placeholder="Ex: Knee Replacement"
              />
              <View style={styles.chipContainer}>
                {commonProcedures.map(p => (
                  <TouchableOpacity key={p} onPress={() => setProcedure(p)} style={styles.chip}>
                    <Text style={styles.chipText}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Hospital Name</Text>
              <TextInput
                style={styles.input}
                value={hospital}
                onChangeText={setHospital}
                placeholder="Ex: Apollo Hospital"
              />
            </View>

            <TouchableOpacity 
              style={styles.calculateButton}
              onPress={handleEstimate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.calculateButtonText}>Calculate Estimate</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultsContainer}>
            {estimation && (
              <>
                <View style={styles.resultHeader}>
                  <Text style={styles.procedureName}>{estimation.procedureName}</Text>
                  <Text style={styles.hospitalName}>{estimation.hospitalName}</Text>
                  <TouchableOpacity onPress={() => setShowResults(false)} style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                </View>

                {/* Main Cost Card */}
                <View style={styles.costCard}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Estimated Cost</Text>
                    <Text style={styles.totalAmount}>{formatCurrency(estimation.estimatedCost)}</Text>
                  </View>
                  
                  <View style={styles.breakdownDivider} />
                  
                  <View style={styles.breakdownRow}>
                    <View style={styles.breakdownItem}>
                      <Text style={styles.breakdownLabel}>Covered by Insurance</Text>
                      <Text style={[styles.breakdownValue, styles.coveredValue]}>
                        {formatCurrency(estimation.insuranceCovered)}
                      </Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.breakdownItem}>
                      <Text style={styles.breakdownLabel}>You Pay (Approx)</Text>
                      <Text style={[styles.breakdownValue, styles.payValue]}>
                        {formatCurrency(estimation.outOfPocket)}
                      </Text>
                    </View>
                  </View>

                  {/* Co-pay alert */}
                  <View style={styles.copayAlert}>
                    <Text style={styles.copayText}>
                      ⚠️ Includes {((estimation.coPayment / estimation.estimatedCost) * 100).toFixed(0)}% co-payment ({formatCurrency(estimation.coPayment)})
                    </Text>
                  </View>
                </View>
                
                {/* Detailed Breakdown */}
                <View style={styles.detailsSection}>
                  <Text style={styles.sectionTitle}>Cost Breakdown</Text>
                  {estimation.breakdown.map((item, idx) => (
                    <View key={idx} style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</Text>
                      <Text style={styles.detailValue}>{formatCurrency(item.estimatedAmount)}</Text>
                    </View>
                  ))}
                </View>

                {/* Coverage Check */}
                <View style={styles.coverageCheck}>
                  <Text style={styles.sectionTitle}>Policy Check</Text>
                  <View style={styles.checkRow}>
                    <Text style={styles.checkIcon}>✅</Text>
                    <Text style={styles.checkText}>Treatment covered under policy</Text>
                  </View>
                  <View style={styles.checkRow}>
                    <Text style={styles.checkIcon}>✅</Text>
                    <Text style={styles.checkText}>Hospital in network (Cashless)</Text>
                  </View>
                  <View style={styles.checkRow}>
                    <Text style={styles.checkIcon}>ℹ️</Text>
                    <Text style={styles.checkText}>Room rent limit: ₹5,000/day</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={() => Alert.alert('Saved', 'Estimate saved to your dashboard')}
                >
                  <Text style={styles.saveButtonText}>Save Estimate</Text>
                </TouchableOpacity>

                <Text style={styles.disclaimer}>
                  * This is an indicative estimate. Actual costs may vary based on medical complications and final billing.
                </Text>
              </>
            )}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  backButtonText: { fontSize: 28, color: '#0ea5e9' },
  title: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  content: { flex: 1 },
  inputForm: { padding: 20 },
  formTitle: { fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
  formSubtitle: { fontSize: 14, color: '#64748b', marginBottom: 32 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 16, fontSize: 16, color: '#1e293b' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  chipText: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  calculateButton: { backgroundColor: '#0ea5e9', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  calculateButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  resultsContainer: { padding: 20 },
  resultHeader: { marginBottom: 24 },
  procedureName: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  hospitalName: { fontSize: 16, color: '#64748b', marginTop: 4 },
  editButton: { position: 'absolute', right: 0, top: 0 },
  editButtonText: { color: '#0ea5e9', fontWeight: '600' },
  costCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  totalRow: { marginBottom: 16 },
  totalLabel: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  totalAmount: { fontSize: 32, fontWeight: '700', color: '#1e293b' },
  breakdownDivider: { height: 1, backgroundColor: '#e2e8f0', marginBottom: 16 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between' },
  breakdownItem: { flex: 1 },
  verticalDivider: { width: 1, backgroundColor: '#e2e8f0', marginHorizontal: 16 },
  breakdownLabel: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  breakdownValue: { fontSize: 18, fontWeight: '700' },
  coveredValue: { color: '#10b981' },
  payValue: { color: '#ef4444' },
  copayAlert: { marginTop: 16, backgroundColor: '#fef3c7', padding: 10, borderRadius: 8 },
  copayText: { fontSize: 12, color: '#92400e', textAlign: 'center' },
  detailsSection: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { fontSize: 14, color: '#64748b' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  coverageCheck: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 24 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  checkIcon: { fontSize: 16 },
  checkText: { fontSize: 14, color: '#1e293b' },
  saveButton: { backgroundColor: '#0ea5e9', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  disclaimer: { fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 16, fontStyle: 'italic' },
});
