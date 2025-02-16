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
  reportCount: number,
  dailyWaste: Record<string, number>
}> => {
    if (!auth.currentUser) {
      console.log("No authenticated user");
      return { totalWaste: 0, wasteByType: {}, reportCount: 0, dailyWaste: {} };
    }
  
    const reportsCollectionRef = collection(db, "reports");

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoISO = oneWeekAgo.toISOString();
    
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
    const dailyWaste: Record<string, number> = {
      "Seg": 0,
      "Ter": 0,
      "Qua": 0,
      "Qui": 0,
      "Sex": 0,
      "Sáb": 0,
      "Dom": 0
    };
  
    querySnapshot.forEach((doc) => {
      const reportData = doc.data() as ReportData;
      totalWaste += reportData.weight;
  
      if (wasteByType[reportData.wasteType]) {
        wasteByType[reportData.wasteType] += reportData.weight;
      } else {
        wasteByType[reportData.wasteType] = reportData.weight;
      }

      // Calculando o dia da semana
      const reportDate = new Date(reportData.date);
      const dayOfWeek = reportDate.toLocaleDateString('pt-BR', { weekday: 'short' });
      const formattedDay = dayOfWeek.replace('.', ''); // Remove o ponto final
      const capitalizedDay = formattedDay.charAt(0).toUpperCase() + formattedDay.slice(1); // Capitaliza a primeira letra

      dailyWaste[capitalizedDay] += reportData.weight;

      reportCount++; // Incrementando o contador de relatórios
    });
  
    return { totalWaste, wasteByType, reportCount, dailyWaste };
  };