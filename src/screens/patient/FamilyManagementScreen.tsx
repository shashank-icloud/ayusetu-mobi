import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { phrService } from '../../services/phrService';

type Props = NativeStackScreenProps<RootStackParamList, 'FamilyManagement'>;

interface FamilyMember {
    abhaNumber: string;
    name: string;
    relationship: string;
    age: number;
    hasAccess: boolean;
}

export default function FamilyManagementScreen({ navigation }: Props) {
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMemberAbha, setNewMemberAbha] = useState('');
    const [relationship, setRelationship] = useState('');
    const [loading, setLoading] = useState(false);

    const relationships = ['Parent', 'Child', 'Spouse', 'Sibling', 'Guardian', 'Caregiver'];

    useEffect(() => {
        loadFamilyMembers();
    }, []);

    const loadFamilyMembers = async () => {
        setLoading(true);
        try {
            const members = await phrService.getFamilyMembers('12-3456-7890-1234');
            setFamilyMembers(members.map((m: any) => ({
                abhaNumber: m.abhaNumber,
                name: m.name,
                relationship: m.relationship,
                age: m.age,
                hasAccess: false,
            })));
        } catch (error) {
            console.error('Error loading family members:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async () => {
        if (!newMemberAbha || !relationship) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            const success = await phrService.linkFamilyMember(
                '12-3456-7890-1234',
                newMemberAbha,
                relationship.toLowerCase()
            );

            if (success) {
                Alert.alert('Success', 'Family member linked successfully');
                setShowAddForm(false);
                setNewMemberAbha('');
                setRelationship('');
                loadFamilyMembers();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to link family member');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAccess = (abhaNumber: string) => {
        Alert.alert(
            'Delegate Access',
            'Allow this family member to manage your health records?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Allow',
                    onPress: () => {
                        setFamilyMembers(prev =>
                            prev.map(m =>
                                m.abhaNumber === abhaNumber
                                    ? { ...m, hasAccess: !m.hasAccess }
                                    : m
                            )
                        );
                    }
                }
            ]
        );
    };

    const handleRemoveMember = (abhaNumber: string, name: string) => {
        Alert.alert(
            'Remove Family Member',
            `Remove ${name} from your family?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        setFamilyMembers(prev =>
                            prev.filter(m => m.abhaNumber !== abhaNumber)
                        );
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Family Management</Text>
                <TouchableOpacity onPress={() => setShowAddForm(!showAddForm)}>
                    <Text style={styles.addButton}>{showAddForm ? 'Cancel' : '+ Add'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Add Family Member Form */}
                {showAddForm && (
                    <View style={styles.addForm}>
                        <Text style={styles.formTitle}>Link Family Member</Text>

                        <Text style={styles.label}>ABHA Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="12-3456-7890-1234"
                            value={newMemberAbha}
                            onChangeText={setNewMemberAbha}
                            keyboardType="number-pad"
                        />

                        <Text style={styles.label}>Relationship</Text>
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

                        <TouchableOpacity
                            style={[styles.submitButton, loading && styles.buttonDisabled]}
                            onPress={handleAddMember}
                            disabled={loading}
                        >
                            <Text style={styles.submitButtonText}>
                                {loading ? 'Linking...' : 'Link Family Member'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Family Members List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Family Members ({familyMembers.length})
                    </Text>

                    {loading && familyMembers.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Loading...</Text>
                        </View>
                    ) : familyMembers.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyIcon}>👨‍👩‍👧‍👦</Text>
                            <Text style={styles.emptyText}>No family members linked</Text>
                            <Text style={styles.emptySubtext}>
                                Link family members to manage their health records
                            </Text>
                        </View>
                    ) : (
                        familyMembers.map((member) => (
                            <View key={member.abhaNumber} style={styles.memberCard}>
                                <View style={styles.memberHeader}>
                                    <View style={styles.memberAvatar}>
                                        <Text style={styles.memberAvatarText}>
                                            {member.name.charAt(0)}
                                        </Text>
                                    </View>
                                    <View style={styles.memberInfo}>
                                        <Text style={styles.memberName}>{member.name}</Text>
                                        <Text style={styles.memberRelation}>
                                            {member.relationship} • {member.age} years
                                        </Text>
                                        <Text style={styles.memberAbha}>{member.abhaNumber}</Text>
                                    </View>
                                </View>

                                <View style={styles.memberActions}>
                                    <TouchableOpacity
                                        style={[
                                            styles.accessToggle,
                                            member.hasAccess && styles.accessToggleActive
                                        ]}
                                        onPress={() => handleToggleAccess(member.abhaNumber)}
                                    >
                                        <Text style={[
                                            styles.accessToggleText,
                                            member.hasAccess && styles.accessToggleTextActive
                                        ]}>
                                            {member.hasAccess ? '✓ Has Access' : 'Grant Access'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => handleRemoveMember(member.abhaNumber, member.name)}
                                    >
                                        <Text style={styles.removeIcon}>🗑️</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </View>

                {/* Info Section */}
                <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>About Family Management</Text>
                    <Text style={styles.infoText}>
                        • Link family members to manage their health records{'\n'}
                        • Create child accounts for minors{'\n'}
                        • Grant temporary access to caregivers{'\n'}
                        • Manage elderly care delegation{'\n'}
                        • All changes require consent verification
                    </Text>
                </View>

                {/* Quick Links */}
                <View style={styles.quickLinksSection}>
                    <Text style={styles.quickLinksTitle}>Specialized Management</Text>

                    <TouchableOpacity
                        style={styles.quickLinkCard}
                        onPress={() => navigation.navigate('ChildAccountManagement')}
                    >
                        <Text style={styles.quickLinkIcon}>👶</Text>
                        <View style={styles.quickLinkContent}>
                            <Text style={styles.quickLinkTitle}>Child Accounts</Text>
                            <Text style={styles.quickLinkDesc}>
                                Manage accounts for children under 18
                            </Text>
                        </View>
                        <Text style={styles.quickLinkArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickLinkCard}
                        onPress={() => navigation.navigate('ElderlyCareDelegation')}
                    >
                        <Text style={styles.quickLinkIcon}>👵</Text>
                        <View style={styles.quickLinkContent}>
                            <Text style={styles.quickLinkTitle}>Elderly Care</Text>
                            <Text style={styles.quickLinkDesc}>
                                Delegate care to trusted family members
                            </Text>
                        </View>
                        <Text style={styles.quickLinkArrow}>→</Text>
                    </TouchableOpacity>
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
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
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
    submitButton: {
        backgroundColor: '#000',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
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
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    memberCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    memberHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    memberAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    memberAvatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    memberRelation: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    memberAbha: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'monospace',
    },
    memberActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    accessToggle: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    accessToggleActive: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    accessToggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
    },
    accessToggleTextActive: {
        color: '#fff',
    },
    removeIcon: {
        fontSize: 24,
        padding: 8,
    },
    infoSection: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 20,
        borderRadius: 12,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
    quickLinksSection: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 20,
        borderRadius: 12,
    },
    quickLinksTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    quickLinkCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    quickLinkIcon: {
        fontSize: 32,
        marginRight: 16,
    },
    quickLinkContent: {
        flex: 1,
    },
    quickLinkTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    quickLinkDesc: {
        fontSize: 13,
        color: '#666',
    },
    quickLinkArrow: {
        fontSize: 24,
        color: '#999',
    },
});
