import axios from 'axios';
import { Config } from '../config/env';

const abdmApi = axios.create({
    baseURL: Config.getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Developer Mode Mock Data
const mockDelay = (ms: number = 1500) => new Promise(resolve => setTimeout(resolve, ms));

export const abdmService = {
    // ========================================
    // Session Management
    // ========================================
    async getSessionToken(): Promise<string> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(500);
            return 'dev-mock-token-12345';
        }

        try {
            const response = await abdmApi.post('/v1/auth/init', {
                clientId: Config.ABDM_CLIENT_ID,
                clientSecret: Config.ABDM_CLIENT_SECRET,
            });
            return response.data.accessToken;
        } catch (error) {
            console.error('Session token error:', error);
            throw error;
        }
    },

    // ========================================
    // Aadhaar-based ABHA Creation
    // ========================================
    async generateAadhaarOTP(aadhaar: string): Promise<{ txnId: string }> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            console.log('🔧 DEV MODE: Generated Aadhaar OTP for:', aadhaar);
            return { txnId: 'dev-txn-aadhaar-' + Date.now() };
        }

        try {
            const token = await this.getSessionToken();
            const response = await abdmApi.post(
                '/v2/registration/aadhaar/generateOtp',
                { aadhaar },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error('Aadhaar OTP generation error:', error);
            throw error;
        }
    },

    async verifyAadhaarOTP(otp: string, txnId: string): Promise<any> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            console.log('🔧 DEV MODE: Verified Aadhaar OTP:', otp);
            return {
                txnId: 'dev-verified-txn-' + Date.now(),
                mobileNumber: Config.DEV_MOBILE,
                name: 'Developer User',
                yearOfBirth: '1990',
                gender: 'M',
            };
        }

        try {
            const token = await this.getSessionToken();
            const response = await abdmApi.post(
                '/v2/registration/aadhaar/verifyOTP',
                { otp, txnId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error('Aadhaar OTP verification error:', error);
            throw error;
        }
    },

    async createABHAWithAadhaar(txnId: string, healthId?: string): Promise<any> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            console.log('🔧 DEV MODE: Created ABHA with Aadhaar');
            return {
                healthIdNumber: Config.DEV_ABHA_NUMBER,
                healthId: healthId || Config.DEV_ABHA_ADDRESS,
                name: 'Developer User',
                token: 'dev-jwt-token-12345',
                mobileNumber: Config.DEV_MOBILE,
                yearOfBirth: '1990',
                gender: 'M',
            };
        }

        try {
            const token = await this.getSessionToken();
            const response = await abdmApi.post(
                '/v2/registration/aadhaar/createHealthId',
                { txnId, healthId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error('ABHA creation error:', error);
            throw error;
        }
    },

    // ========================================
    // Mobile-based ABHA Creation
    // ========================================
    async generateMobileOTP(mobile: string): Promise<{ txnId: string }> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            console.log('🔧 DEV MODE: Generated Mobile OTP for:', mobile);
            return { txnId: 'dev-txn-mobile-' + Date.now() };
        }

        try {
            const token = await this.getSessionToken();
            const response = await abdmApi.post(
                '/v2/registration/mobile/generateOtp',
                { mobile },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error('Mobile OTP generation error:', error);
            throw error;
        }
    },

    async verifyMobileOTP(otp: string, txnId: string): Promise<any> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            console.log('🔧 DEV MODE: Verified Mobile OTP:', otp);
            return {
                txnId: 'dev-verified-mobile-txn-' + Date.now(),
                mobileNumber: Config.DEV_MOBILE,
            };
        }

        try {
            const token = await this.getSessionToken();
            const response = await abdmApi.post(
                '/v2/registration/mobile/verifyOtp',
                { otp, txnId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error('Mobile OTP verification error:', error);
            throw error;
        }
    },

    async createABHAWithMobile(
        txnId: string,
        firstName: string,
        lastName: string,
        gender: 'M' | 'F' | 'O',
        yearOfBirth: string,
        mobile: string
    ): Promise<any> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            console.log('🔧 DEV MODE: Created ABHA with Mobile');
            return {
                healthIdNumber: Config.DEV_ABHA_NUMBER,
                healthId: `${firstName.toLowerCase()}@abdm`,
                name: `${firstName} ${lastName}`,
                token: 'dev-jwt-token-12345',
                mobileNumber: mobile,
                yearOfBirth,
                gender,
            };
        }

        try {
            const token = await this.getSessionToken();
            const response = await abdmApi.post(
                '/v2/registration/mobile/createHealthId',
                { txnId, firstName, lastName, gender, yearOfBirth, mobile },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error('ABHA creation with mobile error:', error);
            throw error;
        }
    },

    // ========================================
    // Email-based ABHA Creation
    // ========================================
    async generateEmailOTP(email: string): Promise<{ txnId: string }> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            console.log('🔧 DEV MODE: Generated Email OTP for:', email);
            return { txnId: 'dev-txn-email-' + Date.now() };
        }

        try {
            const token = await this.getSessionToken();
            const response = await abdmApi.post(
                '/v2/registration/email/generateOtp',
                { email },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error('Email OTP generation error:', error);
            throw error;
        }
    },

    async verifyEmailOTP(otp: string, txnId: string): Promise<any> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            console.log('🔧 DEV MODE: Verified Email OTP:', otp);
            return {
                txnId: 'dev-verified-email-txn-' + Date.now(),
                email: 'user@example.com',
            };
        }

        try {
            const token = await this.getSessionToken();
            const response = await abdmApi.post(
                '/v2/registration/email/verifyOtp',
                { otp, txnId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error('Email OTP verification error:', error);
            throw error;
        }
    },

    async createABHAWithEmail(
        txnId: string,
        firstName: string,
        lastName: string,
        gender: 'M' | 'F' | 'O',
        yearOfBirth: string,
        email: string
    ): Promise<any> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            console.log('🔧 DEV MODE: Created ABHA with Email');
            return {
                healthIdNumber: Config.DEV_ABHA_NUMBER,
                healthId: `${firstName.toLowerCase()}@abdm`,
                name: `${firstName} ${lastName}`,
                token: 'dev-jwt-token-12345',
                email,
                yearOfBirth,
                gender,
            };
        }

        try {
            const token = await this.getSessionToken();
            const response = await abdmApi.post(
                '/v2/registration/email/createHealthId',
                { txnId, firstName, lastName, gender, yearOfBirth, email },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error('ABHA creation with email error:', error);
            throw error;
        }
    },

    // ========================================
    // ABHA De-duplication & Validation
    // ========================================
    async checkDuplicateABHA(aadhaar?: string, mobile?: string, email?: string): Promise<any> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay(800);
            console.log('🔧 DEV MODE: Checking for duplicate ABHA');
            // Simulate no duplicates found
            return {
                isDuplicate: false,
                existingABHA: null,
            };
        }

        try {
            const token = await this.getSessionToken();
            const response = await abdmApi.post(
                '/v2/registration/checkDuplicate',
                { aadhaar, mobile, email },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error('Duplicate check error:', error);
            throw error;
        }
    },

    async resolveConflict(existingAbhaNumber: string, action: 'merge' | 'create_new'): Promise<any> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            console.log('🔧 DEV MODE: Resolving conflict:', action);
            return { success: true };
        }

        try {
            const token = await this.getSessionToken();
            const response = await abdmApi.post(
                '/v2/registration/resolveConflict',
                { existingAbhaNumber, action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error('Conflict resolution error:', error);
            throw error;
        }
    },

    // ========================================
    // ABHA Login/Authentication
    // ========================================
    async loginWithABHA(abhaNumber: string): Promise<{ txnId: string }> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            console.log('🔧 DEV MODE: Login initiated for ABHA:', abhaNumber);
            return { txnId: 'dev-login-txn-' + Date.now() };
        }

        try {
            const token = await this.getSessionToken();
            const response = await abdmApi.post(
                '/v2/auth/init',
                {
                    authMethod: 'AADHAAR_OTP',
                    healthid: abhaNumber,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error('ABHA login error:', error);
            throw error;
        }
    },

    async confirmLoginOTP(otp: string, txnId: string): Promise<any> {
        if (Config.DEVELOPER_MODE) {
            await mockDelay();
            console.log('🔧 DEV MODE: Login confirmed with OTP:', otp);
            return {
                token: 'dev-jwt-token-12345',
                healthIdNumber: Config.DEV_ABHA_NUMBER,
                healthId: Config.DEV_ABHA_ADDRESS,
                name: 'Developer User',
                mobileNumber: Config.DEV_MOBILE,
            };
        }

        try {
            const token = await this.getSessionToken();
            const response = await abdmApi.post(
                '/v2/auth/confirmWithAadhaarOtp',
                { otp, txnId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (error) {
            console.error('Login OTP confirmation error:', error);
            throw error;
        }
    },
};
