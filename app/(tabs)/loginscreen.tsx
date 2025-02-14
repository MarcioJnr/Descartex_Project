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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../assets/firebaseConfig"; 
import { RootStackParamList } from "../../types";


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();


  const handlePress = () => {
    SignIn();
    handleLogin();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atenção","Por favor, preencha todos os campos.");
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("Usuário logado:", user.email);
      navigation.replace("HomePage"); // Navega para a tela principal
    } catch (error) {
      console.error("Erro ao fazer login:", (error as any).message);
      Alert.alert("Erro","Erro ao fazer login: " + (error as any).message);
    }
  };

  function SignUp() {
    navigation.navigate("SignUp");
  }

  function SignIn() {
    signInWithEmailAndPassword(auth, email, password)
    .then(() => alert("Usuario logado!"))
    .catch(error => alert(error.message));
    //Lembrar de informar o erro ao usuário de forma mais amigável
  }


  return (
    <View style={styles.container}>
      {/* Logo */}
      
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />

        {/* Login Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#555"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handlePress}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleButton}>
          <Image source={require('../../assets/images/icon_google.png')} style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>
              Entrar com Google
            </Text>
          </TouchableOpacity>
          
        </View>

        <TouchableOpacity>
            <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
          </TouchableOpacity>

        <View style={styles.bottomLayout}>
          {/* Criar Conta */}
        <TouchableOpacity>
          <Text style={styles.createAccount}  onPress={SignUp} >Criar conta</Text>
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

  bottomLayout: {
    flex: 1,
    backgroundColor: "#EBD0B5",
    alignItems: "center",
    width: "100%",
    borderTopEndRadius: 50,
    borderTopStartRadius: 50,
    marginTop: 80,
  },

  logo: {
    marginTop: 80,
  },

  form: {
    backgroundColor: "#97BC39",
    width: "75%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginTop: 90
  },

  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#F1EBDD",
    marginBottom: 15,
  },

  input: {
    width: "75%",
    padding: 5,
    marginVertical: 15,
    borderColor: "#000",
    borderBottomWidth: 1,
  },

  loginButton: {
    backgroundColor: "#F1EBDD",
    borderWidth: 1,
    borderColor: "#94451E",
    borderRadius: 5,
    width: "75%",
    padding: 5,
    alignItems: "center",
    marginVertical: 20,
  },
  loginButtonText: {
    fontSize: 16,
    color: "#94451E",
    fontWeight: "bold",
  },
  googleButton: {
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#F1EBDD",
    borderRadius: 5,
    width: "75%",
    padding: 5,
    marginVertical: -10,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#94451E",
  },
  googleButtonText: {
    fontSize: 16,
    color: "#747375",
    fontWeight: "bold",
    marginRight: 10,
    shadowOpacity: 80,
  },
  googleIcon: {
    width: 15.75,
    height: 18,
    marginRight: 10,
    marginLeft: 14,
  },
  forgotPassword: {
    color: "#94451E",
    marginTop: 10,
    textDecorationLine: "underline",
  },
  createAccount: {
    color: "#94451E",
    width: "100%",
    marginTop: 25,
    textDecorationLine: "underline",
    padding: 10,
    borderRadius: 50,
    textAlign: "center",
    //width: "100%",
  },
})