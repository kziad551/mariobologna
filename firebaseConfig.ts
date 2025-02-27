import {initializeApp} from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD-KrhwJPqZ6-1qQ5fODeBnqjFHwLMdYBU',
  authDomain: 'mario-bologna.firebaseapp.com',
  projectId: 'mario-bologna',
  storageBucket: 'mario-bologna.appspot.com',
  messagingSenderId: '871278235922',
  appId: '1:871278235922:web:9dd71ed90c72a250b223cb',
  measurementId: 'G-MEQJ1MBV5Q',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
// export const facebookProvider = new FacebookAuthProvider();
// export const appleProvider = new OAuthProvider('apple.com');
