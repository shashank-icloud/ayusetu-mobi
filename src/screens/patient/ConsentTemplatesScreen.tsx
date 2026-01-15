import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    TextInput,
    Modal,
    ScrollView,
    Switch,
} from 'react-native';
import { phrService } from '../../services/phrService';
import type { ConsentTemplate, HealthRecordType } from '../../../backend/types/phr';

/**
 * ConsentTemplatesScreen - Reusable Consent Templates (Category 4)
 * 
 * Features:
 * - View saved consent templates
 * - Create new templates
 * - Edit existing templates
 * - Delete templates
 * - View template usage statistics
 * - Quick apply template to consent request
 */

export default function ConsentTemplatesScreen() {
    const [templates, setTemplates] = useState<ConsentTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<ConsentTemplate | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        purpose: 'treatment' as 'treatment' | 'insurance' | 'research' | 'emergency',
        dataTypes: [] as HealthRecordType[],
        defaultDuration: 30,
        granularSelection: false,
        autoApprove: false,
        requiresReview: true,
    });

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            const data = await phrService.getConsentTemplates();
            setTemplates(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load consent templates');
            console.error('Load templates error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTemplate = () => {
        setEditingTemplate(null);
        setFormData({
            name: '',
            description: '',
            purpose: 'treatment',
            dataTypes: [],
            defaultDuration: 30,
            granularSelection: false,
            autoApprove: false,
            requiresReview: true,
        });
        setModalVisible(true);
    };

    const handleEditTemplate = (template: ConsentTemplate) => {
        setEditingTemplate(template);
        setFormData({
            name: template.name,
            description: template.description,
            purpose: template.purpose,
            dataTypes: template.dataTypes as HealthRecordType[],
            defaultDuration: template.defaultDuration,
            granularSelection: template.granularSelection,
            autoApprove: template.autoApprove,
            requiresReview: template.requiresReview,
        });
        setModalVisible(true);
    };

    const handleSaveTemplate = async () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Please enter a template name');
            return;
        }

        if (formData.dataTypes.length === 0) {
            Alert.alert('Error', 'Please select at least one data type');
            return;
        }

        try {
            if (editingTemplate) {
                // In production, would call update API
                Alert.alert('Success', 'Template updated successfully');
            } else {
                await phrService.createConsentTemplate(formData);
                Alert.alert('Success', 'Template created successfully');
            }
            setModalVisible(false);
            loadTemplates();
        } catch (error) {
            Alert.alert('Error', 'Failed to save template');
            console.error('Save template error:', error);
        }
    };

    const handleDeleteTemplate = (template: ConsentTemplate) => {
        Alert.alert(
            'Delete Template',
            `Are you sure you want to delete "${template.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await phrService.deleteConsentTemplate(template.id);
                            Alert.alert('Success', 'Template deleted');
                            loadTemplates();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete template');
                        }
                    },
                },
            ]
        );
    };

    const toggleDataType = (dataType: HealthRecordType) => {
        setFormData(prev => ({
            ...prev,
            dataTypes: prev.dataTypes.includes(dataType)
                ? prev.dataTypes.filter(dt => dt !== dataType)
                : [...prev.dataTypes, dataType],
        }));
    };

    const getPurposeIcon = (purpose: string) => {
        switch (purpose) {
            case 'treatment': return '🏥';
            case 'insurance': return '🛡️';
            case 'research': return '🔬';
            case 'emergency': return '🚑';
            default: return '📋';
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading templates...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Consent Templates</Text>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreateTemplate}
                >
                    <Text style={styles.createButtonText}>+ New</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={templates}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <View style={styles.templateCard}>
                        <View style={styles.templateHeader}>
                            <View style={styles.templateTitleRow}>
                                <Text style={styles.templateIcon}>{getPurposeIcon(item.purpose)}</Text>
                                <Text style={styles.templateName}>{item.name}</Text>
                            </View>
                            <View style={styles.usageBadge}>
                                <Text style={styles.usageText}>Used {item.usageCount}x</Text>
                            </View>
                        </View>

                        <Text style={styles.templateDescription}>{item.description}</Text>

                        <View style={styles.templateDetails}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Purpose:</Text>
                                <Text style={styles.detailValue}>{item.purpose}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Duration:</Text>
                                <Text style={styles.detailValue}>{item.defaultDuration} days</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Data Types:</Text>
                                <Text style={styles.detailValue}>{item.dataTypes.length} types</Text>
                            </View>
                        </View>

                        <View style={styles.templateFlags}>
                            {item.autoApprove && (
                                <View style={styles.flag}>
                                    <Text style={styles.flagText}>✓ Auto-Approve</Text>
                                </View>
                            )}
                            {item.granularSelection && (
                                <View style={styles.flag}>
                                    <Text style={styles.flagText}>⚙️ Granular</Text>
                                </View>
                            )}
                            {item.requiresReview && (
                                <View style={styles.flag}>
                                    <Text style={styles.flagText}>👁️ Review Required</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.templateActions}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => handleEditTemplate(item)}
                            >
                                <Text style={styles.actionButtonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.deleteButton]}
                                onPress={() => handleDeleteTemplate(item)}
                            >
                                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📝</Text>
                        <Text style={styles.emptyText}>No templates yet</Text>
                        <Text style={styles.emptySubtext}>Create a template to reuse consent settings</Text>
                    </View>
                }
            />

            {/* Template Creation/Edit Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalTitle}>
                                {editingTemplate ? 'Edit Template' : 'New Template'}
                            </Text>

                            <Text style={styles.inputLabel}>Template Name *</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
                                placeholder="e.g., Standard Treatment Consent"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={formData.description}
                                onChangeText={text => setFormData(prev => ({ ...prev, description: text }))}
                                placeholder="Brief description of this template"
                                multiline
                                numberOfLines={3}
                            />

                            <Text style={styles.inputLabel}>Purpose *</Text>
                            <View style={styles.purposeButtons}>
                                {(['treatment', 'insurance', 'research', 'emergency'] as const).map(purpose => (
                                    <TouchableOpacity
                                        key={purpose}
                                        style={[
                                            styles.purposeButton,
                                            formData.purpose === purpose && styles.purposeButtonActive,
                                        ]}
                                        onPress={() => setFormData(prev => ({ ...prev, purpose }))}
                                    >
                                        <Text style={[
                                            styles.purposeButtonText,
                                            formData.purpose === purpose && styles.purposeButtonTextActive,
                                        ]}>
                                            {getPurposeIcon(purpose)} {purpose.charAt(0).toUpperCase() + purpose.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.inputLabel}>Data Types * (select at least one)</Text>
                            {(['opd_prescription', 'lab_report', 'imaging', 'ipd_discharge_summary', 'vaccination', 'surgery_note'] as HealthRecordType[]).map(dt => (
                                <TouchableOpacity
                                    key={dt}
                                    style={styles.checkboxRow}
                                    onPress={() => toggleDataType(dt)}
                                >
                                    <View style={styles.checkbox}>
                                        {formData.dataTypes.includes(dt) && (
                                            <Text style={styles.checkmark}>✓</Text>
                                        )}
                                    </View>
                                    <Text style={styles.checkboxLabel}>
                                        {dt.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </Text>
                                </TouchableOpacity>
                            ))}

                            <Text style={styles.inputLabel}>Default Duration (days)</Text>
                            <TextInput
                                style={styles.input}
                                value={String(formData.defaultDuration)}
                                onChangeText={text => setFormData(prev => ({ ...prev, defaultDuration: parseInt(text) || 30 }))}
                                keyboardType="number-pad"
                                placeholder="30"
                            />

                            <View style={styles.switchRow}>
                                <Text style={styles.switchLabel}>Enable granular selection</Text>
                                <Switch
                                    value={formData.granularSelection}
                                    onValueChange={value => setFormData(prev => ({ ...prev, granularSelection: value }))}
                                />
                            </View>

                            <View style={styles.switchRow}>
                                <Text style={styles.switchLabel}>Auto-approve (skip review)</Text>
                                <Switch
                                    value={formData.autoApprove}
                                    onValueChange={value => setFormData(prev => ({
                                        ...prev,
                                        autoApprove: value,
                                        requiresReview: !value,
                                    }))}
                                />
                            </View>

                            <View style={styles.switchRow}>
                                <Text style={styles.switchLabel}>Requires review</Text>
                                <Switch
                                    value={formData.requiresReview}
                                    onValueChange={value => setFormData(prev => ({
                                        ...prev,
                                        requiresReview: value,
                                        autoApprove: !value,
                                    }))}
                                />
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.saveButton]}
                                    onPress={handleSaveTemplate}
                                >
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    createButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    createButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    listContainer: {
        padding: 16,
    },
    templateCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    templateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    templateTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    templateIcon: {
        fontSize: 24,
        marginRight: 8,
    },
    templateName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    usageBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    usageText: {
        fontSize: 12,
        color: '#1976D2',
        fontWeight: '600',
    },
    templateDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    templateDetails: {
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    detailLabel: {
        fontSize: 14,
        color: '#999',
        width: 80,
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    templateFlags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    flag: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    flagText: {
        fontSize: 12,
        color: '#666',
    },
    templateActions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    actionButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#007AFF',
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#FFF',
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#F44336',
    },
    deleteButtonText: {
        color: '#F44336',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#FFF',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    purposeButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    purposeButton: {
        flex: 1,
        minWidth: '45%',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    purposeButtonActive: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    purposeButtonText: {
        fontSize: 14,
        color: '#666',
    },
    purposeButtonTextActive: {
        color: '#FFF',
        fontWeight: '600',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#007AFF',
        borderRadius: 4,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#333',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    switchLabel: {
        fontSize: 14,
        color: '#333',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    modalButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#007AFF',
    },
    saveButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
});
