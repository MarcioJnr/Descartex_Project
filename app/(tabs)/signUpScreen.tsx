import React, { useState } from "react";
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { createStackNavigator } from "@react-navigation/stack";
import { auth, db } from "../../assets/firebaseConfig"; 
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { RootStackParamList } from "../../types";
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();

const isValidCPF = (cpf: string) => {
  return cpf.length === 11;
};

const isValidEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const isValidPhone = (phone: string) => {
  const re = /^\d{10,11}$/;
  return re.test(phone);
};

const isValidPassword = (password: string) => {
  return password.length >= 6; // Exemplo: senha deve ter pelo menos 6 caracteres
};

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [CPF, setCPF] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [funct, setFunct] = useState("Colaborador");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const SignUp = async () => {
    if (!name || !CPF || !email || !phone || !funct || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!isValidCPF(CPF)) {
      Alert.alert('Erro', 'CPF deve ter 11 dígitos.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Erro', 'E-mail inválido.');
      return;
    }

    if (!isValidPhone(phone)) {
      Alert.alert('Erro', 'Telefone inválido.');
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      // Criar usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Salvar informações no Firestore
      await setDoc(doc(db, 'users', userId), {
        name,
        CPF,
        email,
        phone,
        funct,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (error:any) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Já existe uma conta com o endereço de email fornecido.');
      }
      else if (error.code === 'auth/invalid-email') {
        alert('O endereço de email não é válido.');
      } else{
        console.error('Erro ao cadastrar:', error);
        Alert.alert('Erro', 'Ocorreu um erro desconhecido.'); // Adicionar alguns possíveis erros
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#DCDEC4' }}>
      <StatusBar backgroundColor="#DCDEC4" translucent={false} barStyle="dark-content" />
    <View style={styles.container}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      <View style={styles.form}>
        <Text style={styles.title}>Dados de cadastro</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          placeholderTextColor="#555"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Cpf"
          placeholderTextColor="#555"
          value={CPF}
          onChangeText={(text) => setCPF(text.replace(/[^0-9]/g, ''))} // Permitir apenas números
          maxLength={11} // Limitar a 11 dígitos
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          placeholderTextColor="#555"
          value={phone}
          onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))} 
          maxLength={11} 
        />
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Função Principal na Empresa</Text>
          <Picker
            selectedValue={funct}
            style={styles.picker}
            onValueChange={(itemValue) => setFunct(itemValue)}
          >
            <Picker.Item label="Colaborador" value="Colaborador" />
            <Picker.Item label="Analista" value="Analista" />
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#555"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.SignUpButton} onPress={SignUp}>
          <Text style={styles.loginButtonText}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.SignInButton}>Já possui cadastro? Voltar para o login.</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
}
    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCDEC4",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    marginTop: -50,
    marginBottom: 70,
  },

  form: {
    backgroundColor: "#EBD0B5",
    width: "75%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#94451E",
    padding: 20,
    alignItems: "center",
    marginTop: 0
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#94451E",
    marginBottom: 15,
    marginVertical: 30,

  },

  input: {
    width: "75%",
    fontSize: 14,
    padding: 5,
    marginVertical: 5,
    borderColor: "#000",
    borderBottomWidth: 1,
  },

  SignUpButton: {
    backgroundColor: "#F1EBDD",
    borderWidth: 1,
    borderColor: "#94451E",
    borderRadius: 5,
    width: "75%",
    padding: 5,
    alignItems: "center",
    marginTop: 70,
  },
  loginButtonText: {
    color: "#94451E",
    fontWeight: "bold",
  },

  SignInButton: {
    color: "#94451E",
    fontSize: 10.8,
    //marginTop: 10,
    marginBottom: 50,
    textDecorationLine: "underline",
  },

  pickerContainer: {
    width: "75%",
    marginVertical: 15,
  },
  pickerLabel: {
    width: "100%",
    fontSize: 14,
    marginBottom: 5,
  },
  picker: {
    width: "100%",
    borderColor: "#000",
    borderBottomWidth: 1,
  },
  
});