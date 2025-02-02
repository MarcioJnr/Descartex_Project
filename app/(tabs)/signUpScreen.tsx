import React, { useState } from "react";
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

  
  const Stack = createStackNavigator<RootStackParamList>();

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [CPF, setCPF] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [funct, setFunct] = useState("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  
        const SignUp = async () => {
          if (!name || !CPF || !email || !phone || !funct || !password) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
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
        <View style={styles.container}>

          <Text style={styles.logo}>LOGO</Text>

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
                      placeholder="CPF"
                      placeholderTextColor="#555"
                      value={CPF}
                      onChangeText={setCPF}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#555"
                      value={email}
                      onChangeText={setEmail}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Telefone"
                      placeholderTextColor="#555"
                      value={phone}
                      onChangeText={setPhone}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Função Principal na Empresa"
                      placeholderTextColor="#555"
                      value={funct}
                      onChangeText={setFunct}
                    />

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
                              <Text style={styles.SignInButton} >Já possui cadastro? Voltar para o login.</Text>
                            </TouchableOpacity>

                  </View>

        </View>
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
        fontSize: 32,
        fontWeight: "bold",
        color: "#497E13",
        marginBottom: 20,
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
        marginVertical: 15,
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
      
    })