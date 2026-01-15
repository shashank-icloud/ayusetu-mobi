import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { recordIngestionService, AutoSyncStatus } from '../../services/recordIngestionService';

type Props = NativeStackScreenProps<RootStackParamList, 'AutoSync'>;

export default function AutoSyncScreen({ navigation }: Props) {
  const [providers, setProviders] = useState<AutoSyncStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const data = await recordIngestionService.getAutoSyncProviders();
      setProviders(data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProviders();
    setRefreshing(false);
  };

  const handleToggleSync = async (providerId: string, currentStatus: boolean) => {
    try {
      await recordIngestionService.enableAutoSync(providerId, !currentStatus);
      setProviders(providers.map(p =>
        p.providerId === providerId ? { ...p, isEnabled: !currentStatus } : p
      ));
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle auto-sync');
    }
  };

  const handleManualSync = async (providerId: string) => {
    setSyncing(providerId);
    try {
      const result = await recordIngestionService.triggerManualSync(providerId);
      Alert.alert(
        'Sync Complete',
        `${result.recordsFetched} new record(s) fetched from provider.`
      );
      await fetchProviders();
    } catch (error) {
      Alert.alert('Error', 'Failed to sync records');
    } finally {
      setSyncing(null);
    }
  };

  const getProviderIcon = (type: string) => {
    const icons: Record<string, string> = {
      hospital: '🏥',
      lab: '🧪',
      pharmacy: '💊',
      telemedicine: '📱',
      insurance: '🛡️',
    };
    return icons[type] || '📋';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Auto-Sync Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🔄</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>ABDM Auto-Fetch</Text>
            <Text style={styles.infoText}>
              Automatically fetch records from linked healthcare providers via ABDM network
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Linked Providers ({providers.length})</Text>

          {loading && providers.length === 0 ? (
            <Text style={styles.loadingText}>Loading providers...</Text>
          ) : providers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔗</Text>
              <Text style={styles.emptyText}>No providers linked yet</Text>
              <Text style={styles.emptySubtext}>
                Visit healthcare facilities to link providers
              </Text>
            </View>
          ) : (
            providers.map(provider => (
              <View key={provider.providerId} style={styles.providerCard}>
                <View style={styles.providerHeader}>
                  <View style={styles.providerLeft}>
                    <Text style={styles.providerIcon}>
                      {getProviderIcon(provider.providerType)}
                    </Text>
                    <View>
                      <Text style={styles.providerName}>{provider.providerName}</Text>
                      <Text style={styles.providerType}>
                        {provider.providerType.charAt(0).toUpperCase() + provider.providerType.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.toggleSwitch,
                      provider.isEnabled && styles.toggleSwitchActive,
                    ]}
                    onPress={() => handleToggleSync(provider.providerId, provider.isEnabled)}
                  >
                    <View
                      style={[
                        styles.toggleKnob,
                        provider.isEnabled && styles.toggleKnobActive,
                      ]}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.providerStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Records Synced</Text>
                    <Text style={styles.statValue}>{provider.recordCount}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Last Sync</Text>
                    <Text style={styles.statValue}>
                      {provider.lastSyncAt
                        ? new Date(provider.lastSyncAt).toLocaleDateString()
                        : 'Never'}
                    </Text>
                  </View>
                </View>

                {provider.isEnabled && (
                  <TouchableOpacity
                    style={[styles.syncButton, syncing === provider.providerId && styles.syncButtonDisabled]}
                    onPress={() => handleManualSync(provider.providerId)}
                    disabled={syncing === provider.providerId}
                  >
                    <Text style={styles.syncButtonText}>
                      {syncing === provider.providerId ? '⏳ Syncing...' : '🔄 Sync Now'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: { fontSize: 28, color: '#000' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#000' },
  content: { flex: 1 },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoIcon: { fontSize: 32, marginRight: 12 },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 16, fontWeight: '600', color: '#1976d2', marginBottom: 4 },
  infoText: { fontSize: 14, color: '#1976d2', lineHeight: 20 },
  section: { paddingHorizontal: 16, paddingTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#000', marginBottom: 16 },
  loadingText: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 20 },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#666', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#999', textAlign: 'center' },
  providerCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  providerIcon: { fontSize: 32, marginRight: 12 },
  providerName: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 2 },
  providerType: { fontSize: 13, color: '#666' },
  toggleSwitch: {
    width: 50,
    height: 28,
    backgroundColor: '#ccc',
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: { backgroundColor: '#4CAF50' },
  toggleKnob: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  toggleKnobActive: { alignSelf: 'flex-end' },
  providerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#999', marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '600', color: '#000' },
  syncButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  syncButtonDisabled: { opacity: 0.5 },
  syncButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});
