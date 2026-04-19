import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductsScreen from './src/screens/ProductsScreen.tsx';
import AddProductScreen from './src/screens/AddProductScreen.tsx';
import EditProductScreen from './src/screens/EditProductScreen.tsx';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Products: undefined;
  AddProduct: undefined;
  EditProduct: { product: {
    id: number;
    barcode: string;
    productName: string;
    unitPrice: number;
    currentStock: number;
    criticalLimit: number;
    categoryId: number;
  }};
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function Navigation() {
    const { userToken, isLoading } = useContext(AuthContext);

    if (isLoading) return null;

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {userToken == null ? (
                    <Stack.Screen name="Login" component={LoginScreen} />
                ) : (
                    <>
                        <Stack.Screen name="Home"       component={HomeScreen} />
                        <Stack.Screen name="Products"   component={ProductsScreen} />
                        <Stack.Screen name="AddProduct" component={AddProductScreen} />
                        <Stack.Screen name="EditProduct" component={EditProductScreen} />
                    </>
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