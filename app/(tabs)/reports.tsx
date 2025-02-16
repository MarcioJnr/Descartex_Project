import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { auth, db } from "../../assets/firebaseConfig";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { WebView } from 'react-native-webview';

type ReportsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Reports'>;

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

export default function ReportsScreen() {
  const navigation = useNavigation<ReportsScreenNavigationProp>();
  const [residues, setResidues] = useState<{ id: string; date: string; type: string; weight: string; photoUrl: string; userId: string; creatorName: string; checked: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  const getWasteIcon = (type: string) => {
    const wasteType = wasteTypes.find(waste => waste.name === type);
    return wasteType ? wasteType.image : null;
  };

  const fetchCreatorName = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data().name;
      }
      return "Desconhecido";
    } catch (error) {
      console.error("Erro ao buscar nome do usuário:", error);
      return "Desconhecido";
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          console.log("Usuário não autenticado.");
          navigation.navigate("Login");
          return;
        }

        const q = query(collection(db, "reports"));
        const querySnapshot = await getDocs(q);

        const reports = [];
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          const creatorName = await fetchCreatorName(data.userId);
          reports.push({
            id: doc.id,
            date: data.date,
            type: data.wasteType,
            weight: data.weight,
            photoUrl: data.photoUrl,
            userId: data.userId,
            creatorName: creatorName,
            checked: false,
          });
        }

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

  const openForm = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePage')}>
          <Image source={require('../../assets/images/icon_back.png')} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.title}>Relatórios</Text>
      </View>

      <View style={styles.filters}>
        <TouchableOpacity style={styles.filterButtonResidue}>
          <Text style={styles.filterButtonText}>Todos os resíduos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButtonPeriod}>
          <Text style={styles.filterButtonText}>Período</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity style={styles.exportButton}>
          <Image source={require('../../assets/images/button_export_reports.png')}/>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.residuesList}>
        {residues.map((residue) => (
          <TouchableOpacity key={residue.id} style={styles.residueItem}
            onPress={() => navigation.navigate("ReportDetails", {
              id: residue.id,
              date: formatDate(residue.date),
              type: residue.type,
              weight: residue.weight,
              photoUrl: residue.photoUrl,
              creatorName: residue.creatorName,
            })}
          >
            <Image source={{ uri: residue.photoUrl }} style={styles.residueImage} />
            <View style={styles.residueInfo}>
              <View style={styles.residueTypeContainer}>
                <Image source={getWasteIcon(residue.type)} style={styles.wasteIcon} />
                <Text style={styles.residueTypeText}>{residue.type}</Text>
              </View>
              <Text style={styles.residueText}>Registrado em: {formatDate(residue.date)}</Text>
              <Text style={styles.residueText}>Colaborador: {residue.creatorName}</Text>
              <Text style={styles.residueText}>Peso: {residue.weight} g</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.collectButton}>
        <TouchableOpacity onPress={openForm}>
          <Image source={require('../../assets/images/button_adc_reciclo.png')}/>
        </TouchableOpacity>
      </View>

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
    width: "110%",
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
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#94451E",
    textAlign: "center",
    marginTop: 37,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 210,
    marginBottom: 20,
  },
  filterButtonResidue: {
    backgroundColor: "#F1EBDD",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#94451E",
    width: 239,
    height: 29,
    alignItems: "center",
  },
  filterButtonPeriod: {
    backgroundColor: "#F1EBDD",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#94451E",
    width: 104,
    height: 29,
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
    backgroundColor: "#F1EBDD",
    borderWidth: 1,
    borderColor: "#94451E",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  residueImage: {
    width: 90,
    height: 90,
    borderRadius: 25,
    marginRight: 10,
  },
  residueInfo: {
    flex: 1,
  },
  residueTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  wasteIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  residueTypeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94451E",
  },
  residueText: {
    fontSize: 14,
    color: "#94451E",
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