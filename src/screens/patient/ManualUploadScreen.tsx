import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { recordIngestionService, RecordFolder } from '../../services/recordIngestionService';

type Props = NativeStackScreenProps<RootStackParamList, 'ManualUpload'>;

export default function ManualUploadScreen({ navigation }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<Array<{ uri: string; name: string; type: string }>>([]);
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);

  const handlePickFiles = () => {
    // In real app, use react-native-document-picker or expo-document-picker
    Alert.alert(
      'Pick Files',
      'Choose upload source',
      [
        {
          text: 'PDF',
          onPress: () => {
            setSelectedFiles([
              ...selectedFiles,
              {
                uri: `file:///mock/document_${Date.now()}.pdf`,
                name: `Document_${Date.now()}.pdf`,
                type: 'application/pdf',
              },
            ]);
          },
        },
        {
          text: 'Image',
          onPress: () => {
            setSelectedFiles([
              ...selectedFiles,
              {
                uri: `file:///mock/image_${Date.now()}.jpg`,
                name: `Image_${Date.now()}.jpg`,
                type: 'image/jpeg',
              },
            ]);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleCamera = () => {
    // In real app, use react-native-camera or expo-camera
    Alert.alert('Camera', 'Open camera to scan document');
    setSelectedFiles([
      ...selectedFiles,
      {
        uri: `file:///mock/camera_${Date.now()}.jpg`,
        name: `Camera_${Date.now()}.jpg`,
        type: 'image/jpeg',
      },
    ]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert('Error', 'Please select at least one file to upload');
      return;
    }

    setUploading(true);
    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      
      if (selectedFiles.length === 1) {
        await recordIngestionService.uploadFile(selectedFiles[0], {
          tags: tagList,
          folder: selectedFolder,
          notes,
        });
      } else {
        await recordIngestionService.bulkUpload(selectedFiles);
      }

      Alert.alert(
        'Success',
        `${selectedFiles.length} file(s) uploaded successfully!\n\nProcessing in background...`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('RecordManagement'),
          },
        ]
      );

      setSelectedFiles([]);
      setTags('');
      setNotes('');
      setSelectedFolder(undefined);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Records</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Upload Method</Text>

          <View style={styles.uploadOptions}>
            <TouchableOpacity style={styles.uploadOption} onPress={handlePickFiles}>
              <Text style={styles.uploadIcon}>📄</Text>
              <Text style={styles.uploadLabel}>PDF / Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadOption} onPress={handleCamera}>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadLabel}>Camera Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadOption}
              onPress={() => Alert.alert('Bulk Upload', 'Select multiple files')}
            >
              <Text style={styles.uploadIcon}>📂</Text>
              <Text style={styles.uploadLabel}>Bulk Upload</Text>
            </TouchableOpacity>
          </View>
        </View>

        {selectedFiles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Files ({selectedFiles.length})</Text>
            {selectedFiles.map((file, index) => (
              <View key={index} style={styles.fileItem}>
                <Text style={styles.fileIcon}>
                  {file.type.includes('pdf') ? '📄' : '🖼️'}
                </Text>
                <Text style={styles.fileName} numberOfLines={1}>
                  {file.name}
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                >
                  <Text style={styles.removeButton}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Metadata (Optional)</Text>

          <Text style={styles.label}>Tags (comma separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., lab, blood test, routine"
            value={tags}
            onChangeText={setTags}
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add any notes about this record"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Folder</Text>
          <TouchableOpacity
            style={styles.folderPicker}
            onPress={() => Alert.alert('Select Folder', 'Choose a folder to organize this record')}
          >
            <Text style={styles.folderPickerText}>
              {selectedFolder || 'No folder selected'}
            </Text>
            <Text>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Your files will be processed automatically using OCR and AI to extract text,
            generate summaries, and detect duplicates.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.uploadButton, (selectedFiles.length === 0 || uploading) && styles.uploadButtonDisabled]}
          onPress={handleUpload}
          disabled={selectedFiles.length === 0 || uploading}
        >
          <Text style={styles.uploadButtonText}>
            {uploading ? '⏳ Uploading...' : '📤 Upload Files'}
          </Text>
        </TouchableOpacity>
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
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#000', marginBottom: 16 },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadOption: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  uploadIcon: { fontSize: 36, marginBottom: 8 },
  uploadLabel: { fontSize: 13, color: '#666', textAlign: 'center' },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  fileIcon: { fontSize: 24, marginRight: 12 },
  fileName: { flex: 1, fontSize: 14, color: '#000' },
  removeButton: { fontSize: 20, color: '#F44336', padding: 4 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  folderPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
  },
  folderPickerText: { fontSize: 14, color: '#666' },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fff3cd',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoIcon: { fontSize: 24, marginRight: 12 },
  infoText: { flex: 1, fontSize: 13, color: '#856404', lineHeight: 20 },
  uploadButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    margin: 16,
  },
  uploadButtonDisabled: { opacity: 0.5 },
  uploadButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
