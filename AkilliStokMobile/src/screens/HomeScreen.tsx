import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const menuItems = [
  { label: 'Ürünler',          screen: 'Products' },
  { label: 'Kategoriler',      screen: null },
  { label: 'Stok Hareketleri', screen: null },
  { label: 'Raporlar',         screen: null },
];

export default function HomeScreen({ navigation }: any) {
    const { user, logout } = useContext(AuthContext);

    const handleLogout = async () => { await logout(); };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hoş geldiniz,</Text>
        <Text style={styles.name}>{user?.fullName}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{user?.role}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.label}
            style={[styles.card, !item.screen && styles.cardDisabled]}
            activeOpacity={item.screen ? 0.7 : 1}
            onPress={() => item.screen && navigation.navigate(item.screen as any)}
          >
            <Text style={styles.cardText}>{item.label}</Text>
            {!item.screen && <Text style={styles.comingSoon}>Yakında</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
  header: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  greeting:  { color: '#C7D2FE', fontSize: 14 },
  name:      { color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 2 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
  },
  badgeText:   { color: '#fff', fontSize: 12, fontWeight: '600' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardDisabled: { opacity: 0.5 },
  cardText:     { fontSize: 14, fontWeight: '600', color: '#374151' },
  comingSoon:   { fontSize: 10, color: '#9CA3AF', marginTop: 4 },
  logoutBtn: {
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  logoutText: { color: '#EF4444', fontSize: 15, fontWeight: '600' },
});