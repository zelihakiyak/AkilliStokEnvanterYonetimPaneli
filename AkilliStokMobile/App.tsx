import React from 'react';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen.tsx';
import HomeScreen from './src/screens/HomeScreen.tsx';

export type RootStackParamList = {
  Login: undefined;
  Home: { user: { id: number; fullName: string; email: string; role: string } };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function Navigation() {
    const { userToken, isLoading } = useContext(AuthContext);

    if (isLoading) return null; // Veya bir Splash Screen gösterilebilir

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {userToken == null ? (
                    // Giriþ yapýlmamýþsa sadece Login görünsün
                    <Stack.Screen name="Login" component={LoginScreen} />
                ) : (
                    // Giriþ yapýlmýþsa Home görünsün (Güvenlik için Login'e geri dönemez)
                    <Stack.Screen name="Home" component={HomeScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Navigation />
        </AuthProvider>
    );
}

