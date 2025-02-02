import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { useAuth } from "../../assets/AuthContext";

type HomePageNavigationProp = StackNavigationProp<RootStackParamList, 'HomePage'>;

export default function HomePage() {
  const { user } = useAuth();
  const navigation = useNavigation<HomePageNavigationProp>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Descarte*</Text>
      <Text style={styles.greeting}>
        Olá, <Text style={styles.highlight}>Márcia!</Text>
      </Text>
      <Text style={styles.info}>
        Já acumulamos <Text style={styles.highlight}>100kg</Text> de resíduos esta semana.
      </Text>

      {/* Evoluções Semanais */}
      <View style={styles.evolutionsContainer}>
        <Text style={styles.evolutionsTitle}>EVOLUÇÕES SEMANAIS</Text>
        <View style={styles.evolutionRow}>
          <Text style={styles.evolutionText}>Residômetro 100 kg</Text>
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
          onPress={() => navigation.navigate('Reports')} // Altere para a tela de relatórios
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
  logo: {
    width: 250, // Ajustado para ficar proporcional
    height: 50, // Ajustado para ficar proporcional
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