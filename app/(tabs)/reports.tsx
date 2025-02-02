import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";

type ReportsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Reports'>;

export default function ReportsScreen() {
  const navigation = useNavigation<ReportsScreenNavigationProp>();

  // Substituir por dados do firebase
  const [residues, setResidues] = useState([
    { id: 1, date: "01/02/2025 - 11:35", type: "Isopor", weight: "550 g", checked: false },
    { id: 2, date: "01/02/2025 - 11:50", type: "Papel", weight: "600 g", checked: false },
    { id: 3, date: "01/02/2025 - 12:00", type: "Plástico", weight: "250 g", checked: false },
  ]);

  const toggleCheck = (id: number) => {
    setResidues((prevResidues) =>
      prevResidues.map((residue) =>
        residue.id === id ? { ...residue, checked: !residue.checked } : residue
      )
    );
  };

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
        <TouchableOpacity style={styles.collectButton}>
          <Text style={styles.collectButtonText}>Acionar Reciclo</Text>
        </TouchableOpacity>
      </View>
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
});