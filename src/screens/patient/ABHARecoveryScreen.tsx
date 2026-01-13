import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { abdmService } from '../../services/abdmService';

type Props = NativeStackScreenProps<RootStackParamList, 'ABHARecovery'>;

export default function ABHARecoveryScreen({ navigation }: Props) {
    const [method, setMethod] = useState<'abha' | 'mobile' | 'aadhaar' | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'select' | 'input' | 'otp' | 'success'>('select');
    const [loading, setLoading] = useState(false);
    const [recoveredData, setRecoveredData] = useState<any>(null);

    const handleMethodSelect = (selectedMethod: 'abha' | 'mobile' | 'aadhaar') => {
        setMethod(selectedMethod);
        setStep('input');
    };

    const handleSendOTP = async () => {
        if (!inputValue) {
            Alert.alert('Error', 'Please enter the required information');
            return;
        }

        setLoading(true);
        try {
            if (method === 'mobile') {
                await abdmService.generateMobileOTP(inputValue);
            } else if (method === 'aadhaar') {
                await abdmService.generateAadhaarOTP(inputValue);
            }
            setStep('otp');
            Alert.alert('OTP Sent', 'Please check your registered mobile number');
        } catch (error) {
            Alert.alert('Error', 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            // Simulate recovery
            const recovered = {
                abhaNumber: '12-3456-7890-1234',
                abhaAddress: 'user@abdm',
                name: 'John Doe',
                mobile: '9876543210',
            };
            setRecoveredData(recovered);
            setStep('success');
        } catch (error) {
            Alert.alert('Error', 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderSelectMethod = () => (
        <View style={styles.section}>
            <Text style={styles.title}>Recover ABHA</Text>
            <Text style={styles.subtitle}>
                Choose a method to recover your ABHA credentials
            </Text>

            <TouchableOpacity
                style={styles.methodCard}
                onPress={() => handleMethodSelect('abha')}
            >
                <Text style={styles.methodIcon}>🆔</Text>
                <View style={styles.methodContent}>
                    <Text style={styles.methodTitle}>Using ABHA Number</Text>
                    <Text style={styles.methodDesc}>
                        Enter your 14-digit ABHA number
                    </Text>
                </View>
                <Text style={styles.methodArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.methodCard}
                onPress={() => handleMethodSelect('mobile')}
            >
                <Text style={styles.methodIcon}>📱</Text>
                <View style={styles.methodContent}>
                    <Text style={styles.methodTitle}>Using Mobile Number</Text>
                    <Text style={styles.methodDesc}>
                        Registered mobile number
                    </Text>
                </View>
                <Text style={styles.methodArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.methodCard}
                onPress={() => handleMethodSelect('aadhaar')}
            >
                <Text style={styles.methodIcon}>🔢</Text>
                <View style={styles.methodContent}>
                    <Text style={styles.methodTitle}>Using Aadhaar</Text>
                    <Text style={styles.methodDesc}>
                        12-digit Aadhaar number
                    </Text>
                </View>
                <Text style={styles.methodArrow}>→</Text>
            </TouchableOpacity>
        </View>
    );

    const renderInput = () => (
        <View style={styles.section}>
            <TouchableOpacity onPress={() => setStep('select')} style={styles.backLink}>
                <Text style={styles.backLinkText}>← Change Method</Text>
            </TouchableOpacity>

            <Text style={styles.title}>
                {method === 'abha' && 'Enter ABHA Number'}
                {method === 'mobile' && 'Enter Mobile Number'}
                {method === 'aadhaar' && 'Enter Aadhaar Number'}
            </Text>

            <TextInput
                style={styles.input}
                placeholder={
                    method === 'abha' ? '12-3456-7890-1234' :
                        method === 'mobile' ? '10-digit mobile' :
                            '12-digit Aadhaar'
                }
                keyboardType="number-pad"
                value={inputValue}
                onChangeText={setInputValue}
                maxLength={method === 'abha' ? 17 : method === 'mobile' ? 10 : 12}
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Sending...' : 'Send OTP'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderOTP = () => (
        <View style={styles.section}>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>
                OTP sent to your registered mobile number
            </Text>

            <TextInput
                style={styles.input}
                placeholder="6-digit OTP"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleVerifyOTP}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.resendLink}
                onPress={handleSendOTP}
            >
                <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
        </View>
    );

    const renderSuccess = () => (
        <View style={styles.section}>
            <View style={styles.successIcon}>
                <Text style={styles.successIconText}>✓</Text>
            </View>
            <Text style={styles.title}>ABHA Recovered!</Text>
            <Text style={styles.subtitle}>
                Your ABHA details have been successfully recovered
            </Text>

            <View style={styles.recoveredCard}>
                <View style={styles.recoveredRow}>
                    <Text style={styles.recoveredLabel}>ABHA Number</Text>
                    <Text style={styles.recoveredValue}>{recoveredData?.abhaNumber}</Text>
                </View>
                <View style={styles.recoveredRow}>
                    <Text style={styles.recoveredLabel}>ABHA Address</Text>
                    <Text style={styles.recoveredValue}>{recoveredData?.abhaAddress}</Text>
                </View>
                <View style={styles.recoveredRow}>
                    <Text style={styles.recoveredLabel}>Name</Text>
                    <Text style={styles.recoveredValue}>{recoveredData?.name}</Text>
                </View>
                <View style={styles.recoveredRow}>
                    <Text style={styles.recoveredLabel}>Mobile</Text>
                    <Text style={styles.recoveredValue}>{recoveredData?.mobile}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    Alert.alert('Success', 'You can now login with your ABHA credentials');
                    navigation.navigate('SignIn');
                }}
            >
                <Text style={styles.buttonText}>Go to Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => Alert.alert('Download', 'ABHA card will be downloaded')}
            >
                <Text style={styles.downloadButtonText}>Download ABHA Card</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ABHA Recovery</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                {step === 'select' && renderSelectMethod()}
                {step === 'input' && renderInput()}
                {step === 'otp' && renderOTP()}
                {step === 'success' && renderSuccess()}

                <View style={styles.helpSection}>
                    <Text style={styles.helpTitle}>Need Help?</Text>
                    <Text style={styles.helpText}>
                        If you're unable to recover your ABHA, please contact ABDM support
                    </Text>
                    <TouchableOpacity style={styles.supportButton}>
                        <Text style={styles.supportButtonText}>Contact Support</Text>
                    </TouchableOpacity>
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
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    methodIcon: {
        fontSize: 32,
        marginRight: 16,
    },
    methodContent: {
        flex: 1,
    },
    methodTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    methodDesc: {
        fontSize: 14,
        color: '#666',
    },
    methodArrow: {
        fontSize: 24,
        color: '#999',
    },
    backLink: {
        marginBottom: 16,
    },
    backLinkText: {
        fontSize: 16,
        color: '#007AFF',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    resendLink: {
        alignItems: 'center',
        marginTop: 16,
    },
    resendText: {
        fontSize: 16,
        color: '#007AFF',
    },
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 24,
    },
    successIconText: {
        fontSize: 48,
        color: '#fff',
        fontWeight: '700',
    },
    recoveredCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
    },
    recoveredRow: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    recoveredLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    recoveredValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    downloadButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#000',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    downloadButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    helpSection: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 20,
        borderRadius: 12,
    },
    helpTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    helpText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    supportButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    supportButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
