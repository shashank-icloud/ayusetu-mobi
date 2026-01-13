import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ElderlyCareDelegation'>;

interface CareDelegate {
    id: string;
    name: string;
    abhaNumber: string;
    relationship: string;
    accessLevel: 'full' | 'emergency_only' | 'records_only';
    expiryDate?: string;
    isPrimary: boolean;
}

export default function ElderlyCareDelegationScreen({ navigation }: Props) {
    const [delegates, setDelegates] = useState<CareDelegate[]>([
        {
            id: '1',
            name: 'Sarah Johnson',
            abhaNumber: '12-3456-7890-5678',
            relationship: 'Daughter',
            accessLevel: 'full',
            isPrimary: true,
        },
    ]);
    
    const [showAddForm, setShowAddForm] = useState(false);
    const [delegateName, setDelegateName] = useState('');
    const [delegateAbha, setDelegateAbha] = useState('');
    const [relationship, setRelationship] = useState('');
    const [accessLevel, setAccessLevel] = useState<'full' | 'emergency_only' | 'records_only'>('full');
    const [loading, setLoading] = useState(false);

    const relationships = ['Son', 'Daughter', 'Spouse', 'Caregiver', 'Healthcare Provider', 'Other'];
    const accessLevels = [
        { value: 'full', label: 'Full Access', desc: 'Manage all health records and consent' },
        { value: 'emergency_only', label: 'Emergency Only', desc: 'Access only during emergencies' },
        { value: 'records_only', label: 'Records Only', desc: 'View records, cannot make changes' },
    ];

    const handleAddDelegate = async () => {
        if (!delegateName || !delegateAbha || !relationship) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            const newDelegate: CareDelegate = {
                id: Date.now().toString(),
                name: delegateName,
                abhaNumber: delegateAbha,
                relationship,
                accessLevel,
                isPrimary: delegates.length === 0,
            };

            setDelegates([...delegates, newDelegate]);
            setShowAddForm(false);
            resetForm();
            
            Alert.alert(
                'Success',
                `${delegateName} has been added as a care delegate with ${accessLevel.replace('_', ' ')} access.`
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to add care delegate');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setDelegateName('');
        setDelegateAbha('');
        setRelationship('');
        setAccessLevel('full');
    };

    const handleSetPrimary = (delegateId: string) => {
        Alert.alert(
            'Set Primary Caregiver',
            'Set this person as your primary caregiver?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: () => {
                        setDelegates(delegates.map(d => ({
                            ...d,
                            isPrimary: d.id === delegateId
                        })));
                        Alert.alert('Success', 'Primary caregiver updated');
                    }
                }
            ]
        );
    };

    const handleRevokeAccess = (delegateId: string) => {
        const delegate = delegates.find(d => d.id === delegateId);
        if (!delegate) return;

        Alert.alert(
            'Revoke Access',
            `Revoke access for ${delegate.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Revoke',
                    style: 'destructive',
                    onPress: () => {
                        setDelegates(delegates.filter(d => d.id !== delegateId));
                        Alert.alert('Success', 'Access revoked');
                    }
                }
            ]
        );
    };

    const handleModifyAccess = (delegateId: string) => {
        Alert.alert(
            'Modify Access',
            'Choose new access level',
            [
                {
                    text: 'Full Access',
                    onPress: () => updateAccessLevel(delegateId, 'full')
                },
                {
                    text: 'Emergency Only',
                    onPress: () => updateAccessLevel(delegateId, 'emergency_only')
                },
                {
                    text: 'Records Only',
                    onPress: () => updateAccessLevel(delegateId, 'records_only')
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const updateAccessLevel = (delegateId: string, level: 'full' | 'emergency_only' | 'records_only') => {
        setDelegates(delegates.map(d =>
            d.id === delegateId ? { ...d, accessLevel: level } : d
        ));
        Alert.alert('Success', 'Access level updated');
    };

    const getAccessLevelColor = (level: string) => {
        switch (level) {
            case 'full': return '#4CAF50';
            case 'emergency_only': return '#FF9800';
            case 'records_only': return '#2196F3';
            default: return '#999';
        }
    };

    const getAccessLevelText = (level: string) => {
        switch (level) {
            case 'full': return 'Full Access';
            case 'emergency_only': return 'Emergency Only';
            case 'records_only': return 'Records Only';
            default: return level;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Elderly Care</Text>
                <TouchableOpacity onPress={() => setShowAddForm(!showAddForm)}>
                    <Text style={styles.addButton}>{showAddForm ? 'Cancel' : '+ Add'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Add Delegate Form */}
                {showAddForm && (
                    <View style={styles.addForm}>
                        <Text style={styles.formTitle}>Add Care Delegate</Text>
                        <Text style={styles.formSubtitle}>
                            Grant access to family members or caregivers
                        </Text>

                        <Text style={styles.label}>Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter delegate name"
                            value={delegateName}
                            onChangeText={setDelegateName}
                        />

                        <Text style={styles.label}>ABHA Number *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="12-3456-7890-1234"
                            value={delegateAbha}
                            onChangeText={setDelegateAbha}
                            keyboardType="number-pad"
                        />

                        <Text style={styles.label}>Relationship *</Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            style={styles.relationshipScroll}
                        >
                            {relationships.map((rel) => (
                                <TouchableOpacity
                                    key={rel}
                                    style={[
                                        styles.relationshipChip,
                                        relationship === rel && styles.relationshipChipActive
                                    ]}
                                    onPress={() => setRelationship(rel)}
                                >
                                    <Text style={[
                                        styles.relationshipText,
                                        relationship === rel && styles.relationshipTextActive
                                    ]}>
                                        {rel}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text style={styles.label}>Access Level *</Text>
                        {accessLevels.map((level) => (
                            <TouchableOpacity
                                key={level.value}
                                style={[
                                    styles.accessLevelCard,
                                    accessLevel === level.value && styles.accessLevelCardActive
                                ]}
                                onPress={() => setAccessLevel(level.value as any)}
                            >
                                <View style={styles.accessLevelContent}>
                                    <Text style={styles.accessLevelLabel}>{level.label}</Text>
                                    <Text style={styles.accessLevelDesc}>{level.desc}</Text>
                                </View>
                                {accessLevel === level.value && (
                                    <Text style={styles.checkmark}>✓</Text>
                                )}
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            style={[styles.addButton2, loading && styles.buttonDisabled]}
                            onPress={handleAddDelegate}
                            disabled={loading}
                        >
                            <Text style={styles.addButtonText}>
                                {loading ? 'Adding...' : 'Add Delegate'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Delegates List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Care Delegates ({delegates.length})
                    </Text>

                    {delegates.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyIcon}>👵</Text>
                            <Text style={styles.emptyText}>No care delegates yet</Text>
                            <Text style={styles.emptySubtext}>
                                Add trusted family members or caregivers
                            </Text>
                        </View>
                    ) : (
                        delegates.map((delegate) => (
                            <View key={delegate.id} style={styles.delegateCard}>
                                <View style={styles.delegateHeader}>
                                    <View style={styles.delegateAvatar}>
                                        <Text style={styles.delegateAvatarText}>
                                            {delegate.name.split(' ').map(n => n[0]).join('')}
                                        </Text>
                                    </View>
                                    <View style={styles.delegateInfo}>
                                        <View style={styles.delegateNameRow}>
                                            <Text style={styles.delegateName}>{delegate.name}</Text>
                                            {delegate.isPrimary && (
                                                <View style={styles.primaryBadge}>
                                                    <Text style={styles.primaryText}>Primary</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.delegateRelation}>{delegate.relationship}</Text>
                                        <Text style={styles.delegateAbha}>{delegate.abhaNumber}</Text>
                                    </View>
                                </View>

                                <View style={[styles.accessBadge, { backgroundColor: getAccessLevelColor(delegate.accessLevel) + '20' }]}>
                                    <Text style={[styles.accessText, { color: getAccessLevelColor(delegate.accessLevel) }]}>
                                        {getAccessLevelText(delegate.accessLevel)}
                                    </Text>
                                </View>

                                <View style={styles.delegateActions}>
                                    {!delegate.isPrimary && (
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() => handleSetPrimary(delegate.id)}
                                        >
                                            <Text style={styles.actionButtonText}>Set Primary</Text>
                                        </TouchableOpacity>
                                    )}
                                    
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.secondaryButton]}
                                        onPress={() => handleModifyAccess(delegate.id)}
                                    >
                                        <Text style={styles.secondaryButtonText}>Modify Access</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.dangerButton]}
                                        onPress={() => handleRevokeAccess(delegate.id)}
                                    >
                                        <Text style={styles.dangerButtonText}>Revoke</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                {/* Information Section */}
                <View style={styles.infoSection}>
                    <Text style={styles.infoSectionTitle}>About Elderly Care Delegation</Text>
                    <Text style={styles.infoSectionText}>
                        • Delegate health management to trusted caregivers{'\n'}
                        • Set primary caregiver for main decisions{'\n'}
                        • Control access levels (Full, Emergency, View-only){'\n'}
                        • Revoke access anytime{'\n'}
                        • All actions logged for security{'\n'}
                        • Compliant with ABDM delegation guidelines
                    </Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
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
    backButton: {
        fontSize: 28,
        color: '#000',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    addButton: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    addForm: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000',
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    formSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 8,
    },
    relationshipScroll: {
        marginBottom: 16,
    },
    relationshipChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    relationshipChipActive: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    relationshipText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    relationshipTextActive: {
        color: '#fff',
    },
    accessLevelCard: {
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    accessLevelCardActive: {
        borderColor: '#000',
        backgroundColor: '#f5f5f5',
    },
    accessLevelContent: {
        flex: 1,
    },
    accessLevelLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    accessLevelDesc: {
        fontSize: 13,
        color: '#666',
    },
    checkmark: {
        fontSize: 20,
        color: '#000',
    },
    addButton2: {
        backgroundColor: '#000',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    section: {
        marginHorizontal: 16,
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
    },
    delegateCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    delegateHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    delegateAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#9C27B0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    delegateAvatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    delegateInfo: {
        flex: 1,
    },
    delegateNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    delegateName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginRight: 8,
    },
    primaryBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    primaryText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#fff',
    },
    delegateRelation: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    delegateAbha: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'monospace',
    },
    accessBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    accessText: {
        fontSize: 12,
        fontWeight: '700',
    },
    delegateActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#000',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
    },
    secondaryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    dangerButton: {
        backgroundColor: '#F44336',
        borderWidth: 0,
    },
    dangerButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    infoSection: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 20,
        borderRadius: 12,
    },
    infoSectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    infoSectionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
});
