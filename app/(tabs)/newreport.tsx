import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";

type Props = StackScreenProps<RootStackParamList, "NewReport">;

const NewReportScreen: React.FC<Props> = ({ route, navigation }) => {
  const { photo, text, wastetype, date } = route.params;

  // Formata a data e hora para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("pt-BR")} - ${date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo }} style={styles.image} />
      <Text style={styles.dateText}>Registro: {formatDate(date)}</Text>
      <Text style={styles.wasteTypeText}>{wastetype}</Text>
      <Text style={styles.ocrText}>{text}</Text>
      <TouchableOpacity style={styles.confirmButton} onPress={() => navigation.navigate("HomePage")}>
        <Text style={styles.buttonText}>Confirmar</Text>
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
    backgroundColor: "#f5f5f5",
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
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default NewReportScreen;