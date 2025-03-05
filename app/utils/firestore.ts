import {createUserWithEmailAndPassword, getAuth} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {db} from 'firebaseConfig';

const auth = getAuth();

type AddDocumentType = {
  uid: string;
  email: string;
  shopifyPassword: string;
  createdAt?: string;
};

export const addDocument = async ({uid, email, shopifyPassword, createdAt}: AddDocumentType) => {
  // Create a base document with required fields
  const docData: Record<string, any> = {
    email,
    shopifyPassword,
  };
  
  // Only add createdAt if it's defined
  if (createdAt) {
    docData.createdAt = createdAt;
  }
  
  // Use setDoc with the filtered document data
  await setDoc(doc(db, 'users', uid), docData);
};

type UpdateDocumentType = {
  uid: string;
  password: string;
};

export const updateDocument = async ({uid, password}: UpdateDocumentType) => {
  await updateDoc(doc(db, 'users', uid), {
    password,
  });
};

export const updateDocumentUsingEmail = async (
  email: string,
  password: string,
) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];

    await updateDocument({uid: userDoc.id, password});
  } else {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const newUser = userCredential.user;

      // Use the newly created user's UID as the document ID and save to Firestore
      await addDocument({
        uid: newUser.uid,
        email,
        shopifyPassword: password,
      });
    } catch (error) {
      console.error(
        'Error creating new user in Firebase Authentication:',
        error,
      );
    }
  }
};

export const getUserByEmail = async (email: string) => {
  const usersRef = collection(db, 'users'); // Reference to the 'users' collection
  const q = query(usersRef, where('email', '==', email)); // Query to find documents where 'email' matches

  const querySnapshot = await getDocs(q); // Execute the query

  if (!querySnapshot.empty) {
    // Since email is unique, we expect only one document, but we iterate in case
    const userDoc = querySnapshot.docs[0]; // Assuming there's only one document
    return userDoc.data();
  } else {
    console.log('No matching documents found.');
    return null;
  }
};