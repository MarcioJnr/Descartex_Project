import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAxjeKFBsAS2uV7JzUiFjDzWzvMygGM_80",
  authDomain: "descartex-bb802.firebaseapp.com",
  projectId: "descartex-bb802",
  storageBucket: "descartex-bb802.firebasestorage.app",
  messagingSenderId: "331724045014",
  appId: "1:331724045014:android:698911a013ea895cdc2777",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };