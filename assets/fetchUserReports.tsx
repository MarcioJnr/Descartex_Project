import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export interface ReportData {
  userId: string;
  wasteType: string;
  weight: number;
  date: string; 
}

export const fetchUserReports = async (): Promise<{ 
  totalWaste: number, 
  wasteByType: Record<string, number>, 
  reportCount: number 
}> => {
    if (!auth.currentUser) {
      console.log("No authenticated user");
      return { totalWaste: 0, wasteByType: {}, reportCount: 0 };
    }
  
    const reportsCollectionRef = collection(db, "reports");

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoISO = oneWeekAgo.toISOString(); 
    
    // Criando a query para filtrar os relatórios do usuário e da última semana
    const q = query(
      reportsCollectionRef,
      where("userId", "==", auth.currentUser.uid),
      where("date", ">=", oneWeekAgoISO) 
    );
    
    const querySnapshot = await getDocs(q);
  
    let totalWaste = 0;
    const wasteByType: Record<string, number> = {};
    let reportCount = 0;
  
    querySnapshot.forEach((doc) => {
      const reportData = doc.data() as ReportData;
      totalWaste += reportData.weight;
  
      if (wasteByType[reportData.wasteType]) {
        wasteByType[reportData.wasteType] += reportData.weight;
      } else {
        wasteByType[reportData.wasteType] = reportData.weight;
      }

      reportCount++; // Incrementando o contador de relatórios
    });
  
    return { totalWaste, wasteByType, reportCount };
  };