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
      {/* Header */}
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Descarte*</Text>
      <Text style={styles.greeting}>
        Olá, <Text style={styles.highlight}>{localUserData?.name || "Usuário"}!</Text>
      </Text>
      <Text style={styles.info}>
        Já acumulamos <Text style={styles.highlight}>{localUserData?.totalWaste || 0}kg</Text> de resíduos esta semana.
      </Text>

      {/* Evoluções Semanais */}
      <View style={styles.evolutionsContainer}>
        <Text style={styles.evolutionsTitle}>EVOLUÇÕES SEMANAIS</Text>
        <View style={styles.evolutionRow}>
          <Text style={styles.evolutionText}>Residômetro {localUserData?.totalWaste || 0} kg</Text>
        </View>
        <View style={styles.evolutionRow}>
          <Text style={styles.evolutionText}>Plástico    Vidro</Text>
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
          <Image source={require('../../assets/images/icon_cam.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Novo Registro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Reports')}
        >
          <Image source={require('../../assets/images/icon_report.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Relatórios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCDEC4",
    alignItems: "center",
    padding: 20,
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  greeting: {
    fontSize: 20,
    color: "#333",
    marginBottom: 5,
  },
  highlight: {
    color: "#497E13",
    fontWeight: "bold",
  },
  info: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  evolutionsContainer: {
    backgroundColor: "#EFE6DA",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    marginBottom: 20,
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
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B17859",
    padding: 15,
    borderRadius: 10,
    width: "48%",
    justifyContent: "center",
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});