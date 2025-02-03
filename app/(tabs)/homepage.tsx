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
        <View style={styles.evolutionRow}>
          <Text style={styles.evolutionText}>Residômetro {localUserData?.totalWaste || 0} kg</Text>
        </View>
        <View style={styles.evolutionRow}>
          <Text style={styles.evolutionText}>Plástico</Text>
          <Text style={styles.evolutionText}>Vidro</Text>
        </View>
        <View style={styles.evolutionRow}>
          <Text style={styles.evolutionText}>Metal    Papel</Text>
        </View>
      </View>

      {/* Botões */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('NewRegistry')}
        >
          <Text style={styles.buttonText}>Novo Registro</Text>
          <Image source={require('../../assets/images/icon_cam.png')} style={styles.buttonIcon} />
  
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Reports')}
        >
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
    flex:1,
    borderRadius: 50,
    backgroundColor: "#EBD0B5",
    marginTop: 60,

  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#DCDEC4",
  },
  logo: {
    width: 250,
    height: 50,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
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
  evolutionsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: -50,
    padding: 15,
    width: "80%",
    marginBottom: 20,
    alignSelf: "center",

  },
  evolutionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  evolutionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  evolutionText: {
    fontSize: 16,
    color: "#333",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  button: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
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