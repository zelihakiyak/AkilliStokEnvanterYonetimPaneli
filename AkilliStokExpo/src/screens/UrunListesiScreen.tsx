import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ProductType } from '../../App';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UrunListesi'>;
};

type FilterKey = 'Tümü' | 'Düşük Stok';
const FILTERS: FilterKey[] = ['Tümü', 'Düşük Stok'];

// React.memo: liste kaydırılırken yalnızca props'u (ürün verisi) değişen kartlar
// yeniden render edilir — FlatList performansı için kritik bir optimizasyon.
const ProductCard = React.memo(function ProductCard({ product, onPress }: { product: ProductType; onPress: () => void }) {
  const isLow = product.currentStock <= product.criticalLimit;
  return (
    <TouchableOpacity style={pc.card} onPress={onPress} activeOpacity={0.75}>
      {isLow && (
        <View style={pc.lowBadge}>
          <Text style={pc.lowBadgeText}>DÜŞÜK STOK</Text>
        </View>
      )}
      <Text style={pc.name} numberOfLines={2}>{product.productName}</Text>
      <Text style={pc.price}>
        {product.unitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}TL
      </Text>
      <View style={pc.stockRow}>
        {isLow && <Text style={pc.warnIcon}>⚠️ </Text>}
        <Text style={[pc.stock, isLow && pc.stockLow]}>Stok: {product.currentStock} Adet</Text>
      </View>
    </TouchableOpacity>
  );
}, (prev, next) =>
  prev.product.id === next.product.id &&
  prev.product.currentStock === next.product.currentStock &&
  prev.product.unitPrice === next.product.unitPrice &&
  prev.product.productName === next.product.productName &&
  prev.product.criticalLimit === next.product.criticalLimit
);

const pc = StyleSheet.create({
  card:         { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2, position: 'relative', overflow: 'hidden' },
  lowBadge:     { position: 'absolute', top: 0, right: 0, backgroundColor: '#EF4444', paddingHorizontal: 12, paddingVertical: 5, borderBottomLeftRadius: 12, borderTopRightRadius: 16 },
  lowBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  name:         { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 6, marginRight: 80 },
  price:        { fontSize: 15, fontWeight: '700', color: '#4338CA', marginBottom: 6 },
  stockRow:     { flexDirection: 'row', alignItems: 'center' },
  warnIcon:     { fontSize: 13 },
  stock:        { fontSize: 13, color: '#64748B' },
  stockLow:     { color: '#EF4444', fontWeight: '600' },
});

export default function UrunListesiScreen({ navigation }: Props) {
  const { isAdmin } = useAuth();
  const [products,     setProducts]     = useState<ProductType[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [search,       setSearch]       = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('Tümü');

  const fetchProducts = useCallback(async () => {
    try {
      const res = await apiClient.get('/Products');
      setProducts(res.data);
    } catch {
      Alert.alert('Bağlantı Hatası', 'Ürünler yüklenemedi. API bağlantısını kontrol edin.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const onRefresh = () => { setRefreshing(true); fetchProducts(); };

  // keyExtractor ve renderItem her render'da yeniden
  // oluşturulmasın diye useCallback ile sabitlenir — bu, React.memo'lu
  // ProductCard'ların gereksiz yeniden render edilmesini önler.
  const keyExtractor = useCallback((item: ProductType) => item.id.toString(), []);

  const renderItem = useCallback(({ item }: { item: ProductType }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('UrunDetay', { product: item })}
    />
  ), [navigation]);

  const filtered = useMemo(() => {
    let list = products;
    if (activeFilter === 'Düşük Stok') {
      list = list.filter(p => p.currentStock <= p.criticalLimit);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.productName.toLowerCase().includes(q) || p.barcode.toLowerCase().includes(q));
    }
    return list;
  }, [products, activeFilter, search]);

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#4338CA" />
      </View>
    );
  }

  return (
    <View style={s.root}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={s.headerIconBox}>
          <Text style={s.headerIcon}>▤</Text>
        </View>
        <Text style={s.headerTitle}>Ürün Listesi</Text>
      </View>

      <View style={s.searchRow}>
        <View style={s.searchBox}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Ürün ara..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={s.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={s.chipRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[s.chip, activeFilter === f && s.chipActive]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.75}
          >
            <Text style={[s.chipText, activeFilter === f && s.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>📦</Text>
          <Text style={s.emptyText}>{search ? 'Arama sonucu bulunamadı.' : 'Henüz ürün eklenmemiş.'}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4338CA" />}
          // --- Performans optimizasyonları ---
          // Ekran dışına çıkan satırların native view'larını bellekten kaldırır.
          removeClippedSubviews={true}
          // İlk açılışta render edilecek öğe sayısını sınırlar (daha hızlı ilk render).
          initialNumToRender={8}
          // Kaydırma sırasında her seferinde render edilecek öğe sayısı.
          maxToRenderPerBatch={8}
          // Render batch'leri arasındaki bekleme süresi (ms) — JS thread'ini rahatlatır.
          updateCellsBatchingPeriod={50}
          // Bellekte tutulacak "ekran yüksekliği" katsayısı; düşük değer bellek
          // kullanımını azaltır, listelerde akıcılığı korur.
          windowSize={7}
        />
      )}

      <TouchableOpacity
        style={s.fab}
        onPress={() => isAdmin ? navigation.navigate('AddProduct') : navigation.navigate('StokHareket')}
        activeOpacity={0.85}
      >
        <Text style={s.fabIcon}>+</Text>
      </TouchableOpacity>

      <View style={s.tabBar}>
        {(['Panel', 'Envanter', 'SCAN', 'Raporlar', 'Ayarlar'] as const).map(key => {
          const isScan   = key === 'SCAN';
          const isActive = key === 'Envanter';
          const ICONS: Record<string, string>  = { Panel: '🏠︎', Envanter: '📦', SCAN: '📷', Raporlar: '📊', Ayarlar: '⚙️' };
          const LABELS: Record<string, string> = { Panel: 'Panel', Envanter: 'Envanter', SCAN: 'Tara', Raporlar: 'Raporlar', Ayarlar: 'Ayarlar' };
          if (isScan) {
            return (
              <TouchableOpacity key={key} style={s.scanBtn} onPress={() => navigation.navigate('BarkodTara')} activeOpacity={0.85}>
                <Text style={s.scanIcon}>📷</Text>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              key={key}
              style={s.tabItem}
              onPress={() => {
                if (key === 'Panel') navigation.goBack();
                if (key === 'Raporlar') navigation.navigate('Raporlar');
                if (key === 'Ayarlar') navigation.navigate('Ayarlar');
              }}
              activeOpacity={0.7}
            >
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
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, paddingTop: 52, paddingBottom: 16, paddingHorizontal: 20, gap: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn:      { padding: 4 },
  backIcon:     { fontSize: 22, color: '#1E293B' },
  headerIconBox:{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#E0E4FF', alignItems: 'center', justifyContent: 'center' },
  headerIcon:   { fontSize: 18, color: PRIMARY },
  headerTitle:  { flex: 1, fontSize: 18, fontWeight: '700', color: '#1E293B' },
  bellBtn:      { padding: 4 },
  bellIcon:     { fontSize: 20 },
  searchRow:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 10, backgroundColor: WHITE },
  searchBox:    { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 14, height: 46, gap: 8 },
  searchIcon:   { fontSize: 16, color: '#94A3B8' },
  searchInput:  { flex: 1, fontSize: 15, color: '#1E293B', paddingVertical: 0 },
  clearIcon:    { fontSize: 14, color: '#94A3B8', paddingLeft: 4 },
  filterBtn:    { width: 46, height: 46, backgroundColor: PRIMARY, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  filterBtnIcon:{ fontSize: 20, color: '#fff' },
  chipRow:      { flexDirection: 'row', paddingHorizontal: 20, paddingBottom: 14, gap: 8, backgroundColor: WHITE },
  chip:         { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: WHITE },
  chipActive:   { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipText:     { fontSize: 13, color: '#64748B', fontWeight: '500' },
  chipTextActive:{ color: '#fff', fontWeight: '700' },
  listContent:  { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 100 },
  empty:        { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  emptyIcon:    { fontSize: 48 },
  emptyText:    { fontSize: 15, color: '#94A3B8', textAlign: 'center' },
  fab:          { position: 'absolute', bottom: 88, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', shadowColor: PRIMARY, shadowOpacity: 0.4, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 8 },
  fabIcon:      { fontSize: 30, color: '#fff', lineHeight: 32, marginTop: -2 },
  tabBar:         { flexDirection: 'row', backgroundColor: WHITE, borderTopWidth: 1, borderTopColor: '#E2E8F0', height: 70, alignItems: 'center', paddingHorizontal: 8, paddingBottom: 8 },
  tabItem:        { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  tabIcon:        { fontSize: 20, color: '#94A3B8' },
  tabIconActive:  { color: PRIMARY },
  tabLabel:       { fontSize: 10, color: '#94A3B8' },
  tabLabelActive: { color: PRIMARY, fontWeight: '600' },
  scanBtn:        { width: 58, height: 58, borderRadius: 29, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', marginTop: -24, shadowColor: PRIMARY, shadowOpacity: 0.45, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 8 },
  scanIcon:       { fontSize: 26, color: WHITE },
});
