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
import { complianceService } from '../services/complianceService';
import type { ABDMGatewayLog } from '../services/complianceService';

const ABDMLogsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<ABDMGatewayLog[]>([]);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');

  useEffect(() => {
    loadLogs();
  }, [filter]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await complianceService.getABDMGatewayLogs({
        userId: 'user-001',
        status: filter === 'all' ? undefined : filter,
      });
      setLogs(data);
    } catch (error) {
      console.error('Error loading ABDM logs:', error);
      Alert.alert('Error', 'Failed to load ABDM logs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'consent-request': return '📝';
      case 'data-transfer': return '📤';
      case 'link-records': return '🔗';
      case 'discovery': return '🔍';
      case 'authentication': return '🔐';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'failed': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading ABDM logs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Bar */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterChipText, filter === 'all' && styles.filterChipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'success' && styles.filterChipActive]}
          onPress={() => setFilter('success')}
        >
          <Text style={[styles.filterChipText, filter === 'success' && styles.filterChipTextActive]}>
            Success
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'failed' && styles.filterChipActive]}
          onPress={() => setFilter('failed')}
        >
          <Text style={[styles.filterChipText, filter === 'failed' && styles.filterChipTextActive]}>
            Failed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {logs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔗</Text>
            <Text style={styles.emptyText}>No ABDM logs found</Text>
            <Text style={styles.emptySubtext}>
              {filter === 'all'
                ? 'ABDM gateway interactions will appear here'
                : `No ${filter} transactions`}
            </Text>
          </View>
        ) : (
          logs.map((log) => (
            <View key={log.id} style={styles.logCard}>
              <View style={styles.logHeader}>
                <View style={styles.logHeaderLeft}>
                  <Text style={styles.requestIcon}>{getRequestTypeIcon(log.requestType)}</Text>
                  <View style={styles.logHeaderInfo}>
                    <Text style={styles.requestType}>
                      {log.requestType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </Text>
                    <Text style={styles.transactionId}>TXN: {log.transactionId}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(log.status) },
                  ]}
                >
                  <Text style={styles.statusBadgeText}>{log.status.toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.logBody}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Direction:</Text>
                  <Text style={styles.infoValue}>
                    {log.direction === 'inbound' ? '📥 Inbound' : '📤 Outbound'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Gateway:</Text>
                  <Text style={styles.infoValue}>{log.gatewayId}</Text>
                </View>

                {log.hipId && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>HIP:</Text>
                    <Text style={styles.infoValue}>{log.hipId}</Text>
                  </View>
                )}

                {log.hiuId && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>HIU:</Text>
                    <Text style={styles.infoValue}>{log.hiuId}</Text>
                  </View>
                )}

                {log.responseTime && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Response time:</Text>
                    <Text style={styles.infoValue}>{log.responseTime}ms</Text>
                  </View>
                )}

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Time:</Text>
                  <Text style={styles.infoValue}>{formatDate(log.timestamp)}</Text>
                </View>

                {log.status === 'failed' && log.errorCode && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorCode}>Error: {log.errorCode}</Text>
                    {log.errorMessage && (
                      <Text style={styles.errorMessage}>{log.errorMessage}</Text>
                    )}
                  </View>
                )}

                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <View style={styles.metadataBox}>
                    <Text style={styles.metadataTitle}>Details:</Text>
                    {Object.entries(log.metadata).map(([key, value]) => (
                      <Text key={key} style={styles.metadataText}>
                        • {key}: {String(value)}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Info Footer */}
      <View style={styles.infoFooter}>
        <Text style={styles.infoText}>
          All ABDM gateway interactions are logged. {logs.length} transaction(s) shown.
        </Text>
      </View>
    </View>
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
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterChipActive: {
    backgroundColor: '#3b82f6',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  logCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  logHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  requestIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  logHeaderInfo: {
    flex: 1,
  },
  requestType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  transactionId: {
    fontSize: 11,
    color: '#9ca3af',
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  logBody: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 13,
    color: '#9ca3af',
  },
  infoValue: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  errorCode: {
    fontSize: 13,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 12,
    color: '#991b1b',
  },
  metadataBox: {
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  metadataTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  metadataText: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
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
  infoFooter: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#bfdbfe',
  },
  infoText: {
    fontSize: 12,
    color: '#1e3a8a',
    textAlign: 'center',
  },
});

export default ABDMLogsScreen;
