import {doc, setDoc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "./firebase";

export const updateUserDocument = async (user, additionalData) => {
  if (!user) return;
  const existingDoc = await getUserDocument(user.uid);
  const newDoc = {...existingDoc, ...additionalData}
  console.log("Updating doc. New value = " + JSON.stringify(newDoc));

  await updateDoc(doc(db, `users/${user.uid}`), newDoc);

  return getUserDocument(user.uid);
};


export const generateUserDocument = async (user, additionalData) => {

  if (!user) return;

  const userRef = doc(db, `users/${user.uid}`);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const {email, displayName} = user;

    try {
      await setDoc(userRef, {
        displayName,
        email,
        ...additionalData
      });
    } catch (error) {
      console.error("Fehler bei der Registrierung mit Email und Passwort.", error);
      throw error;
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async (uid) => {
  if (!uid) return null;

  try {
    const userDocument = await getDoc(doc(db, `users/${uid}`));
    return {
      uid,
      ...(userDocument.data() || {})
    };
  } catch (error) {
    console.error("Error fetching user.", error);
  }
};