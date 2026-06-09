import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import LoginScreen       from './src/screens/LoginScreen';
import DashboardScreen   from './src/screens/DashboardScreen';
import UrunListesiScreen from './src/screens/UrunListesiScreen';
import UrunDetayScreen   from './src/screens/UrunDetayScreen';
import BarkodTaraScreen  from './src/screens/BarkodTaraScreen';
import StokHareketScreen from './src/screens/StokHareketScreen';
import AddProductScreen  from './src/screens/AddProductScreen';
import EditProductScreen from './src/screens/EditProductScreen';
import RaporlarScreen   from './src/screens/RaporlarScreen';
import AyarlarScreen     from './src/screens/AyarlarScreen';
import HesapScreen       from './src/screens/ayarlar/HesapScreen';
import BildirimlerScreen from './src/screens/ayarlar/BildirimlerScreen';
import GorunumScreen     from './src/screens/ayarlar/GorunumScreen';
import ProfilDuzenleScreen from './src/screens/ayarlar/ProfilDuzenleScreen';
import SifreDegistirScreen from './src/screens/ayarlar/SifreDegistirScreen';

export type UserType = {
  id: number; fullName: string; email: string; role: string;
};

export type ProductType = {
  id: number; productName: string; barcode: string;
  unitPrice: number; currentStock: number; criticalLimit: number; categoryId: number;
};

export type RootStackParamList = {
  Login:       undefined;
  Home:        { user: UserType };
  UrunListesi: undefined;
  UrunDetay:   { product: ProductType };
  BarkodTara:  undefined;
  StokHareket: { barcode?: string; productName?: string } | undefined;
  AddProduct:  { barcode?: string } | undefined;
  EditProduct: { product: ProductType };
  Raporlar:    undefined;
  Ayarlar:     undefined;
  Hesap:       undefined;
  Bildirimler: undefined;
  Gorunum:     undefined;
  ProfilDuzenle: undefined;
  SifreDegistir: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F6FA' }}>
        <ActivityIndicator size="large" color="#4338CA" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Home"        component={DashboardScreen} />
          <Stack.Screen name="UrunListesi" component={UrunListesiScreen} />
          <Stack.Screen name="UrunDetay"   component={UrunDetayScreen} />
          <Stack.Screen name="BarkodTara"  component={BarkodTaraScreen} />
          <Stack.Screen name="StokHareket" component={StokHareketScreen} />
          <Stack.Screen name="AddProduct"  component={AddProductScreen} />
          <Stack.Screen name="EditProduct" component={EditProductScreen} />
          <Stack.Screen name="Raporlar"    component={RaporlarScreen} />
          <Stack.Screen name="Ayarlar"     component={AyarlarScreen} />
          <Stack.Screen name="Hesap"       component={HesapScreen} />
          <Stack.Screen name="Bildirimler" component={BildirimlerScreen} />
          <Stack.Screen name="Gorunum"     component={GorunumScreen} />
          <Stack.Screen name="ProfilDuzenle" component={ProfilDuzenleScreen} />
          <Stack.Screen name="SifreDegistir" component={SifreDegistirScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
