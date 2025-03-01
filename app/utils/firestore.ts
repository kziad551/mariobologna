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
  shopifyCustomerId?: string;
  createdAt?: string;
};

export const addDocument = async ({uid, email, shopifyPassword, shopifyCustomerId, createdAt}: AddDocumentType) => {
  await setDoc(doc(db, 'users', uid), {
    email,
    shopifyPassword,
    shopifyCustomerId,
    createdAt,
  });
};

type UpdateDocumentType = {
  uid: string;
  shopifyPassword: string;
};

export const updateDocument = async ({uid, shopifyPassword}: UpdateDocumentType) => {
  await updateDoc(doc(db, 'users', uid), {
    shopifyPassword,
  });
};

export const updateDocumentUsingEmail = async (
  email: string,
  shopifyPassword: string,
) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];

    await updateDocument({uid: userDoc.id, shopifyPassword});
  } else {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        shopifyPassword,
      );
      const newUser = userCredential.user;

      // Use the newly created user's UID as the document ID and save to Firestore
      await addDocument({
        uid: newUser.uid,
        email,
        shopifyPassword,
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
