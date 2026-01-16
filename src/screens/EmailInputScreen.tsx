import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import SponsorFooter from '../components/SponsorFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'EmailInput'>;

export default function EmailInputScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');

    const handleEmailChange = (text: string) => {
        setEmail(text.toLowerCase().trim());
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const canProceed = isValidEmail(email);

    return (
        <SafeAreaView style={styles.container}>
            {/* Corner decorations */}
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />

            <View style={styles.header}>
                <Image source={require('../../assets/images/Images/ayusetu.png')} style={styles.brandMark} />
                <Text style={styles.title}>Email Address</Text>
                <Text style={styles.subtitle}>Enter your email address for ABHA creation</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="your.email@example.com"
                        value={email}
                        onChangeText={handleEmailChange}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                    />
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoIcon}>ℹ️</Text>
                    <Text style={styles.infoText}>
                        We'll send a verification code to this email address
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.button, !canProceed && styles.buttonDisabled]}
                    onPress={() => canProceed && navigation.navigate('OTPVerification', { method: 'mobile', value: email })}
                    disabled={!canProceed}
                >
                    <Text style={styles.buttonText}>Send Verification Code</Text>
                </TouchableOpacity>

                <View style={styles.alternativeBox}>
                    <Text style={styles.alternativeText}>
                        💡 You can upgrade with Aadhaar later for full profile
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.backLink}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backLinkText}>← Choose Another Method</Text>
                </TouchableOpacity>
            </View>

            <SponsorFooter logoSource={require('../../assets/images/Images/SponserCPJLOGO.png')} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    cornerTopLeft: { position: 'absolute', top: 0, left: 0, width: 30, height: 30, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#111' },
    cornerTopRight: { position: 'absolute', top: 0, right: 0, width: 30, height: 30, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#111' },
    cornerBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: 30, height: 30, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#111' },
    cornerBottomRight: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#111' },
    header: { alignItems: 'center', paddingTop: 40, paddingBottom: 20 },
    brandMark: { width: 80, height: 80, resizeMode: 'contain', marginBottom: 12 },
    title: { fontSize: 42, fontWeight: '400', color: '#000', marginBottom: 4 },
    subtitle: { fontSize: 16, color: '#666', textAlign: 'center', paddingHorizontal: 40 },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 2,
        borderColor: '#111',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 18,
        backgroundColor: '#fff',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#f0f7ff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        alignItems: 'center',
    },
    infoIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#1976d2',
        lineHeight: 20,
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonDisabled: {
        opacity: 0.4,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
    alternativeBox: {
        backgroundColor: '#fff8e1',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    alternativeText: {
        fontSize: 14,
        color: '#f57c00',
        textAlign: 'center',
    },
    backLink: {
        alignItems: 'center',
    },
    backLinkText: {
        fontSize: 16,
        color: '#666',
    },
});
