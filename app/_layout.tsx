import React from 'react';
import { useColorScheme } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from 'styled-components/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import LoginScreen from './(tabs)/loginscreen';
import HomePage from './(tabs)/homepage';
import SignUpScreen from './(tabs)/signUpScreen';
import CameraScreen from './(tabs)/camerascreen';

const Stack = createStackNavigator();

const AppLayout = () => {
  const colorScheme = useColorScheme();

  return (
      <ThemeProvider theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme} >
        <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerTintColor: '#DCDEC4'}}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
          <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </ThemeProvider>
  );
}

export default AppLayout;