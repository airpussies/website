import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase web app config — intentionally public (readable from the deployed
// site). Project: trnrvtng.
const firebaseConfig = {
  apiKey: "AIzaSyBYqZhiCKPRDMKMZI7-o6BaGV3dG3xKR40",
  authDomain: "trnrvtng.firebaseapp.com",
  projectId: "trnrvtng",
  storageBucket: "trnrvtng.appspot.com",
  messagingSenderId: "116633660030",
  appId: "1:116633660030:web:f51c3f1964dd121a66c62f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
