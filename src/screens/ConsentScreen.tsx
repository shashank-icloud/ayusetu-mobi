import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import SponsorFooter from '../components/SponsorFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'Consent'>;

export default function ConsentScreen({ navigation }: Props) {
    const [consents, setConsents] = useState({
        createLink: false,
        accessProfile: false,
        revokeAccess: false,
        privacyPolicy: false,
    });

    const allConsentsGiven = Object.values(consents).every(v => v === true);

    const toggleConsent = (key: keyof typeof consents) => {
        setConsents(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const openPrivacyPolicy = () => {
        Linking.openURL('https://abdm.gov.in/privacy-policy');
    };

    const openTerms = () => {
        Linking.openURL('https://abdm.gov.in/terms-of-use');
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
                <Text style={styles.title}>Your Consent</Text>
                <Text style={styles.subtitle}>Required to proceed</Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <View style={styles.consentList}>
                    <TouchableOpacity
                        style={styles.consentItem}
                        onPress={() => toggleConsent('createLink')}
                    >
                        <View style={[styles.checkbox, consents.createLink && styles.checkboxChecked]}>
                            {consents.createLink && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.consentText}>
                            I consent to create/link my ABHA number
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.consentItem}
                        onPress={() => toggleConsent('accessProfile')}
                    >
                        <View style={[styles.checkbox, consents.accessProfile && styles.checkboxChecked]}>
                            {consents.accessProfile && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.consentText}>
                            I allow this app to access my ABHA profile
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.consentItem}
                        onPress={() => toggleConsent('revokeAccess')}
                    >
                        <View style={[styles.checkbox, consents.revokeAccess && styles.checkboxChecked]}>
                            {consents.revokeAccess && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.consentText}>
                            I understand I can revoke access anytime
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.consentItem}
                        onPress={() => toggleConsent('privacyPolicy')}
                    >
                        <View style={[styles.checkbox, consents.privacyPolicy && styles.checkboxChecked]}>
                            {consents.privacyPolicy && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.consentText}>
                            I agree to ABDM Privacy Policy
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={openPrivacyPolicy}>
                        <Text style={styles.linkText}>📄 ABDM Privacy Policy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openTerms}>
                        <Text style={styles.linkText}>📄 Terms of Use</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.continueButton, !allConsentsGiven && styles.continueButtonDisabled]}
                    onPress={() => allConsentsGiven && navigation.navigate('ChooseMethod')}
                    disabled={!allConsentsGiven}
                >
                    <Text style={styles.continueButtonText}>Continue →</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Go Back</Text>
                </TouchableOpacity>
            </ScrollView>

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
    content: { flex: 1 },
    contentContainer: { paddingHorizontal: 24, paddingBottom: 120 },
    consentList: { marginTop: 20 },
    consentItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
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
        fontSize: 16,
        color: '#111',
        lineHeight: 22,
    },
    linksContainer: {
        marginTop: 30,
        gap: 12,
    },
    linkText: {
        fontSize: 15,
        color: '#0066cc',
        textDecorationLine: 'underline',
    },
    continueButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#000',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    continueButtonDisabled: {
        backgroundColor: '#ccc',
    },
    continueButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    backButton: {
        width: '100%',
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    backButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
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
