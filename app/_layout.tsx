import React from "react";
import { useColorScheme } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { ThemeProvider } from "styled-components/native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import LoginScreen from "./(tabs)/loginscreen";
import HomePage from "./(tabs)/homepage";
import SignUpScreen from "./(tabs)/signUpScreen";
import CameraScreen from "./(tabs)/camerascreen";
import NewReportScreen from "./(tabs)/newreport";
import NewRegistryScreen from "./(tabs)/newregistry";
import Reports from "./(tabs)/reports";
import { RootStackParamList } from "../types";
import feedbackScreen from "./(tabs)/feedbackScreen";
import ReportDetailsScreen  from "./(tabs)/reportdetailsScreen";

const Stack = createStackNavigator<RootStackParamList>();

const AppLayout = () => {
  const colorScheme = useColorScheme();

  return (

    <ThemeProvider theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* Remova o NavigationContainer daqui */}
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="NewReport"
          component={NewReportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="NewRegistry" component={NewRegistryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Reports" component={Reports} options={{ headerShown: false }} />
        <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FeedbackScreen" component={feedbackScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </ThemeProvider>
  );
};

export default AppLayout;