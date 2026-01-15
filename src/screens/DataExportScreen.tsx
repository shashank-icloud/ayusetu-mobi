// Data Export Screen - Category 13
// Export health records in multiple formats (FHIR, PDF, CSV, JSON)

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { dataExportService } from '../services/dataExportService';
import { ExportFormat, RecordType, ExportHistory } from '../../backend/types/dataExport';

type Props = NativeStackScreenProps<RootStackParamList, 'DataExport'>;

export default function DataExportScreen({ navigation }: Props) {
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
    const [selectedTypes, setSelectedTypes] = useState<RecordType[]>(['all']);
    const [startDate, setStartDate] = useState('2025-01-01');
    const [endDate, setEndDate] = useState('2026-01-15');
    const [includeAttachments, setIncludeAttachments] = useState(true);
    const [loading, setLoading] = useState(false);
    const [recentExports, setRecentExports] = useState<ExportHistory[]>([]);

    useEffect(() => {
        loadRecentExports();
    }, []);

    const loadRecentExports = async () => {
        try {
            const exports = await dataExportService.getExportHistory(3);
            setRecentExports(exports);
        } catch (error) {
            console.error('Failed to load recent exports:', error);
        }
    };

    const toggleRecordType = (type: RecordType) => {
        if (type === 'all') {
            setSelectedTypes(['all']);
        } else {
            const filtered = selectedTypes.filter(t => t !== 'all');
            if (filtered.includes(type)) {
                const newTypes = filtered.filter(t => t !== type);
                setSelectedTypes(newTypes.length > 0 ? newTypes : ['all']);
            } else {
                setSelectedTypes([...filtered, type]);
            }
        }
    };

    const handleExport = async () => {
        if (selectedTypes.length === 0) {
            Alert.alert('Error', 'Please select at least one record type');
            return;
        }

        setLoading(true);
        try {
            const exportRequest = await dataExportService.requestExport({
                format: selectedFormat,
                recordTypes: selectedTypes,
                dateRange: { startDate, endDate },
                includeAttachments,
            });

            Alert.alert(
                'Export Started',
                `Your ${selectedFormat.toUpperCase()} export is being processed. Check Export History for status.`,
                [
                    {
                        text: 'View History',
                        onPress: () => navigation.navigate('ExportHistory'),
                    },
                    { text: 'OK' },
                ]
            );

            await loadRecentExports();
        } catch (error) {
            Alert.alert('Export Failed', 'Unable to start export. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formats: { format: ExportFormat; label: string; icon: string; description: string }[] = [
        { format: 'fhir', label: 'FHIR', icon: '🏥', description: 'ABDM compliant format' },
        { format: 'pdf', label: 'PDF', icon: '📄', description: 'Human readable document' },
        { format: 'csv', label: 'CSV', icon: '📊', description: 'Spreadsheet format' },
        { format: 'json', label: 'JSON', icon: '📦', description: 'Raw data format' },
    ];

    const recordTypes: { type: RecordType; label: string; icon: string }[] = [
        { type: 'all', label: 'All Records', icon: '📋' },
        { type: 'medical_records', label: 'Medical Records', icon: '🩺' },
        { type: 'prescriptions', label: 'Prescriptions', icon: '💊' },
        { type: 'lab_results', label: 'Lab Results', icon: '🧪' },
        { type: 'imaging', label: 'Imaging', icon: '🔬' },
        { type: 'appointments', label: 'Appointments', icon: '📅' },
        { type: 'immunizations', label: 'Immunizations', icon: '💉' },
        { type: 'care_plans', label: 'Care Plans', icon: '📝' },
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Export Health Data</Text>
                <Text style={styles.subtitle}>Download your health records in your preferred format</Text>
            </View>

            {/* Format Selection */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Export Format</Text>
                <View style={styles.formatGrid}>
                    {formats.map(({ format, label, icon, description }) => (
                        <TouchableOpacity
                            key={format}
                            style={[
                                styles.formatCard,
                                selectedFormat === format && styles.formatCardSelected,
                            ]}
                            onPress={() => setSelectedFormat(format)}
                        >
                            <Text style={styles.formatIcon}>{icon}</Text>
                            <Text style={styles.formatLabel}>{label}</Text>
                            <Text style={styles.formatDescription}>{description}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Record Type Selection */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Records</Text>
                <View style={styles.typeGrid}>
                    {recordTypes.map(({ type, label, icon }) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.typeChip,
                                selectedTypes.includes(type) && styles.typeChipSelected,
                            ]}
                            onPress={() => toggleRecordType(type)}
                        >
                            <Text style={styles.typeIcon}>{icon}</Text>
                            <Text
                                style={[
                                    styles.typeLabel,
                                    selectedTypes.includes(type) && styles.typeLabelSelected,
                                ]}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Date Range */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Date Range</Text>
                <View style={styles.dateRange}>
                    <View style={styles.dateInput}>
                        <Text style={styles.dateLabel}>From</Text>
                        <Text style={styles.dateValue}>{startDate}</Text>
                    </View>
                    <Text style={styles.dateSeparator}>→</Text>
                    <View style={styles.dateInput}>
                        <Text style={styles.dateLabel}>To</Text>
                        <Text style={styles.dateValue}>{endDate}</Text>
                    </View>
                </View>
            </View>

            {/* Options */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Export Options</Text>
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => setIncludeAttachments(!includeAttachments)}
                >
                    <View style={styles.optionLeft}>
                        <Text style={styles.optionIcon}>📎</Text>
                        <View>
                            <Text style={styles.optionTitle}>Include Attachments</Text>
                            <Text style={styles.optionSubtitle}>Images, PDFs, and documents</Text>
                        </View>
                    </View>
                    <View
                        style={[
                            styles.checkbox,
                            includeAttachments && styles.checkboxChecked,
                        ]}
                    >
                        {includeAttachments && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                </TouchableOpacity>
            </View>

            {/* Recent Exports */}
            {recentExports.length > 0 && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Exports</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ExportHistory')}>
                            <Text style={styles.viewAllLink}>View All →</Text>
                        </TouchableOpacity>
                    </View>
                    {recentExports.map(exp => (
                        <View key={exp.id} style={styles.exportCard}>
                            <View style={styles.exportHeader}>
                                <Text style={styles.exportFormat}>{exp.format.toUpperCase()}</Text>
                                <Text
                                    style={[
                                        styles.exportStatus,
                                        exp.status === 'completed' && styles.statusCompleted,
                                        exp.status === 'expired' && styles.statusExpired,
                                        exp.status === 'processing' && styles.statusProcessing,
                                    ]}
                                >
                                    {exp.status}
                                </Text>
                            </View>
                            <Text style={styles.exportDate}>
                                {new Date(exp.createdAt).toLocaleDateString('en-IN')}
                            </Text>
                            {exp.fileSize && (
                                <Text style={styles.exportSize}>
                                    {(exp.fileSize / 1024 / 1024).toFixed(2)} MB
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* Export Button */}
            <TouchableOpacity
                style={[styles.exportButton, loading && styles.exportButtonDisabled]}
                onPress={handleExport}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <>
                        <Text style={styles.exportButtonIcon}>📥</Text>
                        <Text style={styles.exportButtonText}>Start Export</Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Info */}
            <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>ℹ️</Text>
                <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>Export Guidelines</Text>
                    <Text style={styles.infoText}>
                        • Exports are available for 7 days{'\n'}
                        • FHIR format is ABDM compliant{'\n'}
                        • PDF exports are password protected{'\n'}
                        • Large exports may take a few minutes
                    </Text>
                </View>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    viewAllLink: {
        fontSize: 14,
        color: '#2196f3',
        fontWeight: '500',
    },
    formatGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    formatCard: {
        width: '47%',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        backgroundColor: '#fafafa',
        alignItems: 'center',
    },
    formatCardSelected: {
        borderColor: '#2196f3',
        backgroundColor: '#e3f2fd',
    },
    formatIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    formatLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    formatDescription: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    typeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    typeChipSelected: {
        backgroundColor: '#2196f3',
        borderColor: '#2196f3',
    },
    typeIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    typeLabel: {
        fontSize: 14,
        color: '#333',
    },
    typeLabelSelected: {
        color: '#fff',
        fontWeight: '500',
    },
    dateRange: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateInput: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    dateLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    dateValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    dateSeparator: {
        fontSize: 18,
        color: '#999',
        marginHorizontal: 12,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    optionTitle: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    optionSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#2196f3',
        borderColor: '#2196f3',
    },
    checkmark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    exportCard: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        marginBottom: 8,
    },
    exportHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    exportFormat: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    exportStatus: {
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'uppercase',
    },
    statusCompleted: {
        color: '#4caf50',
    },
    statusExpired: {
        color: '#999',
    },
    statusProcessing: {
        color: '#ff9800',
    },
    exportDate: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    exportSize: {
        fontSize: 12,
        color: '#666',
    },
    exportButton: {
        flexDirection: 'row',
        backgroundColor: '#2196f3',
        marginHorizontal: 16,
        marginTop: 24,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    exportButtonDisabled: {
        backgroundColor: '#ccc',
    },
    exportButtonIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    exportButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#e3f2fd',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#2196f3',
    },
    infoIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1976d2',
        marginBottom: 6,
    },
    infoText: {
        fontSize: 12,
        color: '#1976d2',
        lineHeight: 18,
    },
});
