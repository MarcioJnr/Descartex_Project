import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export interface ReportData {
  userId: string;
  wasteType: string;
  weight: number;
}

export const fetchUserReports = async (): Promise<{ totalWaste: number, wasteByType: Record<string, number> }> => {
    if (!auth.currentUser) {
      console.log("No authenticated user");
      return { totalWaste: 0, wasteByType: {} }; // Retorna um objeto padrão
    }
  
    const reportsCollectionRef = collection(db, "reports");
    const q = query(reportsCollectionRef, where("userId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
  
    let totalWaste = 0;
    const wasteByType: Record<string, number> = {};
  
    querySnapshot.forEach((doc) => {
      const reportData = doc.data() as ReportData;
      totalWaste += reportData.weight;
  
      if (wasteByType[reportData.wasteType]) {
        wasteByType[reportData.wasteType] += reportData.weight;
      } else {
        wasteByType[reportData.wasteType] = reportData.weight;
      }
    });
  
    return { totalWaste, wasteByType };
  };