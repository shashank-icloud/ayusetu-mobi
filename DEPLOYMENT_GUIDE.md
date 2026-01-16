# Ayusetu App Store Deployment Guide

## 📱 App Information
- **App Name**: Ayusetu
- **Version**: 1.0
- **Bundle ID (iOS)**: org.reactjs.native.example.Ayusetu
- **Package Name (Android)**: ayusetu.life

---

## 🤖 Android - Google Play Store

### ✅ Build Complete
- **AAB File**: `app-release.aab` (28 MB)
- **Location**: `~/Desktop/app-release.aab`
- **Keystore**: `android/app/ayusetu-release.keystore`

### 🔑 Signing Credentials
```
Keystore Password: ayusetu2026
Key Alias: ayusetu-key
Key Password: ayusetu2026
```

⚠️ **IMPORTANT**: Keep these credentials secure! You'll need them for all future updates.

### 📤 Upload to Play Store

1. **Go to Google Play Console**: https://play.google.com/console
2. **Create App** (if not already created):
   - Click "Create app"
   - App name: Ayusetu
   - Default language: English
   - App or game: App
   - Free or paid: Free
   - Accept declarations

3. **Set up your app**:
   - **App access**: Describe access restrictions if any
   - **Ads**: Indicate if app contains ads
   - **Content rating**: Complete questionnaire
   - **Target audience**: Select age groups
   - **Privacy policy**: Add your privacy policy URL
   - **App category**: Medical
   - **Store listing**: Add descriptions, screenshots, app icon

4. **Upload AAB**:
   - Go to "Production" → "Releases"
   - Click "Create new release"
   - Upload `~/Desktop/app-release.aab`
   - Add release notes
   - Click "Review release"
   - Click "Start rollout to Production"

---

## 🍎 iOS - Apple App Store

### 📋 Prerequisites
1. **Apple Developer Account**: https://developer.apple.com
   - Individual: $99/year
   - Organization: $99/year

2. **App Store Connect**: https://appstoreconnect.apple.com

### 🔨 Build Steps

1. **Open Xcode**:
   ```bash
   open /Users/shashankmacherla/Ayusetu/ayusetu/ios/Ayusetu.xcworkspace
   ```

2. **Configure Signing**:
   - Select "Ayusetu" project in navigator
   - Select "Ayusetu" target
   - Go to "Signing & Capabilities"
   - Ensure your team is selected: STGRJ4K3M4
   - Verify "Automatically manage signing" is checked

3. **Update Bundle ID** (if needed for App Store):
   - Currently: `org.reactjs.native.example.Ayusetu`
   - Recommended: Change to `life.ayusetu` or similar
   - In Signing & Capabilities, change "Bundle Identifier"

4. **Create Archive**:
   - Menu: Product → Scheme → Ayusetu
   - Menu: Product → Destination → Any iOS Device (arm64)
   - Menu: Product → Archive
   - Wait 5-10 minutes for build

5. **Distribute to App Store**:
   - When Organizer opens, select your archive
   - Click "Distribute App"
   - Choose "App Store Connect"
   - Click "Upload"
   - Follow the wizard
   - Wait for processing (can take 30-60 minutes)

### 📤 App Store Connect Setup

1. **Create App**:
   - Go to "My Apps" → "+"
   - Platform: iOS
   - Name: Ayusetu
   - Primary Language: English
   - Bundle ID: Select the one from Xcode
   - SKU: ayusetu-ios

2. **App Information**:
   - Category: Medical
   - Subcategory: Health & Fitness
   - Privacy Policy URL: (your URL)
   - Subtitle: ABHA Health Management
   - Keywords: ABHA, health, medical, records

3. **Pricing and Availability**:
   - Price: Free
   - Availability: All countries

4. **App Privacy**:
   - Complete data collection questionnaire
   - Describe how you use health data

5. **App Review Information**:
   - Contact information
   - Demo account (if needed)
   - Notes for reviewer

6. **Version Information**:
   - Screenshots (required sizes):
     - 6.7" (iPhone 16 Pro Max): 1320 x 2868
     - 6.5" (iPhone 14 Pro Max): 1290 x 2796
     - 5.5" (iPhone 8 Plus): 1242 x 2208
   - App description
   - What's new in this version

7. **Submit for Review**:
   - Click "Add for Review"
   - Click "Submit to App Review"
   - Wait 24-48 hours for review

---

## 🔥 Firebase Configuration

### ✅ Already Configured
- Firebase App initialized
- Android: google-services.json
- iOS: GoogleService-Info.plist
- Project: ayusetu-life

### 🚀 Enable Services
Go to https://console.firebase.google.com/project/ayusetu-life

1. **Authentication**:
   - Enable Email/Password
   - Enable Phone authentication
   - Add authorized domains for production

2. **Firestore Database**:
   - Create database in production mode
   - Region: asia-south1 (Mumbai)
   - Update security rules (see FIREBASE_SETUP.md)

3. **Storage**:
   - Create default bucket
   - Update security rules

---

## 📸 Screenshots Needed

### Android (Google Play)
- Phone: 1080 x 1920 (portrait)
- 7" Tablet: 1200 x 1920 (portrait)
- 10" Tablet: 1600 x 2560 (portrait)
- At least 2, maximum 8 per type

### iOS (App Store)
- 6.7" Display: 1320 x 2868
- 6.5" Display: 1290 x 2796
- 5.5" Display: 1242 x 2208
- At least 1, maximum 10 per size

### Feature Graphic (Android)
- Size: 1024 x 500
- Format: PNG or JPEG
- No transparency

### App Icon
- Android: 512 x 512
- iOS: 1024 x 1024
- Already in: `assets/images/Images/ayusetu-logo.png`

---

## ✅ Pre-Launch Checklist

### Code
- [x] Logo implemented across all screens
- [x] Safe area handling on all screens
- [x] Firebase integrated
- [x] Bottom tab navigation working
- [x] Release builds signed

### Store Assets
- [ ] App icon (1024x1024)
- [ ] Screenshots (all required sizes)
- [ ] Feature graphic (Android)
- [ ] App description (< 4000 chars)
- [ ] Short description (Android, < 80 chars)
- [ ] Privacy policy URL

### Legal
- [ ] Privacy policy published
- [ ] Terms of service (if applicable)
- [ ] ABDM compliance documentation

### Testing
- [ ] Test on physical devices
- [ ] Test Firebase features
- [ ] Test ABHA integration
- [ ] Check for crashes

---

## 🆘 Troubleshooting

### Android Build Fails
```bash
cd android
./gradlew clean
cd ..
./gradlew bundleRelease
```

### iOS Archive Fails
- Clean build: Product → Clean Build Folder (⇧⌘K)
- Update pods: `cd ios && pod install`
- Check signing in Xcode

### Keystore Lost
If you lose the keystore, you CANNOT update the app. You must:
1. Backup `android/app/ayusetu-release.keystore` NOW
2. Store credentials securely
3. Upload to cloud storage

---

## 📞 Support

### Google Play Console
- https://support.google.com/googleplay/android-developer

### App Store Connect
- https://developer.apple.com/support/app-store-connect

### Firebase
- https://firebase.google.com/support

---

## 📝 Release Checklist

Before each release:
1. Update version in:
   - `android/app/build.gradle` (versionCode, versionName)
   - `ios/Ayusetu/Info.plist` (CFBundleShortVersionString)
2. Test on devices
3. Update release notes
4. Build signed AAB (Android)
5. Archive and upload (iOS)
6. Submit for review

---

**Current Build Status**:
- ✅ Android AAB: Ready on Desktop (28 MB)
- ⏳ iOS IPA: Need to archive in Xcode

**Next Steps**:
1. Upload Android AAB to Play Store
2. Create iOS archive in Xcode
3. Upload iOS build to App Store Connect
4. Complete store listings
5. Submit for review
