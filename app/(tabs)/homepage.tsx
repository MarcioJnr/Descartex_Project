import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { fetchUserData, UserData } from "../../assets/fetchUserData";
import { fetchUserReports } from "../../assets/fetchUserReports";
import { auth } from "../../assets/firebaseConfig";
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

type HomePageNavigationProp = StackNavigationProp<RootStackParamList, 'HomePage'>;

export default function HomePage() {
  const navigation = useNavigation<HomePageNavigationProp>();
  const [localUserData, setLocalUserData] = useState<UserData | null>(null);
  const [reportsData, setReportsData] = useState<{ totalWaste: number, wasteByType: Record<string, number> } | null>(null);
  const [loading, setLoading] = useState(true);
  
  //interface do analista
  const [wichFun, setWichFun] = useState(true);
  
  useEffect(() => {
    console.log("localUserData atualizado:", localUserData);
  }, [localUserData]);
  const screenWidth = Dimensions.get('window').width;

  const DonutChart = ({ data }: { data: Record<string, number> }) => {
    // Verifica se data existe e não está vazio
    if (!data || Object.keys(data).length === 0) {
      return (
        <View style={styles.donutChartContainer}>
          <Text style={styles.centerTextBottom}>Sem dados</Text>
        </View>
      );
    }
  
    const chartData = Object.entries(data).map(([type, weight]) => ({
      name: type,
      population: weight,
      color: getColorForWasteType(type),
      legendFontColor: "#7F7F7F",
    }));
  
    return (
      <View style={styles.donutChartContainer}>
        <PieChart
          data={chartData}
          width={120}
          height={120}
          chartConfig={{
            color: () => `rgba(0, 0, 0, 0.5)`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="0"
          hasLegend={false}
          absolute
          center={[30, 0]}
        />
        <View style={styles.centerHole} />
      </View>
    );
  };
// Função auxiliar para obter cores com base no tipo de resíduo
const getColorForWasteType = (wasteType: string): string => {
  switch (wasteType) {
    case "Plástico":
      return "#F24822";
    case "Metal":
      return "#F1C100";
    case "Vidro":
      return "#00AF35";
    case "Papel":
      return "#0184FF";
    case "Orgânico":
      return "#94451E";
    case "Rejeito":
      return "#9747FF";
    case "Eletrônico":
      return "#1E1E1E";
    case "Isopor":
      return "#CE0CAB";
    default:
      return "#D3D3D3";
  }
};


useEffect(() => {
  const getUserData = async () => {
    try {
      const userData = await fetchUserData();
      setLocalUserData(userData);

      const reports = await fetchUserReports();
      setReportsData(reports || { totalWaste: 0, wasteByType: {} }); // Fallback para dados inválidos
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  getUserData();
}, []);

useEffect(() => {
  if (localUserData?.funct == "Colaborador") {
    setWichFun(false);
  }
}, [localUserData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#497E13" />
        <Text>Verificando autenticação...</Text>
      </View>
    );
  }

  if (!auth.currentUser) {
    navigation.navigate('Login');
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.greeting}>
          Olá, <Text style={styles.highlight}>{localUserData?.name || "Usuário"}!</Text>
        </Text>
        <Text style={styles.info}>
          Já acumulamos <Text style={styles.highlight}>{reportsData?.totalWaste || 0}kg</Text> de resíduos esta semana.
        </Text>
      </View>
  
      <View style={styles.backgroundContainer}>
        <View style={styles.evolutionsContainer}>
          <Text style={styles.evolutionsTitle}>EVOLUÇÕES SEMANAIS (KG)</Text>
          
          <View style={styles.evolutionContent}>
            {/* Residômetro */}
            {wichFun &&
            <View style={styles.residometerContainer}>
              <Image 
                source={require('../../assets/images/vector_residometro.png')} 
                style={styles.residometerIcon} 
              />
              <Text style={styles.residometerText}>
                <Text>Residômetro</Text>
              </Text>
              <Text style={styles.wasteText}>
                {reportsData?.totalWaste || 0}
              </Text>
            </View>}
            {wichFun && 
            <View style={styles.chartWrapper}>
              <DonutChart data={reportsData?.wasteByType || {}} />
              <View style={styles.legendContainer}>
                {reportsData?.wasteByType && Object.entries(reportsData.wasteByType).map(([type, weight]) => (
                  <View style={styles.legendItem} key={type}>
                    <View style={[styles.legendColor, { backgroundColor: getColorForWasteType(type) }]} />
                    <Text style={styles.legendText}>{type}: {weight}</Text>
                  </View>
                ))}
              </View>
            </View>}
          </View>
        </View>
  
        {/* Botões */}
        <View style={styles.buttonsContainer}>
        
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NewRegistry')}>
            <Text style={styles.buttonText}>Novo Registro</Text>
            <Image source={require('../../assets/images/icon_cam.png')} style={styles.buttonIcon} />
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Reports')}>
            <Text style={styles.buttonText}>Relatórios</Text>
            <Image source={require('../../assets/images/icon_report.png')} style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCDEC4",
  },
  headerContainer:{
    padding: 20,
  },
  backgroundContainer: {
    flex: 1,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    backgroundColor: "#EBD0B5",
    marginTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#DCDEC4",
  },
  evolutionsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    width: "90%",
    alignSelf: "center",
    marginTop: -50,
    elevation: 5,
  },
  evolutionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#94451E",
    textAlign: "center",
  },
  logo: {
    width: 250,
    height: 50,
    marginTop: 50,
  },
  greeting: {
    fontSize: 20,
    color: "#94451E",
    marginBottom: 5,
  },
  highlight: {
    fontWeight: "bold",
  },
  info: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  evolutionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%", // Garante que o container ocupe toda a largura disponível
  },
  residometerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "50%", // Ocupa 50% da largura
  },

  residometerIcon: {
    width: 90,
    height: 90,
    marginBottom: 5,
  },
  residometerText: {
    fontSize: 11,
    color: "#94451E",
    textAlign: "center",
    fontWeight: "bold",
  },
  wasteText: {
    fontSize: 11,
    color: "#555",
    textAlign: "center",
    fontWeight: "bold",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 5,
  },
  legendColor: {
    width: 11,
    height: 11,
    borderRadius: 3,
    marginRight: 4,
  },
  legendText: {
    fontSize: 9,
    color: "#555",
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 50,
  },
  button: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#94451E",
    padding: 15,
    borderRadius: 10,
    width: 114,
    height: 107,
    justifyContent: "center",
  },
  buttonIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  buttonText: {
    color: "#94451E",
    fontWeight: "bold",
    fontSize: 11,
    marginBottom: 10,
  },
  donutChartContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: 120,
    height: 120,
  },
  centerHole: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 40, 
    backgroundColor: "#FFFFFF", 
  },
  centerTextTop: {
    fontSize: 12,
    color: "#555",
    fontWeight: "bold",
  },
  centerTextBottom: {
    fontSize: 14, 
    fontWeight: "bold",
    color: "#000",
  },
  chartWrapper: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  }
});