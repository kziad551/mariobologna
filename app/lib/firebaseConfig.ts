import {initializeApp} from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// Initialize Firebase with environment variables
export function initializeFirebase(env: any) {
  const firebaseConfig = {
    apiKey: env.FIREBASE_API_KEY || '',
    authDomain: env.FIREBASE_AUTH_DOMAIN || '',
    projectId: env.FIREBASE_PROJECT_ID || '',
    storageBucket: env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: env.FIREBASE_APP_ID || '',
    measurementId: env.FIREBASE_MEASUREMENT_ID || '',
  };

  const app = initializeApp(firebaseConfig);
  
  return {
    auth: getAuth(app),
    db: getFirestore(app),
    googleProvider: new GoogleAuthProvider(),
    // facebookProvider: new FacebookAuthProvider(),
    // appleProvider: new OAuthProvider('apple.com'),
  };
}

// For client-side usage with hardcoded values (TEMPORARY - replace with new credentials)
export function initializeFirebaseClient() {
  const firebaseConfig = {
    apiKey: 'REPLACE_WITH_NEW_API_KEY',
    authDomain: 'REPLACE_WITH_NEW_AUTH_DOMAIN',
    projectId: 'REPLACE_WITH_NEW_PROJECT_ID',
    storageBucket: 'REPLACE_WITH_NEW_STORAGE_BUCKET',
    messagingSenderId: 'REPLACE_WITH_NEW_SENDER_ID',
    appId: 'REPLACE_WITH_NEW_APP_ID',
    measurementId: 'REPLACE_WITH_NEW_MEASUREMENT_ID',
  };

  const app = initializeApp(firebaseConfig);
  
  return {
    auth: getAuth(app),
    db: getFirestore(app),
    googleProvider: new GoogleAuthProvider(),
  };
} 