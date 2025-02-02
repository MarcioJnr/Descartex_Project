import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";

type NewRegistryNavigationProp = StackNavigationProp<RootStackParamList, 'NewRegistry'>;

export default function NewRegistry() {
  const navigation = useNavigation<NewRegistryNavigationProp>();

  const wasteTypes = [
    { name: "Plástico", color: "#FF3B30", image: require("../../assets/images/vector_plastico.png") },
    { name: "Papel", color: "#007AFF", image: require("../../assets/images/vector_papel.png") },
    { name: "Metal", color: "#FFCC00", image: require("../../assets/images/vector_metal.png") },
    { name: "Vidro", color: "#34C759", image: require("../../assets/images/vector_vidro.png") },
    { name: "Orgânico", color: "#8E5D3D", image: require("../../assets/images/vector_organico.png") },
    { name: "Rejeito", color: "#AF52DE", image: require("../../assets/images/vector_rejeito.png") },
    { name: "Eletrônico", color: "#000000", image: require("../../assets/images/vector_eletronico.png") },
    { name: "Isopor", color: "#FF2D55", image: require("../../assets/images/vector_isopor.png") }
  ];

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>Selecione o tipo do resíduo</Text>

      {/* Lista de resíduos */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {wasteTypes.map((waste, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.wasteItem, { borderColor: waste.color }]} 
            onPress={() => {/* Lógica para selecionar o resíduo */}}
          >
            <Image source={waste.image} style={styles.wasteImage} />
            <Text style={[styles.wasteText, { color: waste.color }]}>{waste.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input para "Outro" */}
      <TextInput style={styles.otherInput} placeholder="Outro" placeholderTextColor="#333" />
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#8B572A",
    marginBottom: 20,
  },
  scrollContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
  wasteItem: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    backgroundColor: "#FFF",
  },
  wasteImage: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  wasteText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  otherInput: {
    borderBottomWidth: 1,
    borderColor: "#333",
    width: "80%",
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backButtonText: {
    color: "#8B572A",
    fontSize: 16,
    fontWeight: "bold",
  },
});
