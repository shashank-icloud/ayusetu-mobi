// Example: How to integrate abdmService into your screens

import { abdmService } from '../services/abdmService';
import { useState } from 'react';

// ========================================
// Example 1: Aadhaar Input Screen
// ========================================
export function AadhaarInputExample() {
    const [aadhaar, setAadhaar] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOTP = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await abdmService.generateAadhaarOTP(aadhaar);
            // Navigate to OTP screen with txnId
            navigation.navigate('OTPVerification', {
                method: 'aadhaar',
                value: aadhaar,
                txnId: result.txnId, // Add this to route params
            });
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    // In your JSX:
    // <TouchableOpacity onPress={handleSendOTP} disabled={loading}>
    //   <Text>{loading ? 'Sending...' : 'Send OTP'}</Text>
    // </TouchableOpacity>
}

// ========================================
// Example 2: OTP Verification Screen
// ========================================
export function OTPVerificationExample() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const { method, value, txnId } = route.params;

    const handleVerifyOTP = async () => {
        setLoading(true);

        try {
            let verifiedData;

            if (method === 'aadhaar') {
                verifiedData = await abdmService.verifyAadhaarOTP(otp, txnId);
                // Create ABHA directly for Aadhaar
                const abhaData = await abdmService.createABHAWithAadhaar(
                    verifiedData.txnId,
                    'username@abdm' // Optional custom address
                );

                navigation.navigate('ABHASuccess', {
                    abhaNumber: abhaData.healthIdNumber,
                    abhaAddress: abhaData.healthId,
                });
            } else {
                verifiedData = await abdmService.verifyMobileOTP(otp, txnId);
                // For mobile, you might want additional details screen
                // or create with default values
                navigation.navigate('ProfileDetails', {
                    txnId: verifiedData.txnId,
                    mobile: value,
                });
            }
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };
}

// ========================================
// Example 3: Sign In Screen (ABHA Login)
// ========================================
export function SignInExample() {
    const [abha, setAbha] = useState('');
    const [loading, setLoading] = useState(false);

    const handleProceed = async () => {
        setLoading(true);

        try {
            const result = await abdmService.loginWithABHA(abha);
            navigation.navigate('OTPVerification', {
                method: 'login',
                value: abha,
                txnId: result.txnId,
            });
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };
}

// ========================================
// Developer Mode Testing
// ========================================
/*
When DEVELOPER_MODE = true:
- Any Aadhaar number works (e.g., 123456789012)
- Any mobile number works (e.g., 9876543210)
- Any OTP works (e.g., 123456)
- Returns dummy ABHA: 12-3456-7890-1234

The service will log actions to console:
🔧 DEV MODE: Generated Aadhaar OTP for: 123456789012
🔧 DEV MODE: Verified Aadhaar OTP: 123456
🔧 DEV MODE: Created ABHA with Aadhaar

Perfect for UI testing without API!
*/
