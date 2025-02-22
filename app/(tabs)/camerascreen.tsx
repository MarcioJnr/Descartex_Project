import React, { useState, useRef } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Button, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Image, Alert } from "react-native";
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types"; 
import { RouteProp } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'react-native';

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
          Alert.alert("Erro: Nenhum texto detectado.");
        }
      } else {
        Alert.alert("Erro: URI da foto não encontrado.");
      }
    }
  };

  const performOCR = async (photoUri: string) => {
    try {
      const apiKey = "AIzaSyBRQC80PTrBCVW_yrN3q2q34Y1AF9TtABA";
      const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  
      const optimizedImage = await ImageManipulator.manipulateAsync(
        photoUri,
        [{ resize: { width: 1500 } }],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );
  
      const base64Image = await FileSystem.readAsStringAsync(optimizedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const requestBody = {
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: "TEXT_DETECTION" }], 
          },
        ],
      };
  
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) throw new Error(`Erro na requisição: ${response.statusText}`);
  
      const data = await response.json();
      const text = data.responses[0]?.fullTextAnnotation?.text || "";
      console.log("Texto detectado:", text);
      
      const numbers = text.match(/\d+/g);

      if (!numbers || numbers.length === 0) return "Nenhum número detectado.";
      
      return parseInt(numbers.join('').slice(0, 4), 10).toString();

    } catch (error) {
      Alert.alert("Erro ao realizar leitura:", String(error));
      return null;
    }
  };
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#DCDEC4' }}>
      <StatusBar backgroundColor="#DCDEC4" translucent={false} barStyle="dark-content" />
    <View style={styles.container}>

    <View style={styles.headerContainer}>
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/images/icon_back.png')} style={styles.backButton} />
      </TouchableOpacity>
      <Text style={styles.header}>Fotografe o resíduo</Text>
      <Text style={styles.subHeader}>Centralize o valor na moldura</Text>
    
    </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBD0B5",
  },
  headerContainer:{
    flex: 1,
    width: "100%",
    height: 170,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#DCDEC4",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
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
    //marginTop: 20,
    color: "#94451E",
  },
  subHeader: {
    textAlign: "center",
    fontSize: 16,
    color: "#94451E",
    marginBottom: 20,
  },
  camera: {
    height: 534,
    marginHorizontal: 40,
    marginTop: 180,
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