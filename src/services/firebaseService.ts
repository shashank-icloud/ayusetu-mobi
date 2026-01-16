import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Firebase Service
class FirebaseService {
    // Authentication
    static auth = auth;

    // Firestore Database
    static db = firestore;

    // Cloud Storage
    static storage = storage;

    // Test Firebase connection
    static async testConnection() {
        try {
            console.log('✅ Firebase Auth initialized:', auth().app.name);
            console.log('✅ Firestore initialized:', firestore().app.name);
            console.log('✅ Storage initialized:', storage().app.name);
            return true;
        } catch (error) {
            console.error('❌ Firebase initialization error:', error);
            return false;
        }
    }

    // User Management
    static async signUpWithEmail(email: string, password: string) {
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    static async signInWithEmail(email: string, password: string) {
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    static async signOut() {
        try {
            await auth().signOut();
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    static getCurrentUser() {
        return auth().currentUser;
    }

    static onAuthStateChanged(callback: (user: any) => void) {
        return auth().onAuthStateChanged(callback);
    }

    // Firestore Operations
    static async createDocument(collection: string, docId: string, data: any) {
        try {
            await firestore().collection(collection).doc(docId).set(data);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    static async getDocument(collection: string, docId: string) {
        try {
            const doc = await firestore().collection(collection).doc(docId).get();
            if (doc.exists()) {
                return { success: true, data: doc.data() };
            }
            return { success: false, error: 'Document not found' };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    static async updateDocument(collection: string, docId: string, data: any) {
        try {
            await firestore().collection(collection).doc(docId).update(data);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    static async deleteDocument(collection: string, docId: string) {
        try {
            await firestore().collection(collection).doc(docId).delete();
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    static async queryDocuments(collection: string, field?: string, operator?: any, value?: any) {
        try {
            let query = firestore().collection(collection);

            if (field && operator && value !== undefined) {
                query = query.where(field, operator, value) as any;
            }

            const snapshot = await query.get();
            const documents = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return { success: true, data: documents };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    // Storage Operations
    static async uploadFile(path: string, fileUri: string) {
        try {
            const reference = storage().ref(path);
            await reference.putFile(fileUri);
            const url = await reference.getDownloadURL();
            return { success: true, url };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    static async downloadFile(path: string) {
        try {
            const reference = storage().ref(path);
            const url = await reference.getDownloadURL();
            return { success: true, url };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    static async deleteFile(path: string) {
        try {
            const reference = storage().ref(path);
            await reference.delete();
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    // ABHA-Specific Functions
    static async saveABHAProfile(userId: string, abhaData: any) {
        try {
            await firestore()
                .collection('users')
                .doc(userId)
                .set({
                    ...abhaData,
                    updatedAt: firestore.FieldValue.serverTimestamp(),
                }, { merge: true });

            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    static async saveHealthRecord(userId: string, recordData: any) {
        try {
            const recordRef = await firestore()
                .collection('healthRecords')
                .add({
                    userId,
                    ...recordData,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });

            return { success: true, recordId: recordRef.id };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    static async getHealthRecords(userId: string) {
        try {
            const snapshot = await firestore()
                .collection('healthRecords')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();

            const records = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return { success: true, data: records };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    static async saveConsent(consentData: any) {
        try {
            const consentRef = await firestore()
                .collection('consents')
                .add({
                    ...consentData,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });

            return { success: true, consentId: consentRef.id };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    static async uploadMedicalDocument(userId: string, documentName: string, fileUri: string) {
        try {
            const path = `health-records/${userId}/${Date.now()}_${documentName}`;
            const result = await this.uploadFile(path, fileUri);

            if (result.success) {
                // Save metadata to Firestore
                await firestore()
                    .collection('documents')
                    .add({
                        userId,
                        name: documentName,
                        url: result.url,
                        path,
                        uploadedAt: firestore.FieldValue.serverTimestamp(),
                    });
            }

            return result;
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
}

export default FirebaseService;
