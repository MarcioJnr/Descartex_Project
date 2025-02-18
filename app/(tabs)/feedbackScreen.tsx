import { RootStackParamList } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'react-native';

const FeedbackScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#DCDEC4' }}>
      <StatusBar backgroundColor="#DCDEC4" translucent={false} barStyle="dark-content" />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCDEC4",
    justifyContent: "center",
    alignItems: "center",
    
  },
  card: {
    backgroundColor: "#EBD0B5",
    padding: 20,
    borderWidth: 1,
    borderColor: "#94451E",
    borderRadius: 15,
    alignItems: "center",
    width: 340,
    height: 612,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#94451E",
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