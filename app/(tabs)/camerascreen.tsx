import React, { useState, useRef } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from "react-native";  // Importando ActivityIndicator
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types"; 
import { RouteProp } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CameraScreen'>;
type CameraScreenRouteProp = RouteProp<RootStackParamList, 'CameraScreen'>;

type Props = {
  navigation: CameraScreenNavigationProp;
  route: CameraScreenRouteProp;
};

export default function CameraScreen({ route }: Props) {
  const wastetype = route.params?.wastetype;
  const [facing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);  // Adicionando o estado de loading
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation<CameraScreenNavigationProp>();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos da sua permissão para acessar a câmera</Text>
        <Button onPress={requestPermission} title="Conceder permissão" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo && photo.uri) {
        const currentDate = new Date(); // Captura a data e hora atual
        setPhoto(photo.uri);
        setLoading(true);  // Ativa o carregamento

        // Navega para a tela NewReport com a foto, texto, wasteType e a data/hora
        const text = await performOCR(photo.uri); // Realiza o OCR na foto
        setLoading(false);  // Desativa o carregamento após o OCR

        if (text) {
          navigation.navigate("NewReport", {
            photo: photo.uri,
            text,
            wastetype,
            date: currentDate.toISOString(), // Passa a data/hora como string
          });
        } else {
          console.error("Erro: Nenhum texto detectado.");
        }
      } else {
        console.error("Erro: URI da foto não encontrado.");
      }
    }
  };

  const performOCR = async (photoUri: string) => {
    try {
      const apiKey = "AIzaSyBRQC80PTrBCVW_yrN3q2q34Y1AF9TtABA";
      const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  
      const base64Image = await FileSystem.readAsStringAsync(photoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: "TEXT_DETECTION",
              },
            ],
          },
        ],
      };
  
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
  
      const data = await response.json();
      const text = data.responses[0]?.fullTextAnnotation?.text || "Nenhum texto detectado.";
      return text;
    } catch (error) {
      console.error("Erro ao realizar OCR:", error);
      return null;
    }
  };
  
  return (
    <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.captureContainer}>
            <Text style={styles.captureText}>Fotografe o resíduo</Text>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Ionicons name="camera" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Processando imagem...</Text>
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  captureContainer: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    alignItems: "center",
  },
  captureText: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
  },
  captureButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 50,
    padding: 20,
  },
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    borderRadius: 10,
  },
  loadingText: {
    color: "white",
    marginTop: 10,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 10,
  },
});
