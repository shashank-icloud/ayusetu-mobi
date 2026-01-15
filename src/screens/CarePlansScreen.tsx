import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import { appointmentsService, CarePlan, CarePlanActivity } from '../services/appointmentsService';

type CarePlansScreenNavigationProp = StackNavigationProp<AppStackParamList, 'CarePlans'>;

interface Props {
  navigation: CarePlansScreenNavigationProp;
}

const CarePlansScreen: React.FC<Props> = ({ navigation }) => {
  const [carePlans, setCarePlans] = useState<CarePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<CarePlan | null>(null);

  useEffect(() => {
    loadCarePlans();
  }, []);

  const loadCarePlans = async () => {
    setLoading(true);
    try {
      const plans = await appointmentsService.getCarePlans();
      setCarePlans(plans);
      if (plans.length > 0 && !selectedPlan) {
        setSelectedPlan(plans[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load care plans');
    } finally {
      setLoading(false);
    }
  };

  const handleActivityToggle = async (activity: CarePlanActivity) => {
    if (!selectedPlan) return;

    try {
      const newStatus = activity.completed ? 'pending' : 'completed';
      await appointmentsService.updateActivityStatus(activity.id, newStatus);
      
      // Update local state
      const updatedPlan = {
        ...selectedPlan,
        activities: selectedPlan.activities.map(a =>
          a.id === activity.id
            ? { ...a, completed: !a.completed, completedAt: !a.completed ? new Date().toISOString() : undefined }
            : a
        ),
      };
      
      // Recalculate progress
      const completedCount = updatedPlan.activities.filter(a => a.completed).length;
      updatedPlan.progress = Math.round((completedCount / updatedPlan.activities.length) * 100);
      
      setSelectedPlan(updatedPlan);
      
      // Update in list
      setCarePlans(carePlans.map(p => (p.id === updatedPlan.id ? updatedPlan : p)));
    } catch (error) {
      Alert.alert('Error', 'Failed to update activity');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#34C759';
      case 'completed':
        return '#007AFF';
      case 'paused':
        return '#FF9500';
      default:
        return '#8E8E93';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return '#34C759';
    if (progress >= 50) return '#007AFF';
    if (progress >= 25) return '#FF9500';
    return '#FF3B30';
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: { [key: string]: string } = {
      daily: '📅 Daily',
      weekly: '📆 Weekly',
      monthly: '🗓️ Monthly',
      'as-needed': '🔔 As Needed',
    };
    return labels[frequency] || frequency;
  };

  const renderPlanSelector = () => (
    <View style={styles.planSelector}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {carePlans.map(plan => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planTab,
              selectedPlan?.id === plan.id && styles.planTabActive,
            ]}
            onPress={() => setSelectedPlan(plan)}
          >
            <Text style={[styles.planTabText, selectedPlan?.id === plan.id && styles.planTabTextActive]}>
              {plan.title}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(plan.status) }]}>
              <Text style={styles.statusText}>{getStatusLabel(plan.status)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderGoals = () => {
    if (!selectedPlan) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Goals</Text>
        {selectedPlan.goals.map(goal => (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={[styles.goalStatus, goal.achieved && styles.goalAchieved]}>
                {goal.achieved ? '✅ Achieved' : '🎯 In Progress'}
              </Text>
            </View>
            <Text style={styles.goalDescription}>{goal.description}</Text>
            <View style={styles.goalMetrics}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Target</Text>
                <Text style={styles.metricValue}>{goal.targetValue} {goal.metric}</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Current</Text>
                <Text style={styles.metricValue}>{goal.currentValue} {goal.metric}</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Progress</Text>
                <Text style={[styles.metricValue, { color: getProgressColor(goal.progress) }]}>
                  {goal.progress}%
                </Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${goal.progress}%`,
                    backgroundColor: getProgressColor(goal.progress),
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderActivities = () => {
    if (!selectedPlan) return null;

    const groupedActivities = selectedPlan.activities.reduce((acc, activity) => {
      if (!acc[activity.frequency]) {
        acc[activity.frequency] = [];
      }
      acc[activity.frequency].push(activity);
      return acc;
    }, {} as { [key: string]: CarePlanActivity[] });

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Activities</Text>
        
        {Object.entries(groupedActivities).map(([frequency, activities]) => (
          <View key={frequency} style={styles.frequencyGroup}>
            <Text style={styles.frequencyLabel}>{getFrequencyLabel(frequency)}</Text>
            
            {activities.map(activity => (
              <TouchableOpacity
                key={activity.id}
                style={[styles.activityCard, activity.completed && styles.activityCardCompleted]}
                onPress={() => handleActivityToggle(activity)}
              >
                <View style={styles.activityHeader}>
                  <View style={styles.checkbox}>
                    <Text style={styles.checkboxText}>{activity.completed ? '✅' : '⬜'}</Text>
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={[styles.activityTitle, activity.completed && styles.activityTitleCompleted]}>
                      {activity.title}
                    </Text>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                    {activity.duration && (
                      <Text style={styles.activityDuration}>⏱️ {activity.duration}</Text>
                    )}
                    {activity.completed && activity.completedAt && (
                      <Text style={styles.completedAt}>
                        ✓ Completed on {new Date(activity.completedAt).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderPlanOverview = () => {
    if (!selectedPlan) return null;

    return (
      <View style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <View>
            <Text style={styles.planTitle}>{selectedPlan.title}</Text>
            <Text style={styles.planDoctor}>Dr. {selectedPlan.createdBy}</Text>
          </View>
          <View style={[styles.statusBadgeLarge, { backgroundColor: getStatusColor(selectedPlan.status) }]}>
            <Text style={styles.statusTextLarge}>{getStatusLabel(selectedPlan.status)}</Text>
          </View>
        </View>

        <Text style={styles.planDescription}>{selectedPlan.description}</Text>

        <View style={styles.planMetrics}>
          <View style={styles.planMetric}>
            <Text style={styles.planMetricLabel}>Duration</Text>
            <Text style={styles.planMetricValue}>{selectedPlan.duration}</Text>
          </View>
          <View style={styles.planMetric}>
            <Text style={styles.planMetricLabel}>Progress</Text>
            <Text style={[styles.planMetricValue, { color: getProgressColor(selectedPlan.progress) }]}>
              {selectedPlan.progress}%
            </Text>
          </View>
          <View style={styles.planMetric}>
            <Text style={styles.planMetricLabel}>Activities</Text>
            <Text style={styles.planMetricValue}>
              {selectedPlan.activities.filter(a => a.completed).length}/{selectedPlan.activities.length}
            </Text>
          </View>
        </View>

        <View style={styles.overallProgressBar}>
          <View
            style={[
              styles.overallProgressFill,
              {
                width: `${selectedPlan.progress}%`,
                backgroundColor: getProgressColor(selectedPlan.progress),
              },
            ]}
          />
        </View>

        <View style={styles.dateRange}>
          <Text style={styles.dateText}>
            📅 {new Date(selectedPlan.startDate).toLocaleDateString()} - {new Date(selectedPlan.endDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading care plans...</Text>
      </View>
    );
  }

  if (carePlans.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Care Plans</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyTitle}>No Care Plans Yet</Text>
          <Text style={styles.emptyText}>
            Your doctor will create personalized care plans to help you track your health goals and activities.
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
        <Text style={styles.headerTitle}>My Care Plans</Text>
      </View>

      {renderPlanSelector()}

      <ScrollView style={styles.content}>
        {renderPlanOverview()}
        {renderGoals()}
        {renderActivities()}
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
  planSelector: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  planTab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    flexDirection: 'column',
    alignItems: 'center',
  },
  planTabActive: {
    backgroundColor: '#007AFF',
  },
  planTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  planTabTextActive: {
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  statusTextLarge: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  overviewCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  planDoctor: {
    fontSize: 14,
    color: '#007AFF',
  },
  planDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  planMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  planMetric: {
    alignItems: 'center',
  },
  planMetricLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  planMetricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  overallProgressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  overallProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  dateRange: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
    color: '#666',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  goalCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  goalStatus: {
    fontSize: 13,
    color: '#FF9500',
  },
  goalAchieved: {
    color: '#34C759',
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  goalMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  frequencyGroup: {
    marginBottom: 20,
  },
  frequencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityCardCompleted: {
    backgroundColor: '#f0f8ff',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  checkboxText: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityTitleCompleted: {
    color: '#666',
    textDecorationLine: 'line-through',
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 6,
  },
  activityDuration: {
    fontSize: 13,
    color: '#007AFF',
    marginBottom: 4,
  },
  completedAt: {
    fontSize: 12,
    color: '#34C759',
    marginTop: 4,
  },
});

export default CarePlansScreen;
