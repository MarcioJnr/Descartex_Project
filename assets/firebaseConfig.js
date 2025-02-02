import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAxjeKFBsAS2uV7JzUiFjDzWzvMygGM_80",
  authDomain: "descartex-bb802.firebaseapp.com",
  projectId: "descartex-bb802",
  storageBucket: "descartex-bb802.firebasestorage.app",  // Verifique se está correto
  messagingSenderId: "331724045014",
  appId: "1:331724045014:android:698911a013ea895cdc2777",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
