import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Switch,
    TextInput,
    Modal,
} from 'react-native';
import { phrService } from '../../services/phrService';
import type {
    EmergencyAccess,
    EmergencyContact,
    HealthRecordType,
} from '../../../backend/types/phr';

/**
 * EmergencyAccessScreen - Emergency Break-Glass Access (Category 4)
 * 
 * Features:
 * - Configure emergency access settings
 * - Manage emergency contacts
 * - Set data access levels
 * - Auto-expiry configuration
 * - OTP requirement toggle
 * - View emergency access audit trail
 * - Trigger emergency access (for testing)
 */

export default function EmergencyAccessScreen() {
    const [config, setConfig] = useState<EmergencyAccess | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [addContactModalVisible, setAddContactModalVisible] = useState(false);
    const [triggerModalVisible, setTriggerModalVisible] = useState(false);
    const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);

    const [newContact, setNewContact] = useState({
        name: '',
        relationship: '',
        phone: '',
        email: '',
        canAccessEmergencyData: true,
    });

    const [triggerReason, setTriggerReason] = useState('');

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            setLoading(true);
            const data = await phrService.getEmergencyAccessConfig();
            setConfig(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load emergency access settings');
            console.error('Load emergency config error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveConfig = async (updates: Partial<EmergencyAccess>) => {
        try {
            setSaving(true);
            const updated = await phrService.updateEmergencyAccessConfig(updates);
            setConfig(updated);
            Alert.alert('Success', 'Emergency access settings updated');
        } catch (error) {
            Alert.alert('Error', 'Failed to update settings');
            console.error('Save emergency config error:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddContact = () => {
        if (!newContact.name.trim() || !newContact.phone.trim()) {
            Alert.alert('Error', 'Please enter name and phone number');
            return;
        }

        if (!config) return;

        const contact: EmergencyContact = {
            id: `ec-${Date.now()}`,
            ...newContact,
        };

        handleSaveConfig({
            emergencyContacts: [...config.emergencyContacts, contact],
        });

        setNewContact({
            name: '',
            relationship: '',
            phone: '',
            email: '',
            canAccessEmergencyData: true,
        });
        setAddContactModalVisible(false);
    };

    const handleRemoveContact = (contactId: string) => {
        if (!config) return;

        Alert.alert(
            'Remove Contact',
            'Are you sure you want to remove this emergency contact?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        handleSaveConfig({
                            emergencyContacts: config.emergencyContacts.filter(c => c.id !== contactId),
                        });
                    },
                },
            ]
        );
    };

    const handleTriggerEmergency = async () => {
        if (!selectedContact || !triggerReason.trim()) {
            Alert.alert('Error', 'Please select a contact and provide a reason');
            return;
        }

        try {
            await phrService.triggerEmergencyAccess(selectedContact.id, triggerReason);
            Alert.alert(
                'Emergency Access Granted',
                `${selectedContact.name} now has temporary access to your emergency health data. Access will auto-expire in ${config?.expiryHours || 24} hours.`,
            );
            setTriggerModalVisible(false);
            setTriggerReason('');
            setSelectedContact(null);
            loadConfig();
        } catch (error) {
            Alert.alert('Error', 'Failed to grant emergency access');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading emergency access settings...</Text>
            </View>
        );
    }

    if (!config) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Failed to load settings</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Warning Banner */}
                <View style={styles.warningBanner}>
                    <Text style={styles.warningIcon}>🚑</Text>
                    <View style={styles.warningTextContainer}>
                        <Text style={styles.warningTitle}>Emergency Break-Glass Access</Text>
                        <Text style={styles.warningText}>
                            Configure trusted contacts who can access your health data in emergencies
                        </Text>
                    </View>
                </View>

                {/* Master Toggle */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Enable Emergency Access</Text>
                        <Switch
                            value={config.enabled}
                            onValueChange={value => handleSaveConfig({ enabled: value })}
                            disabled={saving}
                        />
                    </View>
                    <Text style={styles.sectionSubtext}>
                        When enabled, emergency contacts can request temporary access to your health data
                    </Text>
                </View>

                {config.enabled && (
                    <>
                        {/* Access Level */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Access Level</Text>
                            <View style={styles.accessLevelButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.accessLevelButton,
                                        config.accessLevel === 'basic' && styles.accessLevelButtonActive,
                                    ]}
                                    onPress={() => handleSaveConfig({ accessLevel: 'basic' })}
                                    disabled={saving}
                                >
                                    <Text style={[
                                        styles.accessLevelButtonText,
                                        config.accessLevel === 'basic' && styles.accessLevelButtonTextActive,
                                    ]}>
                                        Basic
                                    </Text>
                                    <Text style={styles.accessLevelSubtext}>
                                        Blood group, allergies, current medications
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.accessLevelButton,
                                        config.accessLevel === 'full' && styles.accessLevelButtonActive,
                                    ]}
                                    onPress={() => handleSaveConfig({ accessLevel: 'full' })}
                                    disabled={saving}
                                >
                                    <Text style={[
                                        styles.accessLevelButtonText,
                                        config.accessLevel === 'full' && styles.accessLevelButtonTextActive,
                                    ]}>
                                        Full
                                    </Text>
                                    <Text style={styles.accessLevelSubtext}>
                                        All health records
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Auto-Expiry */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Auto-Expiry</Text>
                                <Switch
                                    value={config.autoExpiry}
                                    onValueChange={value => handleSaveConfig({ autoExpiry: value })}
                                    disabled={saving}
                                />
                            </View>
                            {config.autoExpiry && (
                                <View style={styles.expiryInput}>
                                    <Text style={styles.inputLabel}>Expiry Hours:</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={String(config.expiryHours)}
                                        onChangeText={text => {
                                            const hours = parseInt(text) || 24;
                                            handleSaveConfig({ expiryHours: hours });
                                        }}
                                        keyboardType="number-pad"
                                        placeholder="24"
                                    />
                                    <Text style={styles.inputUnit}>hours</Text>
                                </View>
                            )}
                        </View>

                        {/* OTP Requirement */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Require OTP Verification</Text>
                                <Switch
                                    value={config.requiresOTP}
                                    onValueChange={value => handleSaveConfig({ requiresOTP: value })}
                                    disabled={saving}
                                />
                            </View>
                            <Text style={styles.sectionSubtext}>
                                Contact must verify via OTP before accessing data
                            </Text>
                        </View>

                        {/* Emergency Contacts */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Emergency Contacts</Text>
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => setAddContactModalVisible(true)}
                                >
                                    <Text style={styles.addButtonText}>+ Add</Text>
                                </TouchableOpacity>
                            </View>

                            {config.emergencyContacts.map(contact => (
                                <View key={contact.id} style={styles.contactCard}>
                                    <View style={styles.contactHeader}>
                                        <Text style={styles.contactName}>{contact.name}</Text>
                                        {contact.canAccessEmergencyData && (
                                            <View style={styles.activeBadge}>
                                                <Text style={styles.activeBadgeText}>✓ Active</Text>
                                            </View>
                                        )}
                                    </View>

                                    {contact.relationship && (
                                        <Text style={styles.contactDetail}>👤 {contact.relationship}</Text>
                                    )}
                                    <Text style={styles.contactDetail}>📞 {contact.phone}</Text>
                                    {contact.email && (
                                        <Text style={styles.contactDetail}>✉️ {contact.email}</Text>
                                    )}

                                    {contact.accessGrantedDate && (
                                        <View style={styles.accessInfo}>
                                            <Text style={styles.accessInfoText}>
                                                Access granted until {contact.accessExpiryDate}
                                            </Text>
                                        </View>
                                    )}

                                    <View style={styles.contactActions}>
                                        <TouchableOpacity
                                            style={styles.triggerButton}
                                            onPress={() => {
                                                setSelectedContact(contact);
                                                setTriggerModalVisible(true);
                                            }}
                                        >
                                            <Text style={styles.triggerButtonText}>Grant Access</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.removeButton}
                                            onPress={() => handleRemoveContact(contact.id)}
                                        >
                                            <Text style={styles.removeButtonText}>Remove</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}

                            {config.emergencyContacts.length === 0 && (
                                <View style={styles.emptyContacts}>
                                    <Text style={styles.emptyContactsText}>No emergency contacts added</Text>
                                </View>
                            )}
                        </View>

                        {/* Audit Trail Summary */}
                        {config.auditTrail.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Recent Emergency Access Events</Text>
                                {config.auditTrail.slice(0, 3).map(entry => (
                                    <View key={entry.id} style={styles.auditEntry}>
                                        <Text style={styles.auditAction}>{entry.action}</Text>
                                        <Text style={styles.auditDetails}>{entry.details}</Text>
                                        <Text style={styles.auditTime}>
                                            {new Date(entry.timestamp).toLocaleString()}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

            {/* Add Contact Modal */}
            <Modal
                visible={addContactModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setAddContactModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Emergency Contact</Text>

                        <Text style={styles.modalInputLabel}>Name *</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={newContact.name}
                            onChangeText={text => setNewContact(prev => ({ ...prev, name: text }))}
                            placeholder="Full name"
                        />

                        <Text style={styles.modalInputLabel}>Relationship</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={newContact.relationship}
                            onChangeText={text => setNewContact(prev => ({ ...prev, relationship: text }))}
                            placeholder="e.g., Spouse, Parent, Sibling"
                        />

                        <Text style={styles.modalInputLabel}>Phone *</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={newContact.phone}
                            onChangeText={text => setNewContact(prev => ({ ...prev, phone: text }))}
                            placeholder="+91-9876543210"
                            keyboardType="phone-pad"
                        />

                        <Text style={styles.modalInputLabel}>Email</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={newContact.email}
                            onChangeText={text => setNewContact(prev => ({ ...prev, email: text }))}
                            placeholder="email@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalCancelButton]}
                                onPress={() => setAddContactModalVisible(false)}
                            >
                                <Text style={styles.modalCancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalSaveButton]}
                                onPress={handleAddContact}
                            >
                                <Text style={styles.modalSaveButtonText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Trigger Emergency Access Modal */}
            <Modal
                visible={triggerModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setTriggerModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Grant Emergency Access</Text>

                        {selectedContact && (
                            <View style={styles.selectedContactInfo}>
                                <Text style={styles.selectedContactName}>{selectedContact.name}</Text>
                                <Text style={styles.selectedContactDetail}>{selectedContact.phone}</Text>
                            </View>
                        )}

                        <Text style={styles.modalInputLabel}>Reason for Emergency Access *</Text>
                        <TextInput
                            style={[styles.modalInput, styles.modalTextArea]}
                            value={triggerReason}
                            onChangeText={setTriggerReason}
                            placeholder="e.g., Medical emergency, hospital admission"
                            multiline
                            numberOfLines={3}
                        />

                        <View style={styles.expiryWarning}>
                            <Text style={styles.expiryWarningText}>
                                ⏰ Access will automatically expire in {config?.expiryHours || 24} hours
                            </Text>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalCancelButton]}
                                onPress={() => {
                                    setTriggerModalVisible(false);
                                    setTriggerReason('');
                                    setSelectedContact(null);
                                }}
                            >
                                <Text style={styles.modalCancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalEmergencyButton]}
                                onPress={handleTriggerEmergency}
                            >
                                <Text style={styles.modalEmergencyButtonText}>Grant Access</Text>
                            </TouchableOpacity>
                        </View>
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
    errorText: {
        fontSize: 16,
        color: '#F44336',
    },
    warningBanner: {
        flexDirection: 'row',
        backgroundColor: '#FFF3E0',
        padding: 16,
        borderBottomWidth: 2,
        borderBottomColor: '#FF9800',
    },
    warningIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    warningTextContainer: {
        flex: 1,
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E65100',
        marginBottom: 4,
    },
    warningText: {
        fontSize: 14,
        color: '#E65100',
    },
    section: {
        backgroundColor: '#FFF',
        padding: 16,
        marginTop: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionSubtext: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    accessLevelButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    accessLevelButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        backgroundColor: '#FFF',
    },
    accessLevelButtonActive: {
        borderColor: '#007AFF',
        backgroundColor: '#E3F2FD',
    },
    accessLevelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    accessLevelButtonTextActive: {
        color: '#007AFF',
    },
    accessLevelSubtext: {
        fontSize: 12,
        color: '#999',
    },
    expiryInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 8,
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 8,
        fontSize: 16,
        width: 80,
        textAlign: 'center',
    },
    inputUnit: {
        fontSize: 14,
        color: '#666',
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    contactCard: {
        backgroundColor: '#F9F9F9',
        padding: 16,
        borderRadius: 12,
        marginTop: 12,
    },
    contactHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    contactName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    activeBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    activeBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    contactDetail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    accessInfo: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#FFF3E0',
        borderRadius: 8,
    },
    accessInfoText: {
        fontSize: 12,
        color: '#E65100',
    },
    contactActions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    triggerButton: {
        flex: 1,
        backgroundColor: '#FF9800',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    triggerButtonText: {
        color: '#FFF',
        fontWeight: '600',
    },
    removeButton: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F44336',
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#F44336',
        fontWeight: '600',
    },
    emptyContacts: {
        padding: 24,
        alignItems: 'center',
    },
    emptyContactsText: {
        fontSize: 14,
        color: '#999',
    },
    auditEntry: {
        backgroundColor: '#F9F9F9',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    auditAction: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    auditDetails: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    auditTime: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
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
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    modalInputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 12,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#FFF',
    },
    modalTextArea: {
        height: 80,
        textAlignVertical: 'top',
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
    modalCancelButton: {
        backgroundColor: '#F5F5F5',
    },
    modalCancelButtonText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 16,
    },
    modalSaveButton: {
        backgroundColor: '#007AFF',
    },
    modalSaveButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
    modalEmergencyButton: {
        backgroundColor: '#FF9800',
    },
    modalEmergencyButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
    selectedContactInfo: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    selectedContactName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    selectedContactDetail: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    expiryWarning: {
        backgroundColor: '#FFF3E0',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    expiryWarningText: {
        fontSize: 13,
        color: '#E65100',
    },
});
