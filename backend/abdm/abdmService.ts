import { abdmApi, mockDelay } from '../http/client';
import { Config } from '../../src/config/env';
import type { Gender, TxnResponse } from '../types/abdm';

export const abdmService = {
  // ========================================
  // Session Management
  // ========================================
  async getSessionToken(): Promise<string> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(500);
      return 'dev-mock-token-12345';
    }

    const response = await abdmApi.post('/v1/auth/init', {
      clientId: Config.ABDM_CLIENT_ID,
      clientSecret: Config.ABDM_CLIENT_SECRET,
    });
    return response.data.accessToken;
  },

  // ========================================
  // Aadhaar-based ABHA Creation
  // ========================================
  async generateAadhaarOTP(aadhaar: string): Promise<TxnResponse> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      console.log('🔧 DEV MODE: Generated Aadhaar OTP for:', aadhaar);
      return { txnId: 'dev-txn-aadhaar-' + Date.now() };
    }

    const token = await this.getSessionToken();
    const response = await abdmApi.post('/v2/registration/aadhaar/generateOtp', { aadhaar }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
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

    const token = await this.getSessionToken();
    const response = await abdmApi.post('/v2/registration/aadhaar/verifyOTP', { otp, txnId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
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

    const token = await this.getSessionToken();
    const response = await abdmApi.post('/v2/registration/aadhaar/createHealthId', { txnId, healthId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // ========================================
  // Mobile-based ABHA Creation
  // ========================================
  async generateMobileOTP(mobile: string): Promise<TxnResponse> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      console.log('🔧 DEV MODE: Generated Mobile OTP for:', mobile);
      return { txnId: 'dev-txn-mobile-' + Date.now() };
    }

    const token = await this.getSessionToken();
    const response = await abdmApi.post('/v2/registration/mobile/generateOtp', { mobile }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async verifyMobileOTP(otp: string, txnId: string): Promise<any> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      console.log('🔧 DEV MODE: Verified Mobile OTP:', otp);
      return { txnId: 'dev-verified-mobile-txn-' + Date.now(), mobileNumber: Config.DEV_MOBILE };
    }

    const token = await this.getSessionToken();
    const response = await abdmApi.post('/v2/registration/mobile/verifyOtp', { otp, txnId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async createABHAWithMobile(
    txnId: string,
    firstName: string,
    lastName: string,
    gender: Gender,
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

    const token = await this.getSessionToken();
    const response = await abdmApi.post(
      '/v2/registration/mobile/createHealthId',
      { txnId, firstName, lastName, gender, yearOfBirth, mobile },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // ========================================
  // Email-based ABHA Creation
  // ========================================
  async generateEmailOTP(email: string): Promise<TxnResponse> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      console.log('🔧 DEV MODE: Generated Email OTP for:', email);
      return { txnId: 'dev-txn-email-' + Date.now() };
    }

    const token = await this.getSessionToken();
    const response = await abdmApi.post('/v2/registration/email/generateOtp', { email }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async verifyEmailOTP(otp: string, txnId: string): Promise<any> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      console.log('🔧 DEV MODE: Verified Email OTP:', otp);
      return { txnId: 'dev-verified-email-txn-' + Date.now(), email: 'user@example.com' };
    }

    const token = await this.getSessionToken();
    const response = await abdmApi.post('/v2/registration/email/verifyOtp', { otp, txnId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async createABHAWithEmail(
    txnId: string,
    firstName: string,
    lastName: string,
    gender: Gender,
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

    const token = await this.getSessionToken();
    const response = await abdmApi.post(
      '/v2/registration/email/createHealthId',
      { txnId, firstName, lastName, gender, yearOfBirth, email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // ========================================
  // ABHA Login (for Sign In)
  // ========================================
  async loginWithABHA(abhaNumber: string): Promise<TxnResponse> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      console.log('🔧 DEV MODE: Login initiated for ABHA:', abhaNumber);
      return { txnId: 'dev-txn-login-' + Date.now() };
    }

    const token = await this.getSessionToken();
    const response = await abdmApi.post('/v2/auth/init', { healthIdNumber: abhaNumber }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async verifyLoginOTP(otp: string, txnId: string): Promise<any> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      console.log('🔧 DEV MODE: Login OTP verified:', otp);
      return {
        token: 'dev-jwt-token-12345',
        healthIdNumber: Config.DEV_ABHA_NUMBER,
        healthId: Config.DEV_ABHA_ADDRESS,
        name: 'Developer User',
        mobileNumber: Config.DEV_MOBILE,
        yearOfBirth: '1990',
        gender: 'M',
      };
    }

    const token = await this.getSessionToken();
    const response = await abdmApi.post('/v2/auth/confirmOtp', { otp, txnId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // ========================================
  // Profile Management
  // ========================================
  async getProfile(xToken: string): Promise<any> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      return {
        healthIdNumber: Config.DEV_ABHA_NUMBER,
        healthId: Config.DEV_ABHA_ADDRESS,
        name: 'Developer User',
        firstName: 'Developer',
        lastName: 'User',
        gender: 'M',
        yearOfBirth: '1990',
        mobileNumber: Config.DEV_MOBILE,
        email: 'dev@example.com',
      };
    }

    const response = await abdmApi.get('/v1/account/profile', {
      headers: { 'X-Token': xToken },
    });
    return response.data;
  },

  async updateProfile(xToken: string, updates: any): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      console.log('🔧 DEV MODE: Profile updated:', updates);
      return true;
    }

    await abdmApi.patch('/v1/account/profile', updates, {
      headers: { 'X-Token': xToken },
    });
    return true;
  },

  // ========================================
  // ABHA Address Management
  // ========================================
  async checkAddressAvailability(healthId: string): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay(500);
      // simulate: username@abdm is taken, everything else available
      return healthId !== 'username@abdm';
    }

    const token = await this.getSessionToken();
    const response = await abdmApi.post('/v1/search/existsByHealthId', { healthId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return !response.data.exists;
  },

  async createABHAAddress(xToken: string, healthId: string): Promise<any> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      console.log('🔧 DEV MODE: Created ABHA Address:', healthId);
      return { healthId, preferred: false };
    }

    const response = await abdmApi.post('/v1/account/phr-address', { healthId }, {
      headers: { 'X-Token': xToken },
    });
    return response.data;
  },

  async setPreferredAddress(xToken: string, healthId: string): Promise<boolean> {
    if (Config.DEVELOPER_MODE) {
      await mockDelay();
      console.log('🔧 DEV MODE: Set preferred ABHA Address:', healthId);
      return true;
    }

    await abdmApi.post('/v1/account/phr-address/preferred', { healthId }, {
      headers: { 'X-Token': xToken },
    });
    return true;
  },
};
