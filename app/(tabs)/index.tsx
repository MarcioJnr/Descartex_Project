import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppLayout from "../_layout";
import 'react-native-gesture-handler';

export default function App() {
  return (
      <NavigationContainer>
        <AppLayout />
      </NavigationContainer>
  );
}