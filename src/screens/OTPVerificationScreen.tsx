import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import SponsorFooter from '../components/SponsorFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'OTPVerification'>;

export default function OTPVerificationScreen({ navigation, route }: Props) {
    const { method, value } = route.params;
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleOTPChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length <= 6) {
            setOtp(cleaned);
        }
    };

    const handleResend = () => {
        setTimer(60);
        setCanResend(false);
        setOtp('');
        // Here you would call the API to resend OTP
    };

    const canProceed = otp.length === 6;

    const getMaskedValue = () => {
        if (method === 'aadhaar') {
            return `XXXX-XXXX-${value.slice(-4)}`;
        }
        return `XXXXXX${value.slice(-4)}`;
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
                <Text style={styles.title}>Verify OTP</Text>
                <Text style={styles.subtitle}>
                    Sent to {getMaskedValue()}
                </Text>
            </View>

            <View style={styles.content}>
                <TextInput
                    style={styles.inputBox}
                    placeholder="Enter 6-digit OTP"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={otp}
                    onChangeText={handleOTPChange}
                    maxLength={6}
                    autoFocus
                />

                <Text style={styles.securityNote}>
                    🔒 OTP is sent by {method === 'aadhaar' ? 'UIDAI' : 'ABDM'}
                </Text>

                <View style={styles.timerContainer}>
                    {!canResend ? (
                        <Text style={styles.timerText}>
                            Resend OTP in {timer}s
                        </Text>
                    ) : (
                        <TouchableOpacity onPress={handleResend}>
                            <Text style={styles.resendText}>Resend OTP</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.proceedButton, !canProceed && styles.proceedButtonDisabled]}
                    onPress={() => canProceed && navigation.navigate('ABHASuccess', {
                        abhaNumber: '12-3456-7890-1234',
                        abhaAddress: 'user@abdm'
                    })}
                    disabled={!canProceed}
                >
                    <Text style={styles.proceedButtonText}>Verify & Continue</Text>
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
        fontSize: 24,
        color: '#000',
        marginBottom: 20,
        textAlign: 'center',
        letterSpacing: 8,
    },
    securityNote: {
        fontSize: 13,
        color: '#666',
        marginBottom: 20,
    },
    timerContainer: {
        marginBottom: 30,
    },
    timerText: {
        fontSize: 15,
        color: '#888',
    },
    resendText: {
        fontSize: 16,
        color: '#0066cc',
        fontWeight: '600',
        textDecorationLine: 'underline',
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
