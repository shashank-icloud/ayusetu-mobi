import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import familyWellnessService, { WellnessLog, FamilyMember, WellnessGoal } from '../services/familyWellnessService';

type Props = NativeStackScreenProps<RootStackParamList, 'WellnessTracking'>;

export default function WellnessTrackingScreen({ navigation, route }: Props) {
  const { memberId } = route.params || {};
  const [logs, setLogs] = useState<WellnessLog[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [goals, setGoals] = useState<WellnessGoal[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>(memberId);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showLogForm, setShowLogForm] = useState(false);

  // Form state
  const [sleepHours, setSleepHours] = useState('');
  const [steps, setSteps] = useState('');
  const [waterIntake, setWaterIntake] = useState('');
  const [weight, setWeight] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [mood, setMood] = useState(7);

  useEffect(() => {
    loadData();
  }, [selectedMemberId, selectedDate]);

  const loadData = async () => {
    try {
      const startDate = new Date(selectedDate);
      startDate.setDate(startDate.getDate() - 7);

      const [logsData, membersData, goalsData] = await Promise.all([
        familyWellnessService.getWellnessLogs({ familyMemberId: selectedMemberId ?? '', startDate, endDate: new Date() }),
        familyWellnessService.getFamilyMembers({}),
        familyWellnessService.getWellnessGoals({ familyMemberId: selectedMemberId ?? '', status: 'in-progress' }),
      ]);

      setLogs(logsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setMembers(membersData);
      setGoals(goalsData);
    } catch (error) {
      console.error('Failed to load wellness data:', error);
      Alert.alert('Error', 'Failed to load wellness data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleLogWellness = async () => {
    if (!selectedMemberId) {
      Alert.alert('Error', 'Please select a family member');
      return;
    }

    try {
      const logData: any = {
        familyMemberId: selectedMemberId,
        date: selectedDate,
      };

      if (sleepHours) {
        logData.sleepHours = parseFloat(sleepHours);
        logData.sleepQuality = 'good';
        logData.sleepStartTime = new Date();
        logData.sleepEndTime = new Date();
      }

      if (steps) {
        logData.steps = parseInt(steps);
        logData.activeMinutes = 30;
        logData.caloriesBurned = parseInt(steps) * 0.04;
        logData.exerciseType = ['walking'];
        logData.activityLevel = 'moderate';
      }

      if (waterIntake) {
        logData.waterIntake = parseFloat(waterIntake) * 1000; // Convert liters to ml
        logData.mealsLogged = 3;
        logData.caloriesConsumed = 2000;
      }

      if (weight) logData.weight = parseFloat(weight);
      if (systolic) logData.bloodPressureSystolic = parseInt(systolic);
      if (diastolic) logData.bloodPressureDiastolic = parseInt(diastolic);
      if (heartRate) logData.heartRate = parseInt(heartRate);

      logData.moodRating = mood;
      logData.stressLevel = 5;
      logData.anxietyLevel = 3;

      await familyWellnessService.logWellness(logData);
      Alert.alert('Success', 'Wellness log recorded');
      setShowLogForm(false);
      loadData();
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to record wellness log');
    }
  };

  const resetForm = () => {
    setSleepHours('');
    setSteps('');
    setWaterIntake('');
    setWeight('');
    setSystolic('');
    setDiastolic('');
    setHeartRate('');
    setMood(7);
  };

  const getMoodEmoji = (score: number): string => {
    if (score >= 8) return '😊';
    if (score >= 6) return '🙂';
    if (score >= 4) return '😐';
    return '😔';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Wellness Tracking</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      </SafeAreaView>
    );
  }

  const latestLog = logs[0];
  const avgSteps = logs.length > 0 ? Math.round(logs.reduce((sum, l) => sum + (l.steps || 0), 0) / logs.length) : 0;
  const avgSleep = logs.length > 0 ? (logs.reduce((sum, l) => sum + (l.sleepHours || 0), 0) / logs.length).toFixed(1) : '0';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Wellness Tracking</Text>
        <TouchableOpacity onPress={() => setShowLogForm(!showLogForm)} style={styles.addButton}>
          <Text style={styles.addButtonText}>{showLogForm ? '✕' : '+'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Member Selector */}
        <View style={styles.memberSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.memberScroll}>
            {members.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={[styles.memberChip, selectedMemberId === member.id && styles.activeMemberChip]}
                onPress={() => setSelectedMemberId(member.id)}
              >
                <Text style={[styles.memberChipText, selectedMemberId === member.id && styles.activeMemberChipText]}>
                  {member.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Log Form */}
        {showLogForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Log Today's Wellness</Text>

            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Sleep (hours)</Text>
                <TextInput
                  style={styles.input}
                  value={sleepHours}
                  onChangeText={setSleepHours}
                  placeholder="7.5"
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Steps</Text>
                <TextInput
                  style={styles.input}
                  value={steps}
                  onChangeText={setSteps}
                  placeholder="10000"
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Water (liters)</Text>
                <TextInput
                  style={styles.input}
                  value={waterIntake}
                  onChangeText={setWaterIntake}
                  placeholder="2.5"
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="70"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>BP Systolic</Text>
                <TextInput
                  style={styles.input}
                  value={systolic}
                  onChangeText={setSystolic}
                  placeholder="120"
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>BP Diastolic</Text>
                <TextInput
                  style={styles.input}
                  value={diastolic}
                  onChangeText={setDiastolic}
                  placeholder="80"
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Heart Rate</Text>
                <TextInput
                  style={styles.input}
                  value={heartRate}
                  onChangeText={setHeartRate}
                  placeholder="72"
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Mood {getMoodEmoji(mood)}</Text>
                <View style={styles.moodSlider}>
                  <TouchableOpacity onPress={() => setMood(Math.max(1, mood - 1))}>
                    <Text style={styles.sliderButton}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.moodValue}>{mood}/10</Text>
                  <TouchableOpacity onPress={() => setMood(Math.min(10, mood + 1))}>
                    <Text style={styles.sliderButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleLogWellness}>
              <Text style={styles.submitButtonText}>Save Log</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Summary Cards */}
        {latestLog && (
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Today's Summary</Text>
            <View style={styles.summaryGrid}>
              {latestLog.sleepHours && (
                <View style={styles.metricCard}>
                  <Text style={styles.metricIcon}>😴</Text>
                  <Text style={styles.metricValue}>{latestLog.sleepHours}h</Text>
                  <Text style={styles.metricLabel}>Sleep</Text>
                </View>
              )}
              {latestLog.steps && (
                <View style={styles.metricCard}>
                  <Text style={styles.metricIcon}>👟</Text>
                  <Text style={styles.metricValue}>{latestLog.steps.toLocaleString()}</Text>
                  <Text style={styles.metricLabel}>Steps</Text>
                </View>
              )}
              {latestLog.waterIntake && (
                <View style={styles.metricCard}>
                  <Text style={styles.metricIcon}>💧</Text>
                  <Text style={styles.metricValue}>{(latestLog.waterIntake / 1000).toFixed(1)}L</Text>
                  <Text style={styles.metricLabel}>Water</Text>
                </View>
              )}
              {latestLog.weight && (
                <View style={styles.metricCard}>
                  <Text style={styles.metricIcon}>⚖️</Text>
                  <Text style={styles.metricValue}>{latestLog.weight}kg</Text>
                  <Text style={styles.metricLabel}>Weight</Text>
                </View>
              )}
              {latestLog.bloodPressureSystolic && latestLog.bloodPressureDiastolic && (
                <View style={styles.metricCard}>
                  <Text style={styles.metricIcon}>❤️</Text>
                  <Text style={styles.metricValue}>
                    {latestLog.bloodPressureSystolic}/{latestLog.bloodPressureDiastolic}
                  </Text>
                  <Text style={styles.metricLabel}>BP</Text>
                </View>
              )}
              {latestLog.moodRating && (
                <View style={styles.metricCard}>
                  <Text style={styles.metricIcon}>{getMoodEmoji(latestLog.moodRating)}</Text>
                  <Text style={styles.metricValue}>{latestLog.moodRating}/10</Text>
                  <Text style={styles.metricLabel}>Mood</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Weekly Averages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7-Day Average</Text>
          <View style={styles.avgCard}>
            <View style={styles.avgRow}>
              <Text style={styles.avgLabel}>Avg. Sleep</Text>
              <Text style={styles.avgValue}>{avgSleep} hours</Text>
            </View>
            <View style={styles.avgRow}>
              <Text style={styles.avgLabel}>Avg. Steps</Text>
              <Text style={styles.avgValue}>{avgSteps.toLocaleString()}</Text>
            </View>
            <View style={styles.avgRow}>
              <Text style={styles.avgLabel}>Logs Recorded</Text>
              <Text style={styles.avgValue}>{logs.length}</Text>
            </View>
          </View>
        </View>

        {/* Active Goals */}
        {goals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wellness Goals</Text>
            {goals.map((goal) => (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalName}>{goal.title}</Text>
                  <Text style={styles.goalProgress}>
                    {Math.round((goal.currentValue / goal.targetValue) * 100)}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${Math.min(100, (goal.currentValue / goal.targetValue) * 100)}%` }]} />
                </View>
                <View style={styles.goalDetails}>
                  <Text style={styles.goalTarget}>
                    Target: {goal.targetValue} {goal.unit}
                  </Text>
                  <Text style={styles.goalDeadline}>
                    Due: {formatDate(goal.targetDate)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recent Logs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Logs</Text>
          {logs.slice(0, 5).map((log) => (
            <View key={log.id} style={styles.logCard}>
              <Text style={styles.logDate}>{formatDate(log.date)}</Text>
              <View style={styles.logMetrics}>
                {log.sleepHours && <Text style={styles.logMetric}>😴 {log.sleepHours}h</Text>}
                {log.steps && <Text style={styles.logMetric}>👟 {log.steps}</Text>}
                {log.waterIntake && <Text style={styles.logMetric}>💧 {(log.waterIntake / 1000).toFixed(1)}L</Text>}
                {log.moodRating && <Text style={styles.logMetric}>{getMoodEmoji(log.moodRating)}</Text>}
              </View>
            </View>
          ))}
        </View>

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
  addButton: { width: 40, height: 40, backgroundColor: '#0ea5e9', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  addButtonText: { fontSize: 24, color: '#fff', fontWeight: '700' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  memberSelector: { backgroundColor: '#fff', paddingVertical: 12, marginBottom: 12 },
  memberScroll: { paddingHorizontal: 20, gap: 8 },
  memberChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
  activeMemberChip: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
  memberChipText: { fontSize: 13, color: '#64748b' },
  activeMemberChipText: { color: '#fff', fontWeight: '600' },
  formCard: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  formTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
  formRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  formField: { flex: 1 },
  fieldLabel: { fontSize: 13, color: '#64748b', marginBottom: 6 },
  input: { height: 44, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12, fontSize: 14, color: '#1e293b' },
  moodSlider: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 44, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12 },
  sliderButton: { fontSize: 20, color: '#0ea5e9', fontWeight: '700' },
  moodValue: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  submitButton: { backgroundColor: '#0ea5e9', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  summarySection: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { width: '31%', backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  metricIcon: { fontSize: 32, marginBottom: 8 },
  metricValue: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  metricLabel: { fontSize: 11, color: '#64748b' },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  avgCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, gap: 12 },
  avgRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  avgLabel: { fontSize: 14, color: '#64748b' },
  avgValue: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  goalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  goalName: { fontSize: 15, fontWeight: '600', color: '#1e293b', flex: 1 },
  goalProgress: { fontSize: 18, fontWeight: '700', color: '#0ea5e9' },
  progressBar: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: '#0ea5e9', borderRadius: 4 },
  goalDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  goalTarget: { fontSize: 12, color: '#64748b' },
  goalDeadline: { fontSize: 12, color: '#64748b' },
  logCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logDate: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  logMetrics: { flexDirection: 'row', gap: 12 },
  logMetric: { fontSize: 13, color: '#64748b' },
});
