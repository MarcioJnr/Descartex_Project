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

      <View style={styles.headerContainer}>
        {/* Botão de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/images/icon_back.png')} style={styles.backButton} />
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>Selecione o tipo do resíduo</Text>

      </View>

      {/* Lista de resíduos */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
  <View style={styles.gridContainer}>
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
  </View>
</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 180,
    padding: 20,
    backgroundColor: "#DCDEC4",
  },
  headerContainer:{
    flex: 1,
    width: "111%",
    height: 208,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#EBD0B5",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  backButton: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginTop: 25,
    fontWeight: "bold",
    color: "#94451E",
    alignSelf: "center",
    textAlignVertical: "center",
  },
  scrollContainer: {
    marginTop: 60,
    alignItems: "center",
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 100,
    rowGap: 25,
  },
  wasteItem: {
    backgroundColor: "#FFFFFF",
    width: 100,
    height: 100,
    padding: 15,
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },  
  wasteImage: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
  wasteText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  otherInput: {
    width: 240,
    height: 21,
    padding: 5,
    marginVertical: 15,
    borderColor: "#000",
    borderBottomWidth: 1,
    alignSelf: "center",
  },
});