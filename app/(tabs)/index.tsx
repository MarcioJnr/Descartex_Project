import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "../../assets/AuthContext";
import AppLayout from "../_layout";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppLayout />
      </NavigationContainer>
    </AuthProvider>
  );
}