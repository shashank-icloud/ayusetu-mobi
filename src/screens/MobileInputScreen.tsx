import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import SponsorFooter from '../components/SponsorFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'MobileInput'>;

export default function MobileInputScreen({ navigation }: Props) {
    const [mobile, setMobile] = useState('');

    const handleMobileChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length <= 10) {
            setMobile(cleaned);
        }
    };

    const canProceed = mobile.length === 10;

    return (
        <SafeAreaView style={styles.container}>
            {/* Corner decorations */}
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />

            <View style={styles.header}>
                <Image source={require('../../assets/images/Images/ayusetu.png')} style={styles.brandMark} />
                <Text style={styles.title}>Mobile Number</Text>
                <Text style={styles.subtitle}>Enter your 10-digit mobile number</Text>
            </View>

            <View style={styles.content}>
                <TextInput
                    style={styles.inputBox}
                    placeholder="98XXXXXXXX"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={mobile}
                    onChangeText={handleMobileChange}
                    maxLength={10}
                />

                <Text style={styles.noteText}>
                    💡 You can upgrade with Aadhaar later for full profile
                </Text>

                <TouchableOpacity
                    style={[styles.proceedButton, !canProceed && styles.proceedButtonDisabled]}
                    onPress={() => canProceed && navigation.navigate('OTPVerification', { method: 'mobile', value: mobile })}
                    disabled={!canProceed}
                >
                    <Text style={styles.proceedButtonText}>Send OTP</Text>
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
        marginBottom: 20,
        textAlign: 'center',
    },
    noteText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
        paddingHorizontal: 20,
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
