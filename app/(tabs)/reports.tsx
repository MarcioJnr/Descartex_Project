import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal } from "react-native";
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
          <Image source={require('../../assets/images/icon_back.png')} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.title}>Relatórios</Text>
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

      <View>
      <TouchableOpacity style={styles.exportButton}>
        <Image source={require('../../assets/images/button_export_reports.png')}/>
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
      <View style={styles.collectButton}>
        <TouchableOpacity onPress={openForm}>
        <Image source={require('../../assets/images/button_adc_reciclo.png')}/>
        </TouchableOpacity>
      </View>

      {/* Modal com WebView */}
      <Modal visible={isModalVisible} animationType="slide" onRequestClose={closeModal}>
        <WebView
          source={{ uri: 'https://docs.google.com/forms/d/e/1FAIpQLSemQ-b7JKx9ht1rCsC9k1eSJWVAJsYuXbaJa0KdHyMs3kZhLg/viewform?usp=send_form' }}
          style={{ flex: 1 }}
        />
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
        <Image source={require('../../assets/images/button_adc_reciclo.png')}/>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCDEC4",
    padding: 20,
  },
  header: {
    width: "100%",
    height: 150,
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
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#94451E",
    textAlign: "center",
    marginTop: 15,
  },

  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 150,
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
  exportButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  collectButton: {
    alignItems: "center",
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
    alignSelf: "center",
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
