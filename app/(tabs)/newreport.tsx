import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { auth, db, storage } from "../../assets/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type Props = StackScreenProps<RootStackParamList, "NewReport">;

const NewReportScreen: React.FC<Props> = ({ route, navigation }) => {
  const { photo, text, wastetype, date } = route.params;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      console.log("Usuário não autenticado, redirecionando para Login...");
      navigation.navigate("Login");
    } else {
      console.log("Usuário autenticado:", auth.currentUser.uid);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#497E13" />
        <Text>Verificando autenticação...</Text>
      </View>
    );
  }

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
  
      console.log("Usuário autenticado:", user.uid);
  
      const photoRef = ref(storage, `reports/${user.uid}/${Date.now()}.jpg`);
      const response = await fetch(photo);
      const blob = await response.blob();
      await uploadBytes(photoRef, blob);
      const photoUrl = await getDownloadURL(photoRef);
  
      console.log("Foto salva no Storage, URL:", photoUrl);
  
      await addDoc(collection(db, "reports"), {
        userId: user.uid,
        wasteType: wastetype,
        weight: text,
        date: date,
        photoUrl: photoUrl,
        createdAt: serverTimestamp(),
      });
  
      console.log("Relatório salvo no Firestore com sucesso!");
      Alert.alert("Sucesso", "Relatório salvo com sucesso!");
      navigation.navigate("FeedbackScreen");
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      Alert.alert("Erro", "Ocorreu um erro ao salvar o relatório.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo }} style={styles.image} />
      <Text style={styles.dateText}>Registro: {formatDate(date)}</Text>
      <Text style={styles.wasteTypeText}>{wastetype}</Text>
      <Text style={styles.ocrText}>{text}</Text>
      <TouchableOpacity style={styles.confirmButton} onPress={saveReportToFirebase}>
        <Text style={styles.buttonText} >Confirmar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.retakeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Não, tirar outra foto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#DCDEC4",
  },
  image: {
    width: 300,
    height: 400,
    borderRadius: 10,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  wasteTypeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  ocrText: {
    fontSize: 20,
    color: "#333",
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
  },
  retakeButton: {
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#DCDEC4",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default NewReportScreen;