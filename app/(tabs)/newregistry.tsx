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

  const handleWasteTypePress = (wastetype: string) => {
    navigation.navigate('CameraScreen', { wastetype });
  };

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
            onPress={() => handleWasteTypePress(waste.name)}
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
    padding: 20,
    backgroundColor: "#DCDEC4",
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  scrollContainer: {
    alignItems: "center",
  },
  wasteItem: {
    width: "100%",
    padding: 15,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  wasteImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  wasteText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  otherInput: {
    width: "100%",
    padding: 15,
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 10,
    marginTop: 20,
  },
});