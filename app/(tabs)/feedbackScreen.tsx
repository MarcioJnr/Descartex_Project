import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const FeedbackScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Resíduo Registrado com Sucesso!</Text>
        
        <TouchableOpacity style={styles.button}>
          <Image source={require("./../../assets/images/icon_cam.png")} style={styles.icon} />
          <Text style={styles.buttonText}>Novo Registro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Image source={require("./../../assets/images/icon_home.png")} style={styles.icon} />
          <Text style={styles.buttonText}>Voltar para a página inicial</Text>
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
    borderWidth: 2,
    borderColor: "#2186C4",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#723B19",
    textAlign: "center",
    marginBottom: 20,
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