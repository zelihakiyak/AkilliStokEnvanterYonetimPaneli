import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen.tsx';
import HomeScreen from './src/screens/HomeScreen.tsx';

export type RootStackParamList = {
  Login: undefined;
  Home: { user: { id: number; fullName: string; email: string; role: string } };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home"  component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}