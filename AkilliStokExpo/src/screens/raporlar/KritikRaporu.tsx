import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../api/apiClient';
import { ProductType } from '../../../App';

export default function KritikRaporu() {
  const [products,   setProducts]   = useState<ProductType[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await apiClient.get<ProductType[]>('/Products');
      setProducts(res.data);
    } catch { Alert.alert('Hata', 'Veriler yüklenemedi.'); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  const criticalProducts = products.filter(p => p.currentStock <= p.criticalLimit);

  if (loading) return <View style={s.center}><ActivityIndicator color={PRIMARY} size="large" /></View>;

  return (
    <ScrollView
      style={s.root}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={PRIMARY} />}
    >
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Kritik Stok Ürünleri</Text>
        <View style={s.countBadge}>
          <Text style={s.countBadgeText}>{criticalProducts.length} ürün</Text>
        </View>
      </View>

      {criticalProducts.length === 0 ? (
        <View style={s.emptyCard}>
          <Text style={s.emptyIcon}>🎉</Text>
          <Text style={s.emptyText}>Kritik stok seviyesinde ürün yok!</Text>
        </View>
      ) : (
        criticalProducts.map(p => {
          const ratio = p.currentStock / p.criticalLimit;
          return (
            <View key={p.id} style={s.card}>
              <View style={s.cardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardTitle}>{p.productName}</Text>
                  <Text style={s.cardSub}>Barkod: {p.barcode}</Text>
                </View>
                <View style={s.riskBadge}>
                  <Text style={s.riskText}>KRİTİK</Text>
                </View>
              </View>
              <View style={s.progressBg}>
                <View style={[s.progressFill, { width: `${Math.min(ratio * 100, 100)}%` }]} />
              </View>
              <View style={s.cardFooter}>
                <Text style={s.footerItem}>Mevcut: <Text style={s.red}>{p.currentStock}</Text></Text>
                <Text style={s.footerItem}>Limit: {p.criticalLimit}</Text>
                <Text style={s.footerItem}>Değer: {(p.unitPrice * p.currentStock).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺</Text>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const PRIMARY = '#4338CA';
const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#F5F6FA' },
  center:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16, paddingBottom: 40 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle:  { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  countBadge:    { backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  countBadgeText:{ fontSize: 11, fontWeight: '700', color: '#EF4444' },
  card:     { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2 },
  cardRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardTitle:{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  cardSub:  { fontSize: 11, color: '#94A3B8' },
  riskBadge:{ backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  riskText: { fontSize: 10, fontWeight: '700', color: '#EF4444' },
  progressBg:  { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, marginBottom: 10, overflow: 'hidden' },
  progressFill:{ height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  cardFooter:  { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  footerItem:  { fontSize: 12, color: '#64748B' },
  red:         { color: '#EF4444', fontWeight: '700' },
  emptyCard:   { backgroundColor: '#fff', borderRadius: 14, padding: 32, alignItems: 'center', gap: 10 },
  emptyIcon:   { fontSize: 40 },
  emptyText:   { fontSize: 14, color: '#94A3B8', textAlign: 'center' },
});
