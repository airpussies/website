import firebase from "gatsby-plugin-firebase";

export const updateUserDocument = async (user, additionalData) => {
  if (!user) return;
  const doc = await getUserDocument(user.uid);
  const newDoc = {...doc, ...additionalData}
  console.log("Updating doc. New value = " + JSON.stringify(newDoc));

  await firebase.firestore().doc(`users/${user.uid}`).update(newDoc);

  return getUserDocument(user.uid);
};


export const generateUserDocument = async (user, additionalData) => {

  if (!user) return;

  const userRef = firebase.firestore().doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const {email, displayName} = user;

    try {
      await userRef.set({
        displayName,
        email,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document.", error);
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async (uid) => {
  if (!uid) return null;

  try {
    const userDocument = await firebase.firestore().doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user.", error);
  }
};