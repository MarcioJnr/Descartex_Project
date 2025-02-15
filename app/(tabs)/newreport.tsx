import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { auth, db, storage } from "../../assets/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type Props = StackScreenProps<RootStackParamList, "NewReport">;

const NewReportScreen: React.FC<Props> = ({ route, navigation }) => {
  const { photo, text, wastetype, date } = route.params;

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

  const selectedWasteType = wasteTypes.find(type => type.name === wastetype);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("pt-BR")} - ${date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const saveReportToFirebase = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      // Converter o valor para número e garantir que seja tratado como gramas
      const weightInGrams = parseFloat(text) / 1000;

      const photoRef = ref(storage, `reports/${user.uid}/${Date.now()}.jpg`);
      const response = await fetch(photo);
      const blob = await response.blob();
      await uploadBytes(photoRef, blob);
      const photoUrl = await getDownloadURL(photoRef);

      console.log("Foto salva no Storage, URL:", photoUrl);

      await addDoc(collection(db, "reports"), {
        userId: user.uid,
        wasteType: wastetype,
        weight: weightInGrams,
        date: date,
        photoUrl: photoUrl,
        createdAt: serverTimestamp(),
      });

      console.log("Relatório salvo no Firestore com sucesso!");
      Alert.alert("Sucesso", "Relatório salvo com sucesso!");
      navigation.navigate("HomePage");
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      Alert.alert("Erro", "Ocorreu um erro ao salvar o relatório.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar?</Text>
      <View style={styles.card}>
        <Text style={styles.dateText}>Registro ({formatDate(date)})</Text>
        <View style={styles.wasteTypeContainer}>
          <Image source={selectedWasteType?.image} style={styles.wasteTypeImage} />
          <Text style={styles.wasteTypeText}>{wastetype}</Text>
          <Text style={styles.weightText}>{text}g</Text>
        </View>
        <Image source={{ uri: photo }} style={styles.image} />
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={saveReportToFirebase}>
        <Text style={styles.confirmButtonText}>Confirmar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Não, tirar outra foto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DCDEC4",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6D3B17",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#F7E5D1",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#B35A19",
    marginBottom: 10,
  },
  wasteTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    marginBottom: 15,
  },
  wasteTypeImage: {
    width: 40,
    height: 40,
  },
  wasteTypeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginRight: 10,
  },
  weightText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
  },
  image: {
    width: 250,
    height: 400,
    borderRadius: 10,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#E5B288",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginTop: 15,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6D3B17",
  },
  cancelButton: {
    backgroundColor: "#6D3B17",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export default NewReportScreen;