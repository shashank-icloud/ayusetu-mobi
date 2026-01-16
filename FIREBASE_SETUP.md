# Firebase Setup Guide for Ayusetu

## Prerequisites
✅ Firebase packages installed:
- @react-native-firebase/app
- @react-native-firebase/auth
- @react-native-firebase/firestore
- @react-native-firebase/storage

## Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Enter project name: `Ayusetu` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"

### 2. Add Android App

1. In Firebase Console, click the Android icon
2. **Android package name**: `com.ayusetu` (check `android/app/build.gradle` for actual package name)
3. **App nickname**: Ayusetu Android (optional)
4. **Debug signing certificate SHA-1**: (optional for now, required for Google Sign-In)
   ```bash
   cd android
   ./gradlew signingReport
   ```
5. Click "Register app"
6. **Download `google-services.json`**
7. Place the file in: `android/app/google-services.json`

### 3. Add iOS App

1. In Firebase Console, click the iOS icon
2. **iOS bundle ID**: `org.reactjs.native.example.Ayusetu` (check `ios/Ayusetu/Info.plist` for actual bundle ID)
3. **App nickname**: Ayusetu iOS (optional)
4. Click "Register app"
5. **Download `GoogleService-Info.plist`**
6. Place the file in: `ios/Ayusetu/GoogleService-Info.plist`
7. **Important**: Also add it to Xcode:
   - Open `ios/Ayusetu.xcworkspace` in Xcode
   - Right-click on `Ayusetu` folder → "Add Files to Ayusetu"
   - Select `GoogleService-Info.plist`
   - Make sure "Copy items if needed" is checked
   - Select "Ayusetu" target

### 4. Configure Android

The Android setup is already complete with the google-services plugin.

**Verify `android/build.gradle` has:**
```gradle
buildscript {
    dependencies {
        classpath('com.google.gms:google-services:4.4.0')
    }
}
```

**Verify `android/app/build.gradle` has:**
```gradle
apply plugin: 'com.google.gms.google-services'
```

### 5. Configure iOS

**Edit `ios/Podfile`** and ensure you have:
```ruby
use_frameworks! :linkage => :static
$RNFirebaseAsStaticFramework = true
```

Then run:
```bash
cd ios
pod install
cd ..
```

### 6. Enable Firebase Services

In Firebase Console:

#### Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable providers:
   - ✅ Email/Password
   - ✅ Phone (for ABHA)
   - ✅ Google (optional)

#### Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (change to production rules later)
4. Select region: `asia-south1` (Mumbai) or closest to your users

#### Storage
1. Go to **Storage**
2. Click "Get started"
3. Choose **Start in test mode**
4. Use same region as Firestore

### 7. Get Your Project Credentials

From Firebase Console → Project Settings:
- **Project ID**: Copy this
- **Web API Key**: Copy this
- **Storage Bucket**: Copy this

### 8. Test Installation

Create a test file to verify Firebase is working:

```typescript
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Test connection
console.log('Firebase App:', auth().app.name);
console.log('Firestore:', firestore().app.name);
console.log('Storage:', storage().app.name);
```

### 9. Build Apps

**Android:**
```bash
npm run android
```

**iOS:**
```bash
cd ios && pod install && cd ..
npm run ios
```

## Security Rules (Production)

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data - only authenticated users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Health records - strict authentication required
    match /healthRecords/{recordId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Consent requests
    match /consents/{consentId} {
      allow read: if request.auth != null && 
        (resource.data.patientId == request.auth.uid || 
         resource.data.providerId == request.auth.uid);
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /health-records/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Environment Variables

Create `.env` file (add to .gitignore):
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
FIREBASE_STORAGE_BUCKET=your-app.appspot.com
```

## Troubleshooting

### Android Build Fails
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS Build Fails
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Firebase not initialized
- Verify `google-services.json` is in `android/app/`
- Verify `GoogleService-Info.plist` is in `ios/Ayusetu/` and added to Xcode
- Rebuild the app completely

## Next Steps

1. ✅ Download configuration files from Firebase Console
2. ✅ Place files in correct directories
3. ✅ Add GoogleService-Info.plist to Xcode
4. ✅ Run pod install for iOS
5. ✅ Rebuild both apps
6. ✅ Enable Firebase services in console
7. ✅ Update security rules for production
8. ✅ Integrate Firebase Auth with ABHA login flow
9. ✅ Store health records in Firestore
10. ✅ Store medical documents in Firebase Storage
