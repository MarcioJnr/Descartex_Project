import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onPress = () => ("/tabs");

  const handleLogin = () => {
    console.log("E-mail:", email);
    console.log("Senha:", password);

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

        <TouchableOpacity style={styles.loginButton} onPress={onPress}>
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

      {/* Criar Conta */}
      <TouchableOpacity>
        <Text style={styles.createAccount}>Criar conta</Text>
      </TouchableOpacity>
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
    backgroundColor: "#9ACA3C",
    width: "80%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#FFF",
    width: "100%",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    borderColor: "#CCC",
    borderWidth: 1,
  },
  loginButton: {
    backgroundColor: "#EFE6DA",
    borderRadius: 5,
    width: "100%",
    padding: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  loginButtonText: {
    color: "#B17859",
    fontWeight: "bold",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 5,
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  googleButtonText: {
    color: "#555",
    fontWeight: "bold",
  },
  googleIcon: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  forgotPassword: {
    color: "#B17859",
    marginTop: 10,
    textDecorationLine: "underline",
  },
  createAccount: {
    color: "#B17859",
    marginTop: 20,
    textDecorationLine: "underline",
    backgroundColor: "#EBD0B5",
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
    width: "100%",
  },
})