import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, TextInput, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import SponsorFooter from '../components/SponsorFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

type IdentityType = {
    id: string;
    label: string;
    placeholder: string;
    maxLength: number;
    keyboardType: 'numeric' | 'default';
    description: string;
};

const IDENTITY_TYPES: IdentityType[] = [
    {
        id: 'abha',
        label: 'ABHA',
        placeholder: 'Enter your 14-digit ABHA Number',
        maxLength: 14,
        keyboardType: 'numeric',
        description: 'For Patients & Citizens (Personal Health Records)',
    },
    {
        id: 'hpr',
        label: 'HPR',
        placeholder: 'Enter HPR ID',
        maxLength: 20,
        keyboardType: 'default',
        description: 'For Healthcare Professionals',
    },
    {
        id: 'hfr',
        label: 'HFR',
        placeholder: 'Enter HFR ID',
        maxLength: 20,
        keyboardType: 'default',
        description: 'For Healthcare Facilities',
    },
];

export default function SignInScreen({ navigation }: Props) {
    const [selectedIdentity, setSelectedIdentity] = useState<IdentityType>(IDENTITY_TYPES[0]);
    const [identityId, setIdentityId] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSignIn = () => {
        // Developer mode: Different flows based on identity type
        if (selectedIdentity.id === 'abha') {
            // ABHA login → Direct to Main Tabs with bottom navigation
            navigation.navigate('MainTabs');
        } else if (selectedIdentity.id === 'hpr') {
            // HPR login → Direct to Doctor Dashboard
            navigation.navigate('DoctorDashboard');
        } else if (selectedIdentity.id === 'hfr') {
            // HFR login → Role selection (Hospital/Lab/Pharmacy only)
            navigation.navigate('RoleSelection', {
                identityType: 'hfr'
            });
        }
    };

    const handleIdentitySelect = (identity: IdentityType) => {
        setSelectedIdentity(identity);
        setIdentityId('');
        setShowDropdown(false);
    };

    const isValidInput = () => {
        if (selectedIdentity.id === 'abha') {
            return identityId.length === 14;
        }
        return identityId.length >= 5; // Minimum length for HPR/HFR
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Corner decorations */}
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />

            <View style={styles.header}>
                <Image source={require('../../assets/images/Images/ayusetu.png')} style={styles.brandMark} />
                <Text style={styles.title}>Sign In</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.subtitle}>Access Your Health Records</Text>
                <Text style={styles.helperText}>Sign in with your ABHA number to view and manage your personal health records</Text>

                {/* Identity Type Dropdown */}
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setShowDropdown(true)}
                >
                    <Text style={styles.dropdownLabel}>{selectedIdentity.label}</Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>

                {/* Identity ID Input */}
                <TextInput
                    style={styles.inputBox}
                    placeholder={selectedIdentity.placeholder}
                    placeholderTextColor="#666"
                    keyboardType={selectedIdentity.keyboardType}
                    value={identityId}
                    onChangeText={setIdentityId}
                    maxLength={selectedIdentity.maxLength}
                />

                {isValidInput() ? (
                    <TouchableOpacity style={styles.proceedButton} onPress={handleSignIn}>
                        <Text style={styles.proceedButtonText}>Proceed</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.linkText}>New here? Create an account</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Dropdown Modal */}
            <Modal
                visible={showDropdown}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDropdown(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowDropdown(false)}
                >
                    <View style={styles.dropdownModal}>
                        <Text style={styles.modalTitle}>Select Identity Type</Text>
                        <ScrollView style={styles.optionsList}>
                            {IDENTITY_TYPES.map((identity) => (
                                <TouchableOpacity
                                    key={identity.id}
                                    style={[
                                        styles.optionItem,
                                        selectedIdentity.id === identity.id && styles.optionItemActive
                                    ]}
                                    onPress={() => handleIdentitySelect(identity)}
                                >
                                    <View>
                                        <Text style={styles.optionLabel}>{identity.label}</Text>
                                        <Text style={styles.optionDescription}>{identity.description}</Text>
                                    </View>
                                    {selectedIdentity.id === identity.id && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

            <SponsorFooter logoSource={require('../../assets/images/Images/SponserCPJLOGO.png')} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', justifyContent: 'flex-start' },
    header: { alignItems: 'center', paddingTop: 40 },
    brandMark: { width: 80, height: 80, resizeMode: 'contain', marginBottom: 8 },
    title: { fontSize: 42, fontWeight: '400', color: '#000', marginBottom: 4 },
    content: { flex: 1, paddingHorizontal: 24, alignItems: 'center', paddingTop: 40, paddingBottom: 140, justifyContent: 'flex-start' },
    subtitle: { fontSize: 22, fontWeight: '600', color: '#000', marginBottom: 6, textAlign: 'center' },
    helperText: { fontSize: 14, color: '#666', marginBottom: 24, textAlign: 'center', paddingHorizontal: 12 },
    dropdownButton: {
        width: '85%',
        height: 72,
        borderWidth: 2,
        borderColor: '#111',
        borderRadius: 36,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    dropdownLabel: {
        fontSize: 18,
        color: '#000',
        fontWeight: '500',
    },
    dropdownArrow: {
        fontSize: 14,
        color: '#000',
    },
    inputBox: {
        width: '85%',
        height: 72,
        borderWidth: 2,
        borderColor: '#111',
        borderRadius: 36,
        paddingHorizontal: 24,
        fontSize: 18,
        color: '#000',
        marginBottom: 12,
    },
    primaryButtonText: { fontSize: 18, color: '#000' },
    link: { marginTop: 16 },
    linkText: { color: '#444' },
    proceedButton: {
        width: '85%',
        height: 72,
        backgroundColor: '#000',
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    proceedButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    dropdownModal: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        maxHeight: '50%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    optionsList: {
        maxHeight: 300,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    optionItemActive: {
        borderColor: '#000',
        backgroundColor: '#f8f9fa',
    },
    optionLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 14,
        color: '#666',
    },
    checkmark: {
        fontSize: 24,
        color: '#4CAF50',
        fontWeight: '700',
    },
    cornerTopLeft: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 30,
        height: 80,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderColor: '#000',
    },
    cornerTopRight: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 30,
        height: 80,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderColor: '#000',
    },
    cornerBottomLeft: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 30,
        height: 80,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#000',
    },
    cornerBottomRight: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 30,
        height: 80,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#000',
    },
});
