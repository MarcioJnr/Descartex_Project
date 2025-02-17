import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { auth, db } from "../../assets/firebaseConfig";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { WebView } from 'react-native-webview';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import * as MailComposer from 'expo-mail-composer';
import { fetchUserData, UserData } from "../../assets/fetchUserData";
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native';

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
  const [isPeriodModalVisible, setIsPeriodModalVisible] = useState(false);
  const [isWasteTypeModalVisible, setIsWasteTypeModalVisible] = useState(false);
  const [selectedWasteType, setSelectedWasteType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

        // Aplicar filtro de tipo de resíduo
        if (selectedWasteType && data.wasteType !== selectedWasteType) {
          continue;
        }

        // Aplicar filtro de data
        const reportDate = new Date(data.date);
        if (selectedDate) {
          // Comparar apenas o dia, mês e ano, ignorando horas, minutos e fuso horário
          const selectedDateStart = new Date(selectedDate);
          selectedDateStart.setHours(0, 0, 0, 0); // Define para o início do dia selecionado

          if (reportDate < selectedDateStart) {
            continue;
          }
        }

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

      // Ordenar os relatórios pela data (mais recente primeiro)
      reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setResidues(reports);
    } catch (error) {
      console.error("Erro ao buscar relatórios:", error);
      Alert.alert("Erro", "Ocorreu um erro ao buscar os relatórios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedWasteType, selectedDate]);

  const openForm = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleWasteTypeFilter = (type: string | null) => {
    setSelectedWasteType(type);
    setIsWasteTypeModalVisible(false);
  };

  const handleDateFilter = (date: Date | null) => {
    setSelectedDate(date);
    setIsPeriodModalVisible(false);
  };

  const generatePdf = async () => {
    try {
      setLoading(true);

      const userData = await fetchUserData();
      const userEmail = userData?.email;
      console.log("E-mail do usuário:", userEmail);

      if (!userEmail) {
        Alert.alert("Erro", "Não foi possível obter o e-mail do usuário.");
        return;
      }

      const canSendMail = await MailComposer.isAvailableAsync();
      console.log("E-mail disponível?", canSendMail);

      if (!canSendMail) {
        Alert.alert("Erro", "Nenhum cliente de e-mail configurado.");
        return;
      }

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #94451E; text-align: center; }
              .report { 
                margin-bottom: 20px; 
                padding: 15px; 
                border: 1px solid #94451E; 
                border-radius: 10px; 
                background-color: #F1EBDD; 
                display: flex; 
                align-items: center; 
              }
              .report img { 
                width: 150px; 
                height: 150px; 
                border-radius: 10px; 
                margin-right: 20px; 
              }
              .report h2 { font-size: 20px; color: #94451E; margin: 0; }
              .report p { font-size: 16px; color: #94451E; margin: 5px 0; }
            </style>
          </head>
          <body>
            <h1>Relatórios de Resíduos</h1>
            ${residues.map(residue => `
              <div class="report">
                <img src="${residue.photoUrl}" alt="${residue.type}" />
                <div>
                  <h2>${residue.type}</h2>
                  <p><strong>Data:</strong> ${formatDate(residue.date)}</p>
                  <p><strong>Colaborador:</strong> ${residue.creatorName}</p>
                  <p><strong>Peso:</strong> ${residue.weight} g</p>
                </div>
              </div>
            `).join('')}
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
      });

      const pdfName = `${FileSystem.documentDirectory}relatorios.pdf`;
      await FileSystem.moveAsync({
        from: uri,
        to: pdfName,
      });

      console.log("Caminho do PDF:", pdfName);

      // Compartilhar o PDF
      await shareAsync(pdfName, { UTI: '.pdf', mimeType: 'application/pdf' });

      // Enviar o PDF por e-mail
      await MailComposer.composeAsync({
        recipients: [userEmail],
        subject: 'Relatórios de Resíduos',
        body: 'Segue em anexo o relatório de resíduos.',
        attachments: [pdfName],
      });

      console.log('PDF gerado, compartilhado e enviado por e-mail com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      Alert.alert("Erro", "Ocorreu um erro ao gerar o PDF.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#497E13" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#497E13" />
          <Text style={styles.loadingText}>Gerando PDF...</Text>
        </View>
      )}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('HomePage')}>
          <Image source={require('../../assets/images/icon_back.png')} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.title}>Relatórios</Text>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filtersRow}>
          <TouchableOpacity style={styles.filterButton} onPress={() => setIsWasteTypeModalVisible(true)}>
            <Text style={styles.filterButtonText}>
              {selectedWasteType || "Todos os resíduos"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => setIsPeriodModalVisible(true)}>
            <Text style={styles.filterButtonText}>
              {selectedDate ? selectedDate.toLocaleDateString('pt-BR') : "Período"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={() => { setSelectedWasteType(null); setSelectedDate(null); }}>
          <Text style={styles.resetButtonText}>Limpar Filtros</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity style={styles.exportButton} onPress={generatePdf}>
          <Image source={require('../../assets/images/button_export_reports.png')} />
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
              <Text style={styles.residueText}>Peso: {residue.weight} Kg</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.collectButton}>
        <TouchableOpacity onPress={openForm}>
          <Image source={require('../../assets/images/button_adc_reciclo.png')} />
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} animationType="slide" onRequestClose={closeModal}>
        <WebView
          source={{ uri: 'https://docs.google.com/forms/d/e/1FAIpQLSemQ-b7JKx9ht1rCsC9k1eSJWVAJsYuXbaJa0KdHyMs3kZhLg/viewform?usp=send_form' }}
          style={{ flex: 1 }}
        />
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
      </Modal>

      <Modal visible={isPeriodModalVisible} animationType="slide" onRequestClose={() => setIsPeriodModalVisible(false)}>
        <View style={styles.periodModal}>
          <Calendar
            onDayPress={(day: { dateString: string }) => {
              const selectedDate = new Date(`${day.dateString}T00:00:00`); 
              setSelectedDate(selectedDate);
            }}
            markedDates={{
              [selectedDate ? selectedDate.toISOString().split('T')[0] : '']: { selected: true, selectedColor: '#497E13' },
            }}
          />
          <TouchableOpacity onPress={() => handleDateFilter(selectedDate)} style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Aplicar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={isWasteTypeModalVisible} animationType="slide" onRequestClose={() => setIsWasteTypeModalVisible(false)}>
        <View style={styles.wasteTypeModal}>
          {wasteTypes.map((waste) => (
            <TouchableOpacity key={waste.name} onPress={() => handleWasteTypeFilter(waste.name)} style={styles.wasteTypeOption}>
              <Text style={styles.wasteTypeText}>{waste.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => handleWasteTypeFilter(null)} style={styles.wasteTypeOption}>
            <Text style={styles.wasteTypeText}>Todos os resíduos</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCDEC4",
    padding: 20,
  },
  header: {
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
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#94451E",
    textAlign: "center",
    marginTop: 37,
  },
  filtersContainer: {
    marginTop: 210,
    marginBottom: 20,
  },
  filtersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: "#F1EBDD",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#94451E",
    padding: 10,
    width: "48%", // Ajuste para caber dois botões na mesma linha
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#333",
  },
  resetButton: {
    backgroundColor: "#F1EBDD",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#94451E",
    padding: 10,
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 14,
    color: "#94451E",
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
    padding: 10,
    backgroundColor: "#9B111E",
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 999,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#497E13',
  },
  periodModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
  },
  applyButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#497E13',
    borderRadius: 5,
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  wasteTypeModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
  },
  wasteTypeOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    width: '100%',
    alignItems: 'center',
  },
  wasteTypeText: {
    fontSize: 16,
    color: '#94451E',
  },
});