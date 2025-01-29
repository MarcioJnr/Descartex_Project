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

type RootStackParamList = {
  homepage: undefined;
  // other routes can be added here
};

const Stack = createStackNavigator<RootStackParamList>();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("Usuário logado:", user.email);
      navigation.navigate("homepage"); // Navega para a tela principal
    } catch (error) {
      console.error("Erro ao fazer login:", (error as any).message);
      alert("Erro ao fazer login: " + (error as any).message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      
        <Text style={styles.logo}>LOGO</Text>

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

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleButton}>
            <Text style={styles.googleButtonText}>
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
                }}
                style={styles.googleIcon}
              />
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
          <Text style={styles.createAccount}>Criar conta</Text>
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
    marginTop: 115,
  },

  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#497E13",
    marginBottom: 20,
  },

  form: {
    backgroundColor: "#97BC39",
    width: "75%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginTop: 50
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
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
    color: "#94451E",
    fontWeight: "bold",
  },
  googleButton: {

    alignItems: "center",
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
    color: "#747375",
    fontWeight: "bold",
    marginRight: 10,
    shadowOpacity: 80,
  },
  googleIcon: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  forgotPassword: {
    color: "#94451E",
    marginTop: 10,
    textDecorationLine: "underline",
  },
  createAccount: {
    color: "#94451E",
    width: "100%",
    marginTop: 30,
    textDecorationLine: "underline",
    padding: 10,
    borderRadius: 50,
    textAlign: "center",
    //width: "100%",
  },
})