import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

import KritikRaporu    from './raporlar/KritikRaporu';
import TahminRaporu    from './raporlar/TahminRaporu';
import HareketlerRaporu from './raporlar/HareketlerRaporu';
import OzetRaporu      from './raporlar/OzetRaporu';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Raporlar'>;
};

const Tab = createMaterialTopTabNavigator();

export default function RaporlarScreen({ navigation }: Props) {
  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Raporlar</Text>
        <View style={{ width: 38 }} />
      </View>

      {/* Material Top Tab Navigator */}
      <Tab.Navigator
        tabBarPosition="bottom"
        screenOptions={{
          tabBarActiveTintColor:   '#4338CA',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarIndicatorStyle:    { backgroundColor: '#4338CA', height: 3, borderRadius: 2, top: 0 },
          tabBarStyle:             { backgroundColor: '#fff', elevation: 4, shadowOpacity: 0.06, borderTopWidth: 1, borderTopColor: '#F1F5F9', height: 70, paddingBottom: 8 },
          tabBarLabelStyle:        { fontSize: 11, fontWeight: '600', textTransform: 'none', marginTop: 2, textAlign: 'center' },
          tabBarScrollEnabled:     false,
          tabBarItemStyle:         { alignItems: 'center', justifyContent: 'center' },
        }}
      >
        <Tab.Screen name="Kritik"      component={KritikRaporu}     options={{ tabBarLabel: '🚨 Kritik' }} />
        <Tab.Screen name="Tahmin"      component={TahminRaporu}     options={{ tabBarLabel: '🔮 Tahmin' }} />
        <Tab.Screen name="Stok Hareketleri"  component={HareketlerRaporu} options={{ tabBarLabel: '📋 Hareketler' }} />
        <Tab.Screen name="Ozet"        component={OzetRaporu}       options={{ tabBarLabel: '📦 Özet' }} />
      </Tab.Navigator>
    </View>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1, backgroundColor: '#F5F6FA' },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', paddingTop: 52, paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn:     { width: 38, height: 38, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  backIcon:    { fontSize: 20, color: '#1E293B' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B' },
});
