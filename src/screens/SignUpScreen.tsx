import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import SponsorFooter from '../components/SponsorFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: Props) {
    const [abha, setAbha] = useState('');

    // Navigate to consent screen for ABHA creation flow
    const handleCreateABHA = () => {
        navigation.navigate('Consent');
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
                <Text style={styles.title}>Sign Up</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.subtitle}>Create Your Health Account</Text>
                <Text style={styles.helperText}>Get your ABHA number to access digital health services across India</Text>
                <TextInput
                    style={styles.inputBox}
                    placeholder="Enter existing ABHA number (optional)"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={abha}
                    onChangeText={setAbha}
                    maxLength={14}
                />

                {abha.length === 14 ? (
                    <TouchableOpacity style={styles.proceedButton} onPress={() => {/* Handle proceed */ }}>
                        <Text style={styles.proceedButtonText}>Proceed</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        <TouchableOpacity style={styles.createButton} onPress={handleCreateABHA}>
                            <Text style={styles.createButtonText}>🆕 Create New ABHA Account</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('SignIn')}>
                            <Text style={styles.linkText}>Already have ABHA? Sign In</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

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
    createButton: {
        width: '85%',
        height: 72,
        borderWidth: 2,
        borderColor: '#111',
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    createButtonText: {
        fontSize: 18,
        color: '#000',
        fontWeight: '600',
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
