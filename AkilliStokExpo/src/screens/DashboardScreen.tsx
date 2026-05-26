import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ProductType } from '../../App';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

type StockLogType = {
  id: number;
  productName: string;
  transactionType: string;
  quantity: number;
  transactionDate: string;
};

function MiniBarChart({ products }: { products: ProductType[] }) {
  if (products.length === 0) return null;
  const top5 = [...products].sort((a, b) => b.currentStock - a.currentStock).slice(0, 5);
  const maxStock = Math.max(...top5.map(p => p.currentStock), 1);
  return (
    <View style={chart.container}>
      {top5.map((p) => {
        const heightPct = (p.currentStock / maxStock) * 100;
        const isLow = p.currentStock <= p.criticalLimit;
        return (
          <View key={p.id} style={chart.barWrapper}>
            <Text style={chart.value}>{p.currentStock}</Text>
            <View style={chart.barBg}>
              <View style={[chart.bar, { height: `${Math.max(heightPct, 5)}%` as any }, isLow && chart.barLow]} />
            </View>
            <Text style={chart.label} numberOfLines={2}>
              {p.productName.length > 8 ? p.productName.slice(0, 8) + '…' : p.productName}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const chart = StyleSheet.create({
  container:  { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 6, paddingTop: 8 },
  barWrapper: { flex: 1, alignItems: 'center', gap: 4 },
  value:      { fontSize: 9, color: '#64748B', fontWeight: '600' },
  barBg:      { flex: 1, width: '80%', justifyContent: 'flex-end' },
  bar:        { width: '100%', backgroundColor: '#4338CA', borderRadius: 4 },
  barLow:     { backgroundColor: '#EF4444' },
  label:      { fontSize: 9, color: '#64748B', textAlign: 'center' },
});

export default function DashboardScreen({ navigation }: Props) {
  const { user, logout, isAdmin } = useAuth();
  const [products,   setProducts]   = useState<ProductType[]>([]);
  const [recentLogs, setRecentLogs] = useState<StockLogType[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const stats = React.useMemo(() => {
    const lowStockCount = products.filter(p => p.currentStock <= p.criticalLimit).length;
    const totalValue    = products.reduce((sum, p) => sum + p.unitPrice * p.currentStock, 0);
    const categoryIds   = new Set(products.map(p => p.categoryId));
    return { totalProducts: products.length, lowStockCount, totalValue, totalCategories: categoryIds.size };
  }, [products]);

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, logRes] = await Promise.all([
        apiClient.get('/Products'),
        apiClient.get('/StockLogs'),
      ]);
      setProducts(prodRes.data);
      setRecentLogs((logRes.data as StockLogType[]).slice(0, 5));
    } catch {
      Alert.alert('Bağlantı Hatası', 'Veriler yüklenemedi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkmak istiyor musunuz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış Yap', style: 'destructive', onPress: logout },
    ]);
  };

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#4338CA" />
      </View>
    );
  }

  const lowStockProducts = products.filter(p => p.currentStock <= p.criticalLimit);

  return (
    <View style={s.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#4338CA" />}
      >
        <View style={s.header}>
          <View style={s.headerLeft}>
            <View style={s.logoBox}>
              <Text style={s.logoIcon}>👤</Text>
            </View>
            <View>
              <Text style={s.greeting}>Merhaba, {user?.fullName?.split(' ')[0]} 👋</Text>
              <Text style={s.subGreeting}>{isAdmin ? 'Admin' : 'Personel'}</Text>
            </View>
          </View>
          <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
            <Text style={s.logoutIcon}>⏻</Text>
          </TouchableOpacity>
        </View>

        <View style={s.statsGrid}>
          <View style={[s.statCard, { backgroundColor: '#4338CA' }]}>
            <Text style={s.statIcon}>📦</Text>
            <Text style={s.statValue}>{stats.totalProducts}</Text>
            <Text style={s.statLabel}>Toplam Ürün</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: '#EF4444' }]}>
            <Text style={s.statIcon}>⚠️</Text>
            <Text style={s.statValue}>{stats.lowStockCount}</Text>
            <Text style={s.statLabel}>Düşük Stok</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: '#10B981' }]}>
            <Text style={s.statIcon}>💰</Text>
            <Text style={s.statValue}>
              {stats.totalValue >= 1000 ? `${(stats.totalValue / 1000).toFixed(1)}K` : stats.totalValue.toFixed(0)}
            </Text>
            <Text style={s.statLabel}>Toplam Değer (TL)</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: '#F59E0B' }]}>
            <Text style={s.statIcon}>🏷️</Text>
            <Text style={s.statValue}>{stats.totalCategories}</Text>
            <Text style={s.statLabel}>Kategori</Text>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Hızlı Erişim</Text>
          <View style={s.quickRow}>
            <TouchableOpacity style={s.quickCard} onPress={() => navigation.navigate('UrunListesi')} activeOpacity={0.75}>
              <Text style={s.quickIcon}>📋</Text>
              <Text style={s.quickLabel}>Ürün Listesi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.quickCard} onPress={() => navigation.navigate('BarkodTara')} activeOpacity={0.75}>
              <Text style={s.quickIcon}>🀫</Text>
              <Text style={s.quickLabel}>Barkod Tara</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.quickCard} onPress={() => navigation.navigate('StokHareket')} activeOpacity={0.75}>
              <Text style={s.quickIcon}>🔄</Text>
              <Text style={s.quickLabel}>Stok Hareketi</Text>
            </TouchableOpacity>
            {isAdmin && (
              <TouchableOpacity style={s.quickCard} onPress={() => navigation.navigate('AddProduct')} activeOpacity={0.75}>
                <Text style={s.quickIcon}>➕</Text>
                <Text style={s.quickLabel}>Ürün Ekle</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={s.section}>
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Stok Durumu</Text>
            <TouchableOpacity onPress={() => navigation.navigate('UrunListesi')}>
              <Text style={s.seeAll}>Tümünü Gör →</Text>
            </TouchableOpacity>
          </View>
          <View style={s.card}>
            <MiniBarChart products={products} />
            {products.length === 0 && <Text style={s.empty}>Henüz ürün eklenmemiş.</Text>}
          </View>
        </View>

        {lowStockProducts.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>⚠️ Düşük Stok Uyarıları</Text>
            <View style={s.card}>
              {lowStockProducts.slice(0, 4).map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={s.alertRow}
                  onPress={() => navigation.navigate('UrunDetay', { product: p })}
                  activeOpacity={0.7}
                >
                  <View style={s.alertDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.alertName}>{p.productName}</Text>
                    <Text style={s.alertStock}>Stok: {p.currentStock} / Kritik: {p.criticalLimit}</Text>
                  </View>
                  <Text style={s.alertArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={[s.section, { marginBottom: 90 }]}>
          <Text style={s.sectionTitle}>Son Stok Hareketleri</Text>
          <View style={s.card}>
            {recentLogs.length === 0 ? (
              <Text style={s.empty}>Henüz stok hareketi yok.</Text>
            ) : (
              recentLogs.map(log => (
                <View key={log.id} style={s.logRow}>
                  <View style={[s.logBadge, log.transactionType === 'Giriş' ? s.logBadgeIn : s.logBadgeOut]}>
                    <Text style={s.logBadgeText}>{log.transactionType === 'Giriş' ? '↑' : '↓'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.logName} numberOfLines={1}>{log.productName}</Text>
                    <Text style={s.logDate}>{new Date(log.transactionDate).toLocaleDateString('tr-TR')}</Text>
                  </View>
                  <Text style={[s.logQty, log.transactionType === 'Giriş' ? s.logQtyIn : s.logQtyOut]}>
                    {log.transactionType === 'Giriş' ? '+' : '-'}{log.quantity}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <View style={s.tabBar}>
        {(['Panel', 'Envanter', 'SCAN', 'Raporlar', 'Ayarlar'] as const).map(key => {
          const isScan   = key === 'SCAN';
          const isActive = key === 'Panel';
          const ICONS: Record<string, string>  = { Panel: '🏠︎', Envanter: '📦', SCAN: '🀫', Raporlar: '📊', Ayarlar: '⚙️' };
          const LABELS: Record<string, string> = { Panel: 'Panel', Envanter: 'Envanter', SCAN: 'Tara', Raporlar: 'Raporlar', Ayarlar: 'Ayarlar' };
          if (isScan) {
            return (
              <TouchableOpacity key={key} style={s.scanBtn} onPress={() => navigation.navigate('BarkodTara')} activeOpacity={0.85}>
                <Text style={s.scanIcon}>🀫</Text>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity key={key} style={s.tabItem} onPress={() => { if (key === 'Envanter') navigation.navigate('UrunListesi'); }} activeOpacity={0.7}>
              <Text style={[s.tabIcon, isActive && s.tabIconActive]}>{ICONS[key]}</Text>
              <Text style={[s.tabLabel, isActive && s.tabLabelActive]}>{LABELS[key]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const PRIMARY = '#4338CA';
const BG      = '#F5F6FA';
const WHITE   = '#FFFFFF';

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: BG },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BG },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: WHITE, paddingTop: 52, paddingBottom: 16, paddingHorizontal: 20 },
  headerLeft:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoBox:      { width: 40, height: 40, borderRadius: 10, backgroundColor: '#E0E4FF', alignItems: 'center', justifyContent: 'center' },
  logoIcon:     { fontSize: 20, color: PRIMARY },
  greeting:     { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  subGreeting:  { fontSize: 12, color: '#64748B', marginTop: 1 },
  logoutBtn:    { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  logoutIcon:   { fontSize: 18, color: '#EF4444' },
  statsGrid:    { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingTop: 16, gap: 10 },
  statCard:     { width: '47%', borderRadius: 16, padding: 16, gap: 4 },
  statIcon:     { fontSize: 22 },
  statValue:    { fontSize: 22, fontWeight: '800', color: WHITE },
  statLabel:    { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  section:      { paddingHorizontal: 16, marginTop: 20 },
  sectionRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  seeAll:       { fontSize: 13, color: PRIMARY, fontWeight: '600' },
  card:         { backgroundColor: WHITE, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2 },
  quickRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard:    { width: '47%', backgroundColor: WHITE, borderRadius: 14, padding: 16, alignItems: 'center', gap: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2 },
  quickIcon:    { fontSize: 28 },
  quickLabel:   { fontSize: 12, color: '#1E293B', fontWeight: '600', textAlign: 'center' },
  alertRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  alertDot:     { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  alertName:    { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  alertStock:   { fontSize: 12, color: '#EF4444', marginTop: 2 },
  alertArrow:   { fontSize: 20, color: '#CBD5E1' },
  logRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  logBadge:     { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  logBadgeIn:   { backgroundColor: '#D1FAE5' },
  logBadgeOut:  { backgroundColor: '#FEE2E2' },
  logBadgeText: { fontSize: 14, fontWeight: '700' },
  logName:      { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  logDate:      { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  logQty:       { fontSize: 14, fontWeight: '700' },
  logQtyIn:     { color: '#10B981' },
  logQtyOut:    { color: '#EF4444' },
  empty:        { color: '#94A3B8', fontSize: 14, textAlign: 'center', paddingVertical: 16 },
  tabBar:         { flexDirection: 'row', backgroundColor: WHITE, borderTopWidth: 1, borderTopColor: '#E2E8F0', height: 70, alignItems: 'center', paddingHorizontal: 8, paddingBottom: 8 },
  tabItem:        { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  tabIcon:        { fontSize: 20, color: '#94A3B8' },
  tabIconActive:  { color: PRIMARY },
  tabLabel:       { fontSize: 10, color: '#94A3B8' },
  tabLabelActive: { color: PRIMARY, fontWeight: '600' },
  scanBtn:        { width: 58, height: 58, borderRadius: 29, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', marginTop: -24, shadowColor: PRIMARY, shadowOpacity: 0.45, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 8 },
  scanIcon:       { fontSize: 26, color: WHITE },
});
