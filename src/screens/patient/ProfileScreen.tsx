import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { abdmService } from '../../services/abdmService';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

interface ProfileData {
    abhaNumber: string;
    abhaAddress: string;
    name: string;
    gender: 'M' | 'F' | 'O';
    yearOfBirth: string;
    mobileNumbers: string[];
    emails: string[];
}

export default function ProfileScreen({ navigation }: Props) {
    const [profile, setProfile] = useState<ProfileData>({
        abhaNumber: '12-3456-7890-1234',
        abhaAddress: 'user@abdm',
        name: 'John Doe',
        gender: 'M',
        yearOfBirth: '1990',
        mobileNumbers: ['9876543210'],
        emails: ['user@example.com'],
    });

    const [isEditing, setIsEditing] = useState(false);
    const [newMobile, setNewMobile] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            // Update profile via ABDM API
            Alert.alert('Success', 'Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMobile = async () => {
        if (newMobile.length !== 10) {
            Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            setLoading(true);
            // Generate OTP for mobile verification
            await abdmService.generateMobileOTP(newMobile);

            Alert.alert(
                'OTP Sent',
                'Please enter the OTP sent to your mobile number',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Navigate to OTP verification or show inline input
                            setProfile({
                                ...profile,
                                mobileNumbers: [...profile.mobileNumbers, newMobile]
                            });
                            setNewMobile('');
                        }
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to add mobile number');
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            // Send verification email
            setProfile({
                ...profile,
                emails: [...profile.emails, newEmail]
            });
            setNewEmail('');
            Alert.alert('Success', 'Verification email sent. Please check your inbox.');
        } catch (error) {
            Alert.alert('Error', 'Failed to add email');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMobile = (mobile: string) => {
        if (profile.mobileNumbers.length === 1) {
            Alert.alert('Error', 'You must have at least one mobile number');
            return;
        }

        Alert.alert(
            'Remove Mobile',
            `Are you sure you want to remove ${mobile}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        setProfile({
                            ...profile,
                            mobileNumbers: profile.mobileNumbers.filter(m => m !== mobile)
                        });
                    }
                }
            ]
        );
    };

    const handleRemoveEmail = (email: string) => {
        Alert.alert(
            'Remove Email',
            `Are you sure you want to remove ${email}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        setProfile({
                            ...profile,
                            emails: profile.emails.filter(e => e !== email)
                        });
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
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                    <Text style={styles.editButton}>{isEditing ? 'Cancel' : 'Edit'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* ABHA Card */}
                <View style={styles.abhaCard}>
                    <Text style={styles.cardLabel}>ABHA Number</Text>
                    <Text style={styles.abhaNumber}>{profile.abhaNumber}</Text>
                    <Text style={[styles.cardLabel, { marginTop: 12 }]}>ABHA Address</Text>
                    <View style={styles.addressRow}>
                        <Text style={styles.abhaAddress}>{profile.abhaAddress}</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ABHAAddressManagement')}
                            style={styles.manageButton}
                        >
                            <Text style={styles.manageButtonText}>Manage</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Basic Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Full Name</Text>
                        <Text style={styles.value}>{profile.name}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Gender</Text>
                        <Text style={styles.value}>
                            {profile.gender === 'M' ? 'Male' : profile.gender === 'F' ? 'Female' : 'Other'}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Year of Birth</Text>
                        <Text style={styles.value}>{profile.yearOfBirth}</Text>
                    </View>

                    <Text style={styles.infoNote}>
                        ℹ️ Clinical information cannot be edited as it's linked to Aadhaar
                    </Text>
                </View>

                {/* Mobile Numbers */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mobile Numbers</Text>

                    {profile.mobileNumbers.map((mobile, index) => (
                        <View key={index} style={styles.contactItem}>
                            <View style={styles.contactLeft}>
                                <Text style={styles.contactIcon}>📱</Text>
                                <Text style={styles.contactText}>{mobile}</Text>
                                {index === 0 && (
                                    <View style={styles.primaryBadge}>
                                        <Text style={styles.primaryText}>Primary</Text>
                                    </View>
                                )}
                            </View>
                            {index > 0 && (
                                <TouchableOpacity onPress={() => handleRemoveMobile(mobile)}>
                                    <Text style={styles.removeButton}>✕</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}

                    {isEditing && (
                        <View style={styles.addContactContainer}>
                            <TextInput
                                style={styles.addContactInput}
                                placeholder="Add mobile number"
                                keyboardType="phone-pad"
                                maxLength={10}
                                value={newMobile}
                                onChangeText={setNewMobile}
                            />
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={handleAddMobile}
                                disabled={loading}
                            >
                                <Text style={styles.addButtonText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Email Addresses */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Email Addresses</Text>

                    {profile.emails.map((email, index) => (
                        <View key={index} style={styles.contactItem}>
                            <View style={styles.contactLeft}>
                                <Text style={styles.contactIcon}>✉️</Text>
                                <Text style={styles.contactText}>{email}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleRemoveEmail(email)}>
                                <Text style={styles.removeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    {isEditing && (
                        <View style={styles.addContactContainer}>
                            <TextInput
                                style={styles.addContactInput}
                                placeholder="Add email address"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={newEmail}
                                onChangeText={setNewEmail}
                            />
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={handleAddEmail}
                                disabled={loading}
                            >
                                <Text style={styles.addButtonText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Account Actions */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('ABHARecovery')}
                    >
                        <Text style={styles.actionIcon}>🔄</Text>
                        <Text style={styles.actionText}>ABHA Recovery & Re-linking</Text>
                        <Text style={styles.actionArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => Alert.alert('Download', 'ABHA card will be downloaded')}
                    >
                        <Text style={styles.actionIcon}>📥</Text>
                        <Text style={styles.actionText}>Download ABHA Card</Text>
                        <Text style={styles.actionArrow}>→</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {isEditing && (
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleUpdateProfile}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Text>
                </TouchableOpacity>
            )}
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
    editButton: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    abhaCard: {
        backgroundColor: '#000',
        margin: 16,
        padding: 20,
        borderRadius: 16,
    },
    cardLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    abhaNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 2,
    },
    addressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    abhaAddress: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    manageButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    manageButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    section: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    label: {
        fontSize: 16,
        color: '#666',
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    infoNote: {
        fontSize: 12,
        color: '#666',
        marginTop: 12,
        fontStyle: 'italic',
    },
    contactItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    contactLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    contactIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    contactText: {
        fontSize: 16,
        color: '#000',
        flex: 1,
    },
    primaryBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    primaryText: {
        fontSize: 11,
        color: '#fff',
        fontWeight: '600',
    },
    removeButton: {
        fontSize: 20,
        color: '#F44336',
        paddingHorizontal: 8,
    },
    addContactContainer: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 8,
    },
    addContactInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    actionIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    actionText: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    actionArrow: {
        fontSize: 18,
        color: '#999',
    },
    saveButton: {
        backgroundColor: '#000',
        marginHorizontal: 16,
        marginVertical: 12,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
