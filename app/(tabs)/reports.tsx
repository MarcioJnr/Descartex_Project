import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { auth, db } from "../../assets/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { WebView } from 'react-native-webview';

type ReportsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Reports'>;

export default function ReportsScreen() {
  const navigation = useNavigation<ReportsScreenNavigationProp>();
  const [residues, setResidues] = useState<{ id: string; date: string; type: string; weight: string; checked: boolean }[]>([]); // Estado para armazenar os relatórios
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar a visibilidade da Modal

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          console.log("Usuário não autenticado.");
          navigation.navigate("Login");
          return;
        }

        const q = query(collection(db, "reports"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const reports: { id: string; date: string; type: string; weight: string; checked: boolean }[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          reports.push({
            id: doc.id,
            date: data.date,
            type: data.wasteType,
            weight: data.weight,
            checked: false,
          });
        });

        setResidues(reports);
      } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
        Alert.alert("Erro", "Ocorreu um erro ao buscar os relatórios.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const toggleCheck = (id: string) => {
    setResidues((prevResidues) =>
      prevResidues.map((residue) =>
        residue.id === id ? { ...residue, checked: !residue.checked } : residue
      )
    );
  };

  const openForm = () => {
    setIsModalVisible(true); // Abre a modal
  };

  const closeModal = () => {
    setIsModalVisible(false); // Fecha a modal
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#497E13" />
        <Text>Carregando relatórios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Relatório</Text>
      </View>

      {/* Filtros */}
      <View style={styles.filters}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Todas os resíduos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Período</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de resíduos */}
      <ScrollView style={styles.residuesList}>
        {residues.map((residue) => (
          <View key={residue.id} style={styles.residueItem}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => toggleCheck(residue.id)}
            >
              <Text style={styles.checkboxText}>{residue.checked ? "[X]" : "[ ]"}</Text>
            </TouchableOpacity>
            <Text style={styles.residueText}>
              {residue.date} - {residue.type} - {residue.weight}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Botões de ação */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.exportButton}>
          <Text style={styles.exportButtonText}>Exportar Relatórios em PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.collectButton} onPress={openForm}>
          <Text style={styles.collectButtonText}>Acionar Reciclo</Text>
        </TouchableOpacity>
      </View>

      {/* Modal com WebView */}
      <Modal visible={isModalVisible} animationType="slide" onRequestClose={closeModal}>
        <WebView
          source={{ uri: 'https://docs.google.com/forms/d/e/1FAIpQLSemQ-b7JKx9ht1rCsC9k1eSJWVAJsYuXbaJa0KdHyMs3kZhLg/viewform?usp=send_form' }}
          style={{ flex: 1 }}
        />
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: "#497E13",
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#333",
  },
  residuesList: {
    flex: 1,
    marginBottom: 20,
  },
  residueItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 16,
    color: "#333",
  },
  residueText: {
    fontSize: 14,
    color: "#555",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exportButton: {
    backgroundColor: "#B17859",
    padding: 15,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  exportButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  collectButton: {
    backgroundColor: "#497E13",
    padding: 15,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  collectButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    left: '40%',
    backgroundColor: '#497E13',
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
