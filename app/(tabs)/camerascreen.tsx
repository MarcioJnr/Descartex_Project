import React, { useState, useRef } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Button, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Image } from "react-native";
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
  const [loading, setLoading] = useState<boolean>(false);
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
        const currentDate = new Date();
        setLoading(true);
        const text = await performOCR(photo.uri);
        setLoading(false);

        if (text) {
          navigation.navigate("NewReport", {
            photo: photo.uri,
            text,
            wastetype,
            date: currentDate.toISOString(),
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
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/images/icon_back.png')} style={styles.backButton} />
      </TouchableOpacity>
      <Text style={styles.header}>Fotografe o resíduo</Text>
      <Text style={styles.subHeader}>Centralize o valor na moldura</Text>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={styles.overlayTop} />
          <View style={styles.overlayBottom} />
          <View style={styles.overlayLeft} />
          <View style={styles.overlayRight} />
          <View style={styles.frame}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
        </View>
      </CameraView>
      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Ionicons name="camera" size={32} color="white" />
      </TouchableOpacity>

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
    backgroundColor: "#F4EDE4",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionMessage: {
    textAlign: "center",
    paddingBottom: 10,
  },
  header: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: "#6B4226",
  },
  subHeader: {
    textAlign: "center",
    fontSize: 16,
    color: "#6B4226",
    marginBottom: 20,
  },
  camera: {
    height: 600,
    marginHorizontal: 40,
    borderRadius: 10,
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "10%", // Ajuste para alinhar com o frame
    backgroundColor: "rgba(163, 163, 163, 0.5)",
  },
  overlayBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "78%", // Ajuste para alinhar com o frame
    backgroundColor: "rgba(163, 163, 163, 0.5)",
  },
  overlayLeft: {
    position: "absolute",
    top: "10%", // Ajuste para alinhar com o frame
    left: 0,
    width: "25%",
    height: "12%", // Ajuste para alinhar com o frame
    backgroundColor: "rgba(163, 163, 163, 0.5)",
  },
  overlayRight: {
    position: "absolute",
    top: "10%", // Ajuste para alinhar com o frame
    right: 0,
    width: "25%",
    height: "12%", // Ajuste para alinhar com o frame
    backgroundColor: "rgba(163, 163, 163, 0.5)",
  },
  frame: {
    width: 178,
    height: 71,
    borderWidth: 2,
    borderColor: "white",
    position: "absolute",
    top: "10%",
    left: "25%",
  },
  cornerTopLeft: {
    position: "absolute",
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "red",
  },
  cornerTopRight: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "red",
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: -2,
    left: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "red",
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "red",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  backButton: {
    marginBottom: 10,
  },
  captureButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 20,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loadingText: {
    color: "white",
    marginTop: 10,
  },
});