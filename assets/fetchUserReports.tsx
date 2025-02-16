import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export interface ReportData {
  userId: string;
  wasteType: string;
  weight: number;
  date: string;
}

export const fetchUserReports = async (isAnalista: boolean): Promise<{ 
  totalWaste: number, 
  wasteByType: Record<string, number>, 
  reportCount: number 
}> => {
    if (!auth.currentUser) {
      console.log("No authenticated user");
      return { totalWaste: 0, wasteByType: {}, reportCount: 0 };
    }
  
    const reportsCollectionRef = collection(db, "reports");

    // Calculando a data de uma semana atrás
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoISO = oneWeekAgo.toISOString();
    
    // Criando a query baseada no tipo de usuário
    let q;
    if (isAnalista) {
      // Analista: busca todos os relatórios da última semana (sem filtrar por userId)
      q = query(
        reportsCollectionRef,
        where("date", ">=", oneWeekAgoISO)
      );
    } else {
      // Colaborador: busca apenas os relatórios do usuário atual da última semana
      q = query(
        reportsCollectionRef,
        where("userId", "==", auth.currentUser.uid),
        where("date", ">=", oneWeekAgoISO)
      );
    }
    
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