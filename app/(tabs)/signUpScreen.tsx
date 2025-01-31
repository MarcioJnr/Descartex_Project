import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { createStackNavigator } from "@react-navigation/stack";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../assets/firebaseConfig"; 
import { createUserWithEmailAndPassword } from 'firebase/auth';


type RootStackParamList = {
    homepage: undefined;
    // other routes can be added here
  };
  
  const Stack = createStackNavigator<RootStackParamList>();

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [CPF, setCPF] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [funct, setFunct] = useState("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  function SignUp() {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log('Usuário criado:', userCredential.user);
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            alert('Já existe uma conta com o endereço de email fornecido.');
          }
          if (error.code === 'auth/invalid-email') {
            alert('O endereço de email não é válido.');
          }
          console.error('Erro ao criar usuário:', error.code, error.message);
        });
    }

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
          
                    <TouchableOpacity style={styles.SignUpButton}>
                      <Text style={styles.loginButtonText}>Cadastrar</Text>
                    </TouchableOpacity>  

                    <TouchableOpacity>
                              <Text style={styles.SignInButton}>Já possui cadastro? Voltar para o login.</Text>
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