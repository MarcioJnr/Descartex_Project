import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { fetchUserData, UserData } from "../../assets/fetchUserData";
import { auth } from "../../assets/firebaseConfig";

type HomePageNavigationProp = StackNavigationProp<RootStackParamList, 'HomePage'>;

export default function HomePage() {
  const navigation = useNavigation<HomePageNavigationProp>();
  const [localUserData, setLocalUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  //interface do analista
  const [wichFun, setWichFun] = useState(true);
  
  useEffect(() => {
    console.log("localUserData atualizado:", localUserData);
  }, [localUserData]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setLocalUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
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
        {/* Header */}
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.greeting}>
          Olá, <Text style={styles.highlight}>{localUserData?.name || "Usuário"}!</Text>
        </Text>
        <Text style={styles.info}>
          Já acumulamos <Text style={styles.highlight}>{localUserData?.totalWaste || 0}kg</Text> de resíduos esta semana.
        </Text>
      </View>

      <View style={styles.backgroundContainer}>
        {/* Evoluções Semanais */}
        <View style={styles.evolutionsContainer}>
          <Text style={styles.evolutionsTitle}>EVOLUÇÕES SEMANAIS</Text>
          
          <View style={styles.evolutionContent}>
            {/* Residômetro */}
            {wichFun &&
            <View style={styles.residometerContainer}>
              <Image 
                source={require('../../assets/images/vector_residometro.png')} 
                style={styles.residometerIcon} 
              />
              <Text style={styles.residometerText}>
                <Text>Residômetro</Text>{"\n"}
              </Text>
              <Text style={styles.wasteText}>
                {localUserData?.totalWaste || 0} kg
              </Text>

            </View>}

            {/* Gráfico Circular Placeholder */}
            {wichFun && 
            <View style={styles.chartContainer}>
              <View style={styles.fakeChart} />
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: "#C0DFA1" }]} />
                   <Text style={styles.legendText}>Plástico</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: "#D6BF86" }]} />
                    <Text style={styles.legendText}>Metal</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: "#5A8F45" }]} />
                    <Text style={styles.legendText}>Vidro</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: "#A0C18D" }]} />
                    <Text style={styles.legendText}>Papel</Text>
                  </View>
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
          {wichFun &&     
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Reports')}>
            <Text style={styles.buttonText}>Relatórios</Text>
            <Image source={require('../../assets/images/icon_report.png')} style={styles.buttonIcon} />
          </TouchableOpacity>}
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
    width: "80%",
    alignSelf: "center",
    marginTop: -50,
    elevation: 5,
  },
  evolutionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#94451E",
    textAlign: "center",
    marginBottom: 15,
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
    //textAlign: "center",
  },
  evolutionContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  residometerContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  residometerIcon: {
    width: 65,
    height: 65,
    marginBottom: 5,
  },
  residometerText: {
    fontSize: 11,
    color: "#94451E",
    textAlign: "left",
    fontWeight: "bold",
  },
  wasteText: {
    fontSize: 11,
    color: "#555",
    textAlign: "left",
    fontWeight: "bold",
  },
  chartContainer: {
    justifyContent: "space-evenly",
    flexDirection: "column",
    alignItems: "center",
    width: "35%",
  },
  fakeChart: {
    
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#D3D3D3",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 5,
    marginBottom: 9,
  },
  legendItem: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 10,
    alignItems: "center",
    
    //marginBottom: 0,
  },
  legendItemDown: {
    flexDirection: "row",
    marginEnd: -1,
    alignItems: "center",
    //marginBottom: 0,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 5,
  },
  legendText: {
    fontSize: 10,
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
});
