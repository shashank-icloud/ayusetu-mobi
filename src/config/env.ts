// Environment Configuration
// For React Native, we'll use hardcoded values for now
// You can integrate react-native-dotenv or react-native-config later

export const Config = {
    // ABDM Configuration
    ABDM_ENVIRONMENT: 'sandbox', // Change to 'production' when ready
    ABDM_SANDBOX_URL: 'https://healthidsbx.abdm.gov.in/api',
    ABDM_PRODUCTION_URL: 'https://healthid.abdm.gov.in/api',

    // Add your ABDM credentials here after registering
    ABDM_CLIENT_ID: '', // TODO: Add your Client ID from ABDM portal
    ABDM_CLIENT_SECRET: '', // TODO: Add your Client Secret from ABDM portal

    // Developer Mode - Set to false when using real API
    DEVELOPER_MODE: true,

    // Dummy Development Data (for testing without API)
    DEV_ABHA_NUMBER: '12-3456-7890-1234',
    DEV_ABHA_ADDRESS: 'developer@abdm',
    DEV_MOBILE: '9876543210',
    DEV_AADHAAR: '123456789012',

    // Get base URL based on environment
    getBaseUrl: function () {
        return this.ABDM_ENVIRONMENT === 'production'
            ? this.ABDM_PRODUCTION_URL
            : this.ABDM_SANDBOX_URL;
    }
};
