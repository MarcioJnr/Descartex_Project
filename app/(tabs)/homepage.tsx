import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function HomePage() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.logo}>LOGO</Text>
      <Text style={styles.greeting}>
        Olá, <Text style={styles.highlight}>Maria!</Text>
      </Text>
      <Text style={styles.info}>
        Você fez <Text style={styles.highlight}>3 registros</Text> de resíduos esta semana!
      </Text>

      {/* Weekly Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>RELATÓRIO SEMANAL</Text>
        <LineChart
          data={{
            labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
            datasets: [
              {
                data: [10, 20, 30, 50, 40, 60, 30],
              },
            ],
          }}
          width={screenWidth * 0.9}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#f5f5f5",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(73, 126, 19, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 2,
          }}
          bezier
        />
        <Text style={styles.totalInfo}>
          Você já registrou <Text style={styles.highlight}>100kg</Text> de resíduos essa semana.
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Novo Registro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCDEC4",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#497E13",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    color: "#333",
    marginBottom: 5,
  },
  highlight: {
    color: "#497E13",
    fontWeight: "bold",
  },
  info: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: "#EFE6DA",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  totalInfo: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
  },
  button: {
    backgroundColor: "#B17859",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "60%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
