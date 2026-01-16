import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import {
  recordIngestionService,
  UploadedRecord,
  RecordFolder,
} from '../../services/recordIngestionService';

type Props = NativeStackScreenProps<RootStackParamList, 'RecordManagement'>;

export default function RecordManagementScreen({ navigation }: Props) {
  const [records, setRecords] = useState<UploadedRecord[]>([]);
  const [folders, setFolders] = useState<RecordFolder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsData, foldersData] = await Promise.all([
        recordIngestionService.getUploadedRecords(),
        recordIngestionService.getFolders(),
      ]);
      setRecords(recordsData);
      setFolders(foldersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await fetchData();
      return;
    }

    try {
      const results = await recordIngestionService.searchRecords(searchQuery);
      setRecords(results);
    } catch (error) {
      Alert.alert('Error', 'Search failed');
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this uploaded record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await recordIngestionService.deleteUploadedRecord(recordId);
              setRecords(records.filter(r => r.id !== recordId));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete record');
            }
          },
        },
      ]
    );
  };

  const handleDetectDuplicates = async () => {
    try {
      const duplicates = await recordIngestionService.detectDuplicates();
      if (duplicates.length === 0) {
        Alert.alert('No Duplicates', 'No duplicate records found');
      } else {
        Alert.alert(
          'Duplicates Found',
          `Found ${duplicates.length} potential duplicate(s)`
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to detect duplicates');
    }
  };

  const filteredRecords = selectedFolder
    ? records.filter(r => r.folder === selectedFolder)
    : records;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'processing': return '#FF9800';
      case 'failed': return '#F44336';
      default: return '#999';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Record Management</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ManualUpload')}>
          <Text style={styles.addButton}>+ Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search records, OCR text, keywords..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <ScrollView horizontal style={styles.actionsRow} showsHorizontalScrollIndicator={false}>
        <TouchableOpacity style={styles.actionChip} onPress={handleDetectDuplicates}>
          <Text style={styles.actionChipText}>🔍 Detect Duplicates</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionChip}
          onPress={() => Alert.alert('Create Folder', 'Enter folder name')}
        >
          <Text style={styles.actionChipText}>📁 New Folder</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionChip}
          onPress={() => setSelectedFolder(null)}
        >
          <Text style={styles.actionChipText}>📋 All Records</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Folders */}
      {folders.length > 0 && (
        <ScrollView horizontal style={styles.foldersRow} showsHorizontalScrollIndicator={false}>
          {folders.map(folder => (
            <TouchableOpacity
              key={folder.id}
              style={[
                styles.folderChip,
                selectedFolder === folder.id && styles.folderChipActive,
              ]}
              onPress={() => setSelectedFolder(folder.id)}
            >
              <View style={[styles.folderDot, { backgroundColor: folder.color }]} />
              <Text style={styles.folderName}>{folder.name}</Text>
              <Text style={styles.folderCount}>({folder.recordCount})</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.section}>
          {loading && records.length === 0 ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : filteredRecords.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📄</Text>
              <Text style={styles.emptyText}>No records yet</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('ManualUpload')}
              >
                <Text style={styles.emptyButtonText}>Upload Your First Record</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredRecords.map(record => (
              <View key={record.id} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <View style={styles.recordLeft}>
                    <Text style={styles.recordIcon}>
                      {record.fileType === 'pdf' ? '📄' : '🖼️'}
                    </Text>
                    <View style={styles.recordInfo}>
                      <Text style={styles.recordName} numberOfLines={1}>
                        {record.fileName}
                      </Text>
                      <Text style={styles.recordMeta}>
                        {new Date(record.uploadedAt).toLocaleDateString()} • {Math.round(record.fileSize / 1024)} KB
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(record.processingStatus) }]}>
                    <Text style={styles.statusText}>
                      {record.processingStatus === 'completed'
                        ? '✓'
                        : record.processingStatus === 'processing'
                          ? '⏳'
                          : '✕'}
                    </Text>
                  </View>
                </View>

                {record.processingStatus === 'completed' && record.summary && (
                  <Text style={styles.recordSummary} numberOfLines={2}>
                    💡 {record.summary}
                  </Text>
                )}

                {record.tags && record.tags.length > 0 && (
                  <View style={styles.tagsRow}>
                    {record.tags.map((tag, idx) => (
                      <View key={idx} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.recordActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Alert.alert('View', `Open ${record.fileName}`)}
                  >
                    <Text style={styles.actionButtonText}>👁️ View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Edit', 'Edit metadata')}
                  >
                    <Text style={styles.actionButtonText}>✏️ Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteRecord(record.id)}
                  >
                    <Text style={[styles.actionButtonText, { color: '#F44336' }]}>🗑️ Delete</Text>
                  </TouchableOpacity>
                </View>
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
  addButton: { fontSize: 16, fontWeight: '600', color: '#2196F3' },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  searchButton: { marginLeft: 8, justifyContent: 'center', paddingHorizontal: 12 },
  searchButtonText: { fontSize: 20 },
  actionsRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actionChip: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  actionChipText: { fontSize: 13, color: '#1976d2', fontWeight: '500' },
  foldersRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  folderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  folderChipActive: { backgroundColor: '#e0e0e0' },
  folderDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  folderName: { fontSize: 13, color: '#000', fontWeight: '500' },
  folderCount: { fontSize: 12, color: '#666', marginLeft: 4 },
  content: { flex: 1 },
  section: { padding: 16 },
  loadingText: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 20 },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#666', marginBottom: 16 },
  emptyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  recordCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  recordIcon: { fontSize: 28, marginRight: 12 },
  recordInfo: { flex: 1 },
  recordName: { fontSize: 15, fontWeight: '600', color: '#000', marginBottom: 2 },
  recordMeta: { fontSize: 12, color: '#999' },
  statusBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: { fontSize: 14, color: '#fff', fontWeight: 'bold' },
  recordSummary: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  tag: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: { fontSize: 11, color: '#2e7d32', fontWeight: '500' },
  recordActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: { paddingHorizontal: 8, paddingVertical: 4 },
  actionButtonText: { fontSize: 13, color: '#2196F3', fontWeight: '500' },
});
