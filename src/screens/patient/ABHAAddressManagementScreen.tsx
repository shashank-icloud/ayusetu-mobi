import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ABHAAddressManagement'>;

export default function ABHAAddressManagementScreen({ navigation }: Props) {
    const [currentAddress, setCurrentAddress] = useState('user@abdm');
    const [newAddress, setNewAddress] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

    const checkAvailability = async () => {
        if (newAddress.length < 4) {
            Alert.alert('Error', 'Address must be at least 4 characters');
            return;
        }

        setIsChecking(true);
        // Simulate API call
        setTimeout(() => {
            const available = !['admin', 'user', 'test'].includes(newAddress.toLowerCase());
            setIsAvailable(available);
            setIsChecking(false);
        }, 1000);
    };

    const handleUpdateAddress = () => {
        if (!isAvailable) {
            Alert.alert('Error', 'Please check availability first');
            return;
        }

        Alert.alert(
            'Update ABHA Address',
            `Change your ABHA address to ${newAddress}@abdm?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: () => {
                        setCurrentAddress(`${newAddress}@abdm`);
                        setNewAddress('');
                        setIsAvailable(null);
                        Alert.alert('Success', 'ABHA address updated successfully');
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
                <Text style={styles.headerTitle}>ABHA Address</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Current Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Current ABHA Address</Text>
                    <View style={styles.currentAddressCard}>
                        <Text style={styles.currentAddress}>{currentAddress}</Text>
                        <Text style={styles.addressNote}>
                            This is your unique ABHA address for receiving health records
                        </Text>
                    </View>
                </View>

                {/* Create New Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Create New Address</Text>
                    <Text style={styles.description}>
                        You can create a new ABHA address. Your old address will remain active.
                    </Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new address"
                            value={newAddress}
                            onChangeText={(text) => {
                                setNewAddress(text.toLowerCase().replace(/[^a-z0-9]/g, ''));
                                setIsAvailable(null);
                            }}
                            autoCapitalize="none"
                        />
                        <Text style={styles.suffix}>@abdm</Text>
                    </View>

                    {isAvailable !== null && (
                        <View style={[
                            styles.availabilityCard,
                            { backgroundColor: isAvailable ? '#e8f5e9' : '#ffebee' }
                        ]}>
                            <Text style={[
                                styles.availabilityText,
                                { color: isAvailable ? '#2e7d32' : '#c62828' }
                            ]}>
                                {isAvailable ? '✓ Available' : '✗ Not Available'}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.button, isChecking && styles.buttonDisabled]}
                        onPress={checkAvailability}
                        disabled={isChecking || !newAddress}
                    >
                        <Text style={styles.buttonText}>
                            {isChecking ? 'Checking...' : 'Check Availability'}
                        </Text>
                    </TouchableOpacity>

                    {isAvailable && (
                        <TouchableOpacity
                            style={[styles.button, styles.buttonPrimary]}
                            onPress={handleUpdateAddress}
                        >
                            <Text style={styles.buttonText}>Create This Address</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Guidelines */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Guidelines</Text>
                    <View style={styles.guidelineItem}>
                        <Text style={styles.guidelineIcon}>✓</Text>
                        <Text style={styles.guidelineText}>
                            Must be 4-18 characters long
                        </Text>
                    </View>
                    <View style={styles.guidelineItem}>
                        <Text style={styles.guidelineIcon}>✓</Text>
                        <Text style={styles.guidelineText}>
                            Only lowercase letters and numbers
                        </Text>
                    </View>
                    <View style={styles.guidelineItem}>
                        <Text style={styles.guidelineIcon}>✓</Text>
                        <Text style={styles.guidelineText}>
                            Cannot start or end with a number
                        </Text>
                    </View>
                    <View style={styles.guidelineItem}>
                        <Text style={styles.guidelineIcon}>✓</Text>
                        <Text style={styles.guidelineText}>
                            Must be unique across ABDM
                        </Text>
                    </View>
                </View>
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
    content: {
        flex: 1,
    },
    section: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    currentAddressCard: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 8,
    },
    currentAddress: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    addressNote: {
        fontSize: 14,
        color: '#666',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 12,
    },
    suffix: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    availabilityCard: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    availabilityText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#666',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonPrimary: {
        backgroundColor: '#000',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    guidelineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    guidelineIcon: {
        fontSize: 18,
        color: '#4CAF50',
        marginRight: 12,
        width: 24,
    },
    guidelineText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
});
