import React from 'react';
import { useColorScheme } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from 'styled-components/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import LoginScreen from './(tabs)/loginscreen';
import HomePage from './(tabs)/homepage';
import SignUpScreen from './(tabs)/signUpScreen';

const Stack = createNativeStackNavigator();

const AppLayout = () => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="homepage" component={HomePage} />
        <Stack.Screen name="signUp" component={SignUpScreen} />
      </Stack.Navigator>
    </ThemeProvider>
  );
}

export default AppLayout;