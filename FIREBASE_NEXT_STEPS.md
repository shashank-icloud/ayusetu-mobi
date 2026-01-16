# 🔥 Firebase Integration - Next Steps

## ✅ Completed
- ✅ Installed Firebase packages (@react-native-firebase/app, auth, firestore, storage)
- ✅ Added Google Services plugin to Android build.gradle
- ✅ Configured iOS Podfile for Firebase static frameworks
- ✅ Created FirebaseService helper class with common methods
- ✅ Updated CocoaPods repository

## 📋 What You Need to Do Now

### Step 1: Create Firebase Project (5 minutes)

1. Go to https://console.firebase.google.com/
2. Click **"Add project"**
3. Enter project name: **Ayusetu**
4. (Optional) Enable Google Analytics
5. Click **"Create project"**

### Step 2: Add Android App to Firebase

1. In Firebase Console, click the **Android icon** (⚙️)
2. Fill in details:
   - **Android package name**: Check yours with:
     ```bash
     grep "applicationId" android/app/build.gradle
     ```
     (It's likely `com.ayusetu`)
   
3. Click **"Register app"**
4. **Download `google-services.json`**
5. **Move the file**:
   ```bash
   # In your workspace, move the downloaded file to:
   mv ~/Downloads/google-services.json /Users/shashankmacherla/Ayusetu/ayusetu/android/app/
   ```

6. Click **"Next"** → **"Continue to console"**

### Step 3: Add iOS App to Firebase

1. In Firebase Console, click the **iOS icon** (⚙️)
2. Get your iOS Bundle ID:
   ```bash
   grep -A1 "CFBundleIdentifier" ios/Ayusetu/Info.plist | grep string | sed 's/.*<string>\(.*\)<\/string>.*/\1/'
   ```
   (It's likely `org.reactjs.native.example.Ayusetu`)

3. Click **"Register app"**
4. **Download `GoogleService-Info.plist`**
5. **Add to Xcode**:
   - Open `ios/Ayusetu.xcworkspace` in Xcode
   - Right-click on **Ayusetu** folder (blue icon) in the left panel
   - Select **"Add Files to Ayusetu"**
   - Navigate to Downloads and select **`GoogleService-Info.plist`**
   - ✅ Check **"Copy items if needed"**
   - ✅ Make sure **"Ayusetu" target** is selected
   - Click **"Add"**

6. Click **"Next"** → **"Continue to console"**

### Step 4: Install iOS Pods

After adding `GoogleService-Info.plist` to Xcode:

```bash
cd ios
pod install
cd ..
```

### Step 5: Enable Firebase Services

In Firebase Console:

#### 🔐 Authentication
1. Go to **Build** → **Authentication**
2. Click **"Get started"**
3. Enable sign-in methods:
   - ✅ **Email/Password** (for regular users)
   - ✅ **Phone** (for ABHA mobile verification)

#### 📊 Firestore Database
1. Go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Select:
   - **Start in test mode** (we'll add security rules later)
   - **Location**: `asia-south1 (Mumbai)` or closest to India
4. Click **"Enable"**

#### 📁 Storage
1. Go to **Build** → **Storage**
2. Click **"Get started"**
3. Select **"Start in test mode"**
4. Use same location as Firestore
5. Click **"Done"**

### Step 6: Test the Integration

1. Rebuild the apps:
   ```bash
   # Android
   npm run android
   
   # iOS (in another terminal)
   npm run ios
   ```

2. Add this to your App.tsx to test:
   ```typescript
   import FirebaseService from './src/services/firebaseService';
   
   // Inside a useEffect
   useEffect(() => {
     FirebaseService.testConnection();
   }, []);
   ```

3. Check Metro logs for Firebase initialization messages

## 🔒 Production Security Rules (After Testing)

### Firestore Rules
In Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Health records - user can only access their own
    match /healthRecords/{recordId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Consent management
    match /consents/{consentId} {
      allow read: if request.auth != null && 
        (resource.data.patientId == request.auth.uid || 
         resource.data.providerId == request.auth.uid);
      allow create: if request.auth != null;
    }
    
    // Medical documents metadata
    match /documents/{docId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### Storage Rules
In Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Health records - user can only access their own files
    match /health-records/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
    
    // Profile pictures
    match /users/{userId}/profile/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == userId &&
        request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
  }
}
```

## 📝 Using Firebase in Your App

### Example: Save ABHA Profile After Login

In `SignInScreen.tsx`:

```typescript
import FirebaseService from '../services/firebaseService';

// After successful ABHA login:
const saveUserProfile = async (abhaData: any) => {
  const user = FirebaseService.getCurrentUser();
  if (user) {
    const result = await FirebaseService.saveABHAProfile(user.uid, {
      abhaNumber: abhaData.abhaNumber,
      abhaAddress: abhaData.abhaAddress,
      name: abhaData.name,
      mobile: abhaData.mobile,
      email: abhaData.email,
      profileCreatedAt: new Date().toISOString(),
    });
    
    if (result.success) {
      console.log('✅ Profile saved to Firebase');
    }
  }
};
```

### Example: Save Health Record

```typescript
const saveHealthRecord = async (recordData: any) => {
  const user = FirebaseService.getCurrentUser();
  if (user) {
    const result = await FirebaseService.saveHealthRecord(user.uid, {
      type: 'prescription',
      doctorName: 'Dr. Smith',
      visitDate: new Date().toISOString(),
      diagnosis: 'Fever',
      medications: ['Paracetamol 500mg'],
    });
    
    if (result.success) {
      console.log('✅ Record saved:', result.recordId);
    }
  }
};
```

## 🎯 Summary

**Before building your app:**
1. ✅ Download `google-services.json` → place in `android/app/`
2. ✅ Download `GoogleService-Info.plist` → add to Xcode project
3. ✅ Run `pod install` in ios/ directory
4. ✅ Enable Authentication, Firestore, Storage in Firebase Console
5. ✅ Rebuild both Android and iOS apps

**Your Firebase is ready when:**
- ✅ App builds without errors
- ✅ You see Firebase initialization logs in Metro
- ✅ No Firebase-related errors in console

## 🆘 Troubleshooting

### Android build fails with "google-services.json not found"
- Verify file is at: `android/app/google-services.json`
- Clean and rebuild: `cd android && ./gradlew clean && cd .. && npm run android`

### iOS build fails with Firebase errors
- Verify `GoogleService-Info.plist` is added to Xcode (not just in folder)
- Run: `cd ios && pod deintegrate && pod install && cd ..`
- Clean build in Xcode: Product → Clean Build Folder

### "Firebase not initialized" at runtime
- Make sure configuration files are in correct locations
- Rebuild app completely (don't just refresh)

---

**Need help?** Check [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed documentation.
