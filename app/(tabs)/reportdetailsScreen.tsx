import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../assets/firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from 'react-native';

type ReportDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReportDetails'>;

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

export default function ReportDetailsScreen() {
  const navigation = useNavigation<ReportDetailsScreenNavigationProp>();
  const route = useRoute();
  const { id, date, type, weight, photoUrl, creatorName } = route.params as {
    id: string;
    date: string;
    type: string;
    weight: string;
    photoUrl: string;
    creatorName: string;
  };

  const [newWeight, setNewWeight] = useState<string>(weight ? weight.toString() : "");
  const [newType, setNewType] = useState(type);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    const weightNumber = Number(newWeight);
  
    if (!newWeight || isNaN(weightNumber) || weightNumber <= 0) {
      Alert.alert("Erro", "O peso deve ser um número válido maior que zero.");
      return;
    }
  
    try {
      const reportRef = doc(db, "reports", id);
      await updateDoc(reportRef, { weight: weightNumber, wasteType: newType });
      Alert.alert("Sucesso", "Relatório atualizado com sucesso!");
      setIsEditing(false);
      navigation.navigate("Reports", { refresh: true });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o relatório.");
    }
  };
  

  const handleDelete = async () => {
    Alert.alert("Excluir Relatório", "Tem certeza que deseja excluir este relatório?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "reports", id));
            Alert.alert("Sucesso", "Relatório excluído com sucesso!");
            navigation.navigate("Reports", { refresh: true });
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir o relatório.");
          }
        },
      },
    ]);
  };

  const wasteType = wasteTypes.find(w => w.name === newType) || wasteTypes[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Reports", { refresh: true })} style={styles.backButton}>
        <Text style={styles.backText}>{"< Voltar"}</Text>
      </TouchableOpacity>

      <View style={styles.typeContainer}>
        <Image source={wasteType.image} style={styles.icon} />
        {isEditing ? (
          <Picker
            selectedValue={newType}
            style={styles.picker}
            onValueChange={(itemValue) => setNewType(itemValue)}
          >
            {wasteTypes.map((waste) => (
              <Picker.Item key={waste.name} label={waste.name} value={waste.name} />
            ))}
          </Picker>
        ) : (
          <View style={styles.typeView}>
            <Text style={[styles.title, { color: wasteType.color }]}>{newType}</Text>
          </View>
        )}
      </View>

      <Image source={{ uri: photoUrl }} style={styles.image} />

      <Text style={styles.infoText}>Registrado em: {date}</Text>
      <Text style={styles.infoText}>Colaborador: {creatorName}</Text>

      <Text style={styles.label}>Peso:</Text>
      {isEditing ? (
        <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={newWeight}
        onChangeText={(text) => setNewWeight(text.replace(/[^0-9.]/g, ""))}
        maxLength={4}
        />      
      ) : (
        <Text style={styles.infoText}>{newWeight} kg</Text>
      )}

      {!isEditing ? (
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5DC", padding: 20 },
  backButton: { marginBottom: 20 },
  backText: { fontSize: 18, color: "#94451E" },
  typeContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  icon: { width: 40, height: 40, marginRight: 10 },
  typeView: { flex: 1, padding: 5 },
  title: { fontSize: 24, fontWeight: "bold" },
  picker: { height: 50, flex: 1, backgroundColor: "#FFF", borderWidth: 1, borderColor: "#94451E", borderRadius: 5 },
  image: { width: "100%", height: 250, borderRadius: 10, marginBottom: 20 },
  infoText: { fontSize: 16, color: "#94451E", marginBottom: 10 },
  label: { fontSize: 18, fontWeight: "bold", marginTop: 10, color: "#94451E", marginBottom: 5 },
  input: { backgroundColor: "#FFF", padding: 10, borderRadius: 5, fontSize: 16, marginBottom: 10, borderWidth: 1, borderColor: "#94451E" },
  editButton: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 5, alignItems: "center", marginTop: 20 },
  saveButton: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 5, alignItems: "center", marginTop: 20 },
  deleteButton: { backgroundColor: "#D9534F", padding: 15, borderRadius: 5, alignItems: "center", marginTop: 10 },
  buttonText: { fontSize: 16, color: "#FFF" },
});