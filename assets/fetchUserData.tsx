import { auth, db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export interface UserData {
  uid: string;
  name: string;
  funct?: string;
  email: string;
}

export const fetchUserData = async (): Promise<UserData | null> => {
  if (auth.currentUser) {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    } else {
      console.log("No user document found");
      return null;
    }
  } else {
    console.log("No authenticated user");
    return null;
  }
};