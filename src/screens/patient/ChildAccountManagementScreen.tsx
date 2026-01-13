import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { phrService } from '../../services/phrService';

type Props = NativeStackScreenProps<RootStackParamList, 'ChildAccountManagement'>;

interface ChildAccount {
    id: string;
    name: string;
    abhaNumber: string;
    dateOfBirth: string;
    age: number;
    guardian: string;
    accessLevel: 'full' | 'view_only' | 'limited';
}

export default function ChildAccountManagementScreen({ navigation }: Props) {
    const [childAccounts, setChildAccounts] = useState<ChildAccount[]>([
        {
            id: '1',
            name: 'Emma Doe',
            abhaNumber: '98-7654-3210-0001',
            dateOfBirth: '2018-05-15',
            age: 7,
            guardian: 'John Doe (Parent)',
            accessLevel: 'full',
        },
    ]);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [childName, setChildName] = useState('');
    const [dob, setDob] = useState('');
    const [guardianName, setGuardianName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateChildAccount = async () => {
        if (!childName || !dob) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            // Simulate child account creation
            const newChild: ChildAccount = {
                id: Date.now().toString(),
                name: childName,
                abhaNumber: `98-7654-3210-${String(Date.now()).slice(-4)}`,
                dateOfBirth: dob,
                age: new Date().getFullYear() - parseInt(dob.split('-')[0]),
                guardian: guardianName || 'You (Parent)',
                accessLevel: 'full',
            };

            setChildAccounts([...childAccounts, newChild]);
            setShowCreateForm(false);
            setChildName('');
            setDob('');
            setGuardianName('');

            Alert.alert(
                'Success',
                `Child account created!\n\nABHA Number: ${newChild.abhaNumber}\n\nYou have full access to manage this account.`
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to create child account');
        } finally {
            setLoading(false);
        }
    };

    const handleManageAccess = (childId: string) => {
        const child = childAccounts.find(c => c.id === childId);
        if (!child) return;

        Alert.alert(
            'Manage Access',
            `Manage access level for ${child.name}`,
            [
                {
                    text: 'Full Access',
                    onPress: () => updateAccessLevel(childId, 'full')
                },
                {
                    text: 'View Only',
                    onPress: () => updateAccessLevel(childId, 'view_only')
                },
                {
                    text: 'Limited',
                    onPress: () => updateAccessLevel(childId, 'limited')
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        );
    };

    const updateAccessLevel = (childId: string, level: 'full' | 'view_only' | 'limited') => {
        setChildAccounts(childAccounts.map(child =>
            child.id === childId ? { ...child, accessLevel: level } : child
        ));
        Alert.alert('Success', 'Access level updated');
    };

    const handleTransferGuardianship = (childId: string) => {
        Alert.prompt(
            'Transfer Guardianship',
            'Enter the ABHA number of the new guardian',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Transfer',
                    onPress: (abhaNumber?: string) => {
                        if (abhaNumber) {
                            Alert.alert('Success', 'Guardianship transfer request sent. The new guardian must accept.');
                        }
                    }
                }
            ],
            'plain-text'
        );
    };

    const getAccessLevelColor = (level: string) => {
        switch (level) {
            case 'full': return '#4CAF50';
            case 'view_only': return '#FF9800';
            case 'limited': return '#F44336';
            default: return '#999';
        }
    };

    const getAccessLevelText = (level: string) => {
        switch (level) {
            case 'full': return 'Full Access';
            case 'view_only': return 'View Only';
            case 'limited': return 'Limited';
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
                <Text style={styles.headerTitle}>Child Accounts</Text>
                <TouchableOpacity onPress={() => setShowCreateForm(!showCreateForm)}>
                    <Text style={styles.addButton}>{showCreateForm ? 'Cancel' : '+ Add'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Create Form */}
                {showCreateForm && (
                    <View style={styles.createForm}>
                        <Text style={styles.formTitle}>Create Child Account</Text>
                        <Text style={styles.formSubtitle}>
                            For children under 18, guardians can create and manage ABHA accounts
                        </Text>

                        <Text style={styles.label}>Child's Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter child's name"
                            value={childName}
                            onChangeText={setChildName}
                        />

                        <Text style={styles.label}>Date of Birth *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={dob}
                            onChangeText={setDob}
                            keyboardType="numbers-and-punctuation"
                        />

                        <Text style={styles.label}>Guardian Name (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Defaults to you"
                            value={guardianName}
                            onChangeText={setGuardianName}
                        />

                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>
                                ℹ️ Child accounts are automatically linked to the guardian's ABHA.
                                You'll have full management access until the child turns 18.
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.createButton, loading && styles.buttonDisabled]}
                            onPress={handleCreateChildAccount}
                            disabled={loading}
                        >
                            <Text style={styles.createButtonText}>
                                {loading ? 'Creating...' : 'Create Child Account'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Child Accounts List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Managed Accounts ({childAccounts.length})
                    </Text>

                    {childAccounts.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyIcon}>👶</Text>
                            <Text style={styles.emptyText}>No child accounts yet</Text>
                            <Text style={styles.emptySubtext}>
                                Create accounts for your children under 18
                            </Text>
                        </View>
                    ) : (
                        childAccounts.map((child) => (
                            <View key={child.id} style={styles.childCard}>
                                <View style={styles.childHeader}>
                                    <View style={styles.childAvatar}>
                                        <Text style={styles.childAvatarText}>
                                            {child.name.split(' ').map(n => n[0]).join('')}
                                        </Text>
                                    </View>
                                    <View style={styles.childInfo}>
                                        <Text style={styles.childName}>{child.name}</Text>
                                        <Text style={styles.childAge}>{child.age} years old</Text>
                                        <Text style={styles.childAbha}>{child.abhaNumber}</Text>
                                        <Text style={styles.childGuardian}>Guardian: {child.guardian}</Text>
                                    </View>
                                </View>

                                <View style={[styles.accessBadge, { backgroundColor: getAccessLevelColor(child.accessLevel) + '20' }]}>
                                    <Text style={[styles.accessText, { color: getAccessLevelColor(child.accessLevel) }]}>
                                        {getAccessLevelText(child.accessLevel)}
                                    </Text>
                                </View>

                                <View style={styles.childActions}>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => handleManageAccess(child.id)}
                                    >
                                        <Text style={styles.actionButtonText}>Manage Access</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.secondaryButton]}
                                        onPress={() => navigation.navigate('HealthRecords')}
                                    >
                                        <Text style={styles.secondaryButtonText}>View Records</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.secondaryButton]}
                                        onPress={() => handleTransferGuardianship(child.id)}
                                    >
                                        <Text style={styles.secondaryButtonText}>Transfer</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.childNote}>
                                    💡 This account will transfer to the child at age 18
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                {/* Information Section */}
                <View style={styles.infoSection}>
                    <Text style={styles.infoSectionTitle}>About Child Accounts</Text>
                    <Text style={styles.infoSectionText}>
                        • Create ABHA accounts for children under 18{'\n'}
                        • Full guardian management until child turns 18{'\n'}
                        • Access health records, manage consent{'\n'}
                        • Transfer guardianship if needed{'\n'}
                        • Automatic transfer to child at age 18{'\n'}
                        • Compliant with ABDM child account guidelines
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
    createForm: {
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
    infoBox: {
        backgroundColor: '#e3f2fd',
        padding: 12,
        borderRadius: 8,
        marginVertical: 16,
    },
    infoText: {
        fontSize: 13,
        color: '#1976d2',
        lineHeight: 18,
    },
    createButton: {
        backgroundColor: '#000',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    createButtonText: {
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
    childCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    childHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    childAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFB74D',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    childAvatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    childInfo: {
        flex: 1,
    },
    childName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    childAge: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    childAbha: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'monospace',
        marginBottom: 4,
    },
    childGuardian: {
        fontSize: 12,
        color: '#666',
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
    childActions: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
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
    childNote: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
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
