import { RootStackParamList } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const FeedbackScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Resíduo Registrado com Sucesso!</Text>
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('NewRegistry')}>
          <Text style={styles.buttonText}>Novo Registro</Text>
          <Image source={require("./../../assets/images/icon_cam.png")} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('HomePage')}>
          <Text style={styles.buttonText}>Voltar para a página inicial</Text>
          <Image source={require("./../../assets/images/icon_home.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9D9B2",
    justifyContent: "center",
    alignItems: "center",
    
  },
  card: {
    backgroundColor: "#E7C2A0",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    width: "80%",
    height: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#723B19",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 80
  },
  button: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#94451E",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    width: 115,
    height: 115,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  buttonText: {
    color: "#94451E",
    fontWeight: "bold",
    fontSize: 11,
    marginBottom: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
});

export default FeedbackScreen;