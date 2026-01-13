# ABDM API Integration Setup

## 🔧 Developer Mode (Current Setup)

The app is currently running in **Developer Mode** which allows you to test all ABHA creation flows without connecting to the real ABDM API.

### Dummy ABHA Credentials:
- **ABHA Number**: `12-3456-7890-1234`
- **ABHA Address**: `developer@abdm`
- **Mobile**: `9876543210`
- **Aadhaar**: `123456789012`

Any OTP will be accepted in developer mode (e.g., `123456`).

---

## 📋 Setup Instructions

### 1. Install Dependencies

```bash
npm install axios
# or
yarn add axios
```

### 2. Configure ABDM Credentials

Edit `src/config/env.ts` and add your credentials:

```typescript
export const Config = {
  // Change to 'production' when ready
  ABDM_ENVIRONMENT: 'sandbox',
  
  // Add your credentials from ABDM portal
  ABDM_CLIENT_ID: 'your-client-id-here',
  ABDM_CLIENT_SECRET: 'your-client-secret-here',
  
  // Set to false when using real API
  DEVELOPER_MODE: true,
  
  // ...rest of config
};
```

### 3. Get ABDM Credentials

#### For Sandbox (Testing):
1. Visit: https://sandbox.abdm.gov.in/
2. Register your application
3. Get Client ID and Client Secret
4. Add them to `src/config/env.ts`

#### For Production:
1. Visit: https://facility.ndhm.gov.in/
2. Complete KYC and verification
3. Get production credentials
4. Update `ABDM_ENVIRONMENT` to `'production'`

---

## 🎯 How It Works

### Developer Mode (DEVELOPER_MODE = true):
- No real API calls are made
- Mock delays simulate network requests
- Any OTP works (e.g., 123456)
- Returns dummy ABHA data instantly
- Perfect for UI testing and development

### Production Mode (DEVELOPER_MODE = false):
- Real API calls to ABDM servers
- Actual OTPs sent via SMS
- Real ABHA numbers created
- Requires valid Client ID and Secret

---

## 🔄 Switching to Production API

1. Get ABDM credentials (see above)
2. Update `src/config/env.ts`:
   ```typescript
   ABDM_CLIENT_ID: 'your-real-client-id',
   ABDM_CLIENT_SECRET: 'your-real-client-secret',
   DEVELOPER_MODE: false, // Important!
   ```
3. Test thoroughly in sandbox first
4. Switch to production URL when ready

---

## 📱 API Service Usage

The `abdmService` is already integrated into your screens. Here's how it works:

### Aadhaar Flow:
```typescript
// 1. Generate OTP
const { txnId } = await abdmService.generateAadhaarOTP(aadhaar);

// 2. Verify OTP
const data = await abdmService.verifyAadhaarOTP(otp, txnId);

// 3. Create ABHA
const abha = await abdmService.createABHAWithAadhaar(data.txnId, 'username@abdm');
```

### Mobile Flow:
```typescript
// 1. Generate OTP
const { txnId } = await abdmService.generateMobileOTP(mobile);

// 2. Verify OTP
const data = await abdmService.verifyMobileOTP(otp, txnId);

// 3. Create ABHA
const abha = await abdmService.createABHAWithMobile(
  data.txnId,
  'John',
  'Doe',
  'M',
  '1990',
  mobile
);
```

---

## 🔒 Security Notes

⚠️ **Important:**
- Never commit real credentials to Git
- Use environment variables for production
- Add `.env` to `.gitignore`
- Implement certificate pinning in production
- Encrypt sensitive data in storage

---

## 📚 Resources

- ABDM Sandbox: https://sandbox.abdm.gov.in/
- API Documentation: https://sandbox.abdm.gov.in/docs
- Developer Portal: https://developers.abdm.gov.in/
- Support: abdm.support@nha.gov.in

---

## ✅ Current Implementation Status

✅ All ABHA creation screens built
✅ Developer mode for testing
✅ ABDM service structure ready
✅ Navigation flow complete
✅ Mock data for development

🔲 Pending:
- Add real ABDM credentials
- Test with sandbox API
- Implement error handling UI
- Add loading states
- Implement data persistence
