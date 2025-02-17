import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../assets/firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'react-native';

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
      navigation.replace("Reports", { refresh: true });
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
            navigation.replace("Reports", { refresh: true });
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir o relatório.");
          }
        },
      },
    ]);
  };

  const wasteType = wasteTypes.find(w => w.name === newType) || wasteTypes[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#DCDEC4' }}>
      <StatusBar backgroundColor="#DCDEC4" translucent={false} barStyle="dark-content" />
      <View style={styles.container}>

      <View style={styles.containerDetails}>
      <TouchableOpacity onPress={() => navigation.navigate("Reports", { refresh: true })} style={styles.backButton}>
        <Image source={require('../../assets/images/icon_back.png')} style={styles.backButton} />
      </TouchableOpacity>

      <View style={styles.details}>
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

      <View style={styles.containerText}>
      <Text style={styles.infoText}>Registrado em: {date}</Text>
      <Text style={styles.infoText}>Colaborador: {creatorName}</Text>

      <View style={styles.containerInput}>
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
      </View>
      
      </View>

      <View style={styles.containerButton}>
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
      
      </View>

      </View>
      
    </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: { 
  flex: 1,
  backgroundColor: "#DCDEC4",
  //padding: 20,
  },
  containerDetails: {
    backgroundColor: "#EBD0B5",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#94451E",
    marginTop: 30,
    height: "100%",
    padding: 20,
  },
  details:{
    alignItems: "center",
  },
  backButton: {
    marginBottom: 20, 
  },
  backText: { 
    fontSize: 18, 
    color: "#94451E" 
  },
  typeContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 20 
  },
  icon: { 
    width: 40, 
    height: 40, 
    marginRight: 10, 
  },
  typeView: { 
    padding: 5 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold" 
  },
  picker: {
    width: 150,
     height: 60,  
    },
  image: { 
    width: 277, 
    height: 402, 
    borderRadius: 10, 
    marginBottom: 20 
  },
  containerText:{
    flexDirection: "column",
  },
  infoText: { 
    fontSize: 15, 
    fontWeight: "500",
    color: "#94451E", 
    marginBottom: 10 
  },
  containerInput:{
    alignItems: "center",
    flexDirection: "row",
  },
  label: {
     fontSize: 15, 
     fontWeight: "500",
     width: 50, 
     color: "#94451E", 
     marginBottom: 10 
    },
  input: { 
    alignItems: "center",
    textDecorationLine: "underline",
    fontSize: 14, 
    //marginBottom: 10,
    height: 35
    //borderWidth: 1, 
    //borderColor: "#94451E" 
  },
  containerButton: {
    alignItems: "center",

  },
  editButton: { 
    backgroundColor: "#497E13",
    width: 223,
    height: 29, 
    padding: 3, 
    borderRadius: 5, 
    alignItems: "center", 
    marginTop: 20 
  },
  saveButton: { 
    backgroundColor: "#497E13", 
    width: 223,
    height: 29, 
    padding: 3, 
    borderRadius: 5, 
    alignItems: "center", 
    marginTop: 20 
  },
  deleteButton: { 
    backgroundColor: "#94451E", 
    width: 223,
    height: 29, 
    padding: 3, 
    borderRadius: 5, 
    alignItems: "center", 
    marginTop: 10 
  },
  buttonText: { 
    fontSize: 16, 
    color: "#FFF" 
  },
});