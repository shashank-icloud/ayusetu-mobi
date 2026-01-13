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
};
