// Health Report Generator Screen - Category 13
// Create custom health reports from templates

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { dataExportService } from '../services/dataExportService';
import { ReportTemplate, ReportSection, GeneratedReport } from '../../backend/types/dataExport';

type Props = NativeStackScreenProps<RootStackParamList, 'HealthReportGenerator'>;

export default function HealthReportGeneratorScreen({ navigation }: Props) {
    const [templates, setTemplates] = useState<ReportTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
    const [reportTitle, setReportTitle] = useState('');
    const [selectedSections, setSelectedSections] = useState<string[]>([]);
    const [reportFormat, setReportFormat] = useState<'pdf' | 'json'>('pdf');
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        loadTemplates();
    }, []);

    useEffect(() => {
        if (selectedTemplate) {
            setReportTitle(selectedTemplate.name);
            setSelectedSections(
                selectedTemplate.sections
                    .filter(s => s.includeByDefault)
                    .map(s => s.id)
            );
        }
    }, [selectedTemplate]);

    const loadTemplates = async () => {
        setLoading(true);
        try {
            const data = await dataExportService.getReportTemplates();
            setTemplates(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load report templates');
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (sectionId: string) => {
        if (selectedSections.includes(sectionId)) {
            setSelectedSections(selectedSections.filter(id => id !== sectionId));
        } else {
            setSelectedSections([...selectedSections, sectionId]);
        }
    };

    const handleGenerateReport = async () => {
        if (!reportTitle.trim()) {
            Alert.alert('Error', 'Please enter a report title');
            return;
        }

        if (selectedSections.length === 0) {
            Alert.alert('Error', 'Please select at least one section');
            return;
        }

        if (!selectedTemplate) {
            Alert.alert('Error', 'Please select a template');
            return;
        }

        setGenerating(true);
        try {
            const report = await dataExportService.generateReport({
                templateId: selectedTemplate.id,
                title: reportTitle,
                format: reportFormat,
                sections: selectedSections.map(sectionId => ({
                    sectionId,
                    dataPoints: selectedTemplate.sections.find(s => s.id === sectionId)?.dataPoints || [],
                    dateRange: {
                        startDate: '2025-01-01',
                        endDate: '2026-01-15',
                    },
                })),
                includeCharts: true,
                includeSummary: true,
            });

            Alert.alert(
                'Report Generated',
                `Your ${reportFormat.toUpperCase()} report "${reportTitle}" is ready!`,
                [
                    {
                        text: 'Download',
                        onPress: () => {
                            // In production, this would open the download URL
                            Alert.alert('Download', `Downloading ${report.downloadUrl}`);
                        },
                    },
                    { text: 'OK' },
                ]
            );

            // Reset form
            setSelectedTemplate(null);
            setReportTitle('');
            setSelectedSections([]);
        } catch (error) {
            Alert.alert('Error', 'Failed to generate report. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2196f3" />
                <Text style={styles.loadingText}>Loading templates...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Health Report Generator</Text>
                <Text style={styles.subtitle}>Create custom reports from templates</Text>
            </View>

            {!selectedTemplate ? (
                /* Template Selection */
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Select Template</Text>
                    {templates.map(template => (
                        <TouchableOpacity
                            key={template.id}
                            style={styles.templateCard}
                            onPress={() => setSelectedTemplate(template)}
                        >
                            <View style={styles.templateHeader}>
                                <Text style={styles.templateIcon}>{template.icon}</Text>
                                <View style={styles.templateInfo}>
                                    <Text style={styles.templateName}>{template.name}</Text>
                                    <Text style={styles.templateDescription}>
                                        {template.description}
                                    </Text>
                                    <View style={styles.templateMeta}>
                                        <Text style={styles.templateCategory}>
                                            {template.category}
                                        </Text>
                                        <Text style={styles.templateSections}>
                                            {template.sections.length} sections
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.arrowIcon}>→</Text>
                            </View>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={styles.customTemplateButton}
                        onPress={() => {
                            Alert.alert(
                                'Custom Template',
                                'Custom template builder coming soon!'
                            );
                        }}
                    >
                        <Text style={styles.customTemplateIcon}>➕</Text>
                        <Text style={styles.customTemplateText}>Create Custom Template</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                /* Report Builder */
                <>
                    {/* Template Info */}
                    <View style={styles.section}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setSelectedTemplate(null)}
                        >
                            <Text style={styles.backButtonText}>← Change Template</Text>
                        </TouchableOpacity>
                        <View style={styles.selectedTemplate}>
                            <Text style={styles.selectedTemplateIcon}>{selectedTemplate.icon}</Text>
                            <View>
                                <Text style={styles.selectedTemplateName}>
                                    {selectedTemplate.name}
                                </Text>
                                <Text style={styles.selectedTemplateDescription}>
                                    {selectedTemplate.description}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Report Title */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Report Title</Text>
                        <TextInput
                            style={styles.titleInput}
                            value={reportTitle}
                            onChangeText={setReportTitle}
                            placeholder="Enter report title"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Section Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Select Sections</Text>
                        {selectedTemplate.sections.map(section => (
                            <TouchableOpacity
                                key={section.id}
                                style={styles.sectionCard}
                                onPress={() => toggleSection(section.id)}
                            >
                                <View style={styles.sectionLeft}>
                                    <View
                                        style={[
                                            styles.sectionCheckbox,
                                            selectedSections.includes(section.id) &&
                                                styles.sectionCheckboxChecked,
                                        ]}
                                    >
                                        {selectedSections.includes(section.id) && (
                                            <Text style={styles.sectionCheckmark}>✓</Text>
                                        )}
                                    </View>
                                    <View style={styles.sectionInfo}>
                                        <Text style={styles.sectionName}>{section.title}</Text>
                                        <Text style={styles.sectionType}>
                                            {section.type.replace('_', ' ')} • {section.dataPoints.length} data points
                                        </Text>
                                        {section.chartType && (
                                            <View style={styles.chartBadge}>
                                                <Text style={styles.chartBadgeText}>
                                                    📊 {section.chartType} chart
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Format Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Output Format</Text>
                        <View style={styles.formatRow}>
                            <TouchableOpacity
                                style={[
                                    styles.formatOption,
                                    reportFormat === 'pdf' && styles.formatOptionSelected,
                                ]}
                                onPress={() => setReportFormat('pdf')}
                            >
                                <Text style={styles.formatOptionIcon}>📄</Text>
                                <Text
                                    style={[
                                        styles.formatOptionText,
                                        reportFormat === 'pdf' && styles.formatOptionTextSelected,
                                    ]}
                                >
                                    PDF
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.formatOption,
                                    reportFormat === 'json' && styles.formatOptionSelected,
                                ]}
                                onPress={() => setReportFormat('json')}
                            >
                                <Text style={styles.formatOptionIcon}>📦</Text>
                                <Text
                                    style={[
                                        styles.formatOptionText,
                                        reportFormat === 'json' && styles.formatOptionTextSelected,
                                    ]}
                                >
                                    JSON
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Generate Button */}
                    <TouchableOpacity
                        style={[styles.generateButton, generating && styles.generateButtonDisabled]}
                        onPress={handleGenerateReport}
                        disabled={generating}
                    >
                        {generating ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.generateButtonIcon}>📊</Text>
                                <Text style={styles.generateButtonText}>Generate Report</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Preview Info */}
                    <View style={styles.previewBox}>
                        <Text style={styles.previewIcon}>ℹ️</Text>
                        <View style={styles.previewContent}>
                            <Text style={styles.previewTitle}>Report Preview</Text>
                            <Text style={styles.previewText}>
                                • Sections: {selectedSections.length}{'\n'}
                                • Data Points: {selectedSections.reduce((sum, id) => 
                                    sum + (selectedTemplate.sections.find(s => s.id === id)?.dataPoints.length || 0), 0
                                )}{'\n'}
                                • Format: {reportFormat.toUpperCase()}{'\n'}
                                • Charts: Included
                            </Text>
                        </View>
                    </View>
                </>
            )}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    templateCard: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 16,
        marginBottom: 12,
        backgroundColor: '#fafafa',
    },
    templateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    templateIcon: {
        fontSize: 40,
        marginRight: 12,
    },
    templateInfo: {
        flex: 1,
    },
    templateName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    templateDescription: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
    },
    templateMeta: {
        flexDirection: 'row',
        gap: 12,
    },
    templateCategory: {
        fontSize: 12,
        color: '#2196f3',
        textTransform: 'uppercase',
        fontWeight: '500',
    },
    templateSections: {
        fontSize: 12,
        color: '#999',
    },
    arrowIcon: {
        fontSize: 24,
        color: '#2196f3',
    },
    customTemplateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#2196f3',
        borderStyle: 'dashed',
        marginTop: 8,
    },
    customTemplateIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    customTemplateText: {
        fontSize: 16,
        color: '#2196f3',
        fontWeight: '600',
    },
    backButton: {
        marginBottom: 16,
    },
    backButtonText: {
        fontSize: 14,
        color: '#2196f3',
        fontWeight: '500',
    },
    selectedTemplate: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#e3f2fd',
        borderRadius: 12,
    },
    selectedTemplateIcon: {
        fontSize: 40,
        marginRight: 12,
    },
    selectedTemplateName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1976d2',
        marginBottom: 4,
    },
    selectedTemplateDescription: {
        fontSize: 13,
        color: '#1976d2',
    },
    titleInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fff',
    },
    sectionCard: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 12,
        marginBottom: 8,
        backgroundColor: '#fafafa',
    },
    sectionLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    sectionCheckbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#ccc',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionCheckboxChecked: {
        backgroundColor: '#2196f3',
        borderColor: '#2196f3',
    },
    sectionCheckmark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionInfo: {
        flex: 1,
    },
    sectionName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    sectionType: {
        fontSize: 12,
        color: '#666',
        textTransform: 'capitalize',
    },
    chartBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 6,
    },
    chartBadgeText: {
        fontSize: 11,
        color: '#1976d2',
    },
    formatRow: {
        flexDirection: 'row',
        gap: 12,
    },
    formatOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        backgroundColor: '#fafafa',
    },
    formatOptionSelected: {
        borderColor: '#2196f3',
        backgroundColor: '#e3f2fd',
    },
    formatOptionIcon: {
        fontSize: 24,
        marginRight: 8,
    },
    formatOptionText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    formatOptionTextSelected: {
        color: '#1976d2',
        fontWeight: '600',
    },
    generateButton: {
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
    generateButtonDisabled: {
        backgroundColor: '#ccc',
    },
    generateButtonIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    generateButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    previewBox: {
        flexDirection: 'row',
        backgroundColor: '#fff3cd',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#ffc107',
    },
    previewIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    previewContent: {
        flex: 1,
    },
    previewTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#856404',
        marginBottom: 6,
    },
    previewText: {
        fontSize: 12,
        color: '#856404',
        lineHeight: 18,
    },
});
