import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import SponsorFooter from '../components/SponsorFooter';
import { abdmService } from '../services/abdmService';

type Props = NativeStackScreenProps<RootStackParamList, 'AadhaarInput'>;

export default function AadhaarInputScreen({ navigation }: Props) {
    const [aadhaar, setAadhaar] = useState('');
    const [consent, setConsent] = useState(false);
    const [loading, setLoading] = useState(false);

    const formatAadhaar = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join('-') || cleaned;
        return formatted;
    };

    const handleAadhaarChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length <= 12) {
            setAadhaar(cleaned);
        }
    };

    const canProceed = aadhaar.length === 12 && consent;

    const handleSendOTP = async () => {
        if (!canProceed) return;

        setLoading(true);
        try {
            const result = await abdmService.generateAadhaarOTP(aadhaar);
            navigation.navigate('OTPVerification', {
                method: 'aadhaar',
                value: aadhaar,
                txnId: result.txnId,
            });
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
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
                <Text style={styles.title}>Aadhaar</Text>
                <Text style={styles.subtitle}>Enter your 12-digit Aadhaar number</Text>
            </View>

            <View style={styles.content}>
                <TextInput
                    style={styles.inputBox}
                    placeholder="XXXX-XXXX-XXXX"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={formatAadhaar(aadhaar)}
                    onChangeText={handleAadhaarChange}
                    maxLength={14}
                />

                <TouchableOpacity
                    style={styles.consentItem}
                    onPress={() => setConsent(!consent)}
                >
                    <View style={[styles.checkbox, consent && styles.checkboxChecked]}>
                        {consent && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.consentText}>
                        I consent to Aadhaar authentication
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.proceedButton, (!canProceed || loading) && styles.proceedButtonDisabled]}
                    onPress={handleSendOTP}
                    disabled={!canProceed || loading}
                >
                    <Text style={styles.proceedButtonText}>{loading ? 'Sending...' : 'Send OTP'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.backLink}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backLinkText}>← Go Back</Text>
                </TouchableOpacity>
            </View>

            <SponsorFooter logoSource={require('../../assets/images/Images/SponserCPJLOGO.png')} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { alignItems: 'center', paddingTop: 40, paddingBottom: 20 },
    brandMark: { width: 80, height: 80, resizeMode: 'contain', marginBottom: 12 },
    title: { fontSize: 42, fontWeight: '400', color: '#000', marginBottom: 4 },
    subtitle: { fontSize: 16, color: '#666' },
    content: { flex: 1, paddingHorizontal: 24, paddingTop: 60, alignItems: 'center' },
    inputBox: {
        width: '100%',
        height: 72,
        borderWidth: 2,
        borderColor: '#111',
        borderRadius: 36,
        paddingHorizontal: 24,
        fontSize: 20,
        color: '#000',
        marginBottom: 24,
        letterSpacing: 2,
        textAlign: 'center',
    },
    consentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#111',
        borderRadius: 6,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#000',
    },
    checkmark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    consentText: {
        flex: 1,
        fontSize: 15,
        color: '#111',
    },
    proceedButton: {
        width: '100%',
        height: 72,
        backgroundColor: '#000',
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    proceedButtonDisabled: {
        backgroundColor: '#ccc',
    },
    proceedButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    backLink: {
        marginTop: 10,
    },
    backLinkText: {
        fontSize: 16,
        color: '#444',
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
