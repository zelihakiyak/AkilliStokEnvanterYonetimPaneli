import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../api/apiClient';
import { ProductType } from '../../../App';

export default function OzetRaporu() {
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

  const criticalCount  = products.filter(p => p.currentStock <= p.criticalLimit).length;
  const totalValue     = products.reduce((s, p) => s + p.unitPrice * p.currentStock, 0);
  const totalStock     = products.reduce((s, p) => s + p.currentStock, 0);

  if (loading) return <View style={s.center}><ActivityIndicator color={PRIMARY} size="large" /></View>;

  return (
    <ScrollView
      style={s.root}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={PRIMARY} />}
    >
      <View style={s.summaryGrid}>
        <View style={[s.summaryCard, { backgroundColor: '#4338CA' }]}>
          <Text style={s.summaryValue}>{products.length}</Text>
          <Text style={s.summaryLabel}>Toplam Ürün</Text>
        </View>
        <View style={[s.summaryCard, { backgroundColor: '#EF4444' }]}>
          <Text style={s.summaryValue}>{criticalCount}</Text>
          <Text style={s.summaryLabel}>Kritik</Text>
        </View>
        <View style={[s.summaryCard, { backgroundColor: '#10B981' }]}>
          <Text style={s.summaryValue}>{(totalValue / 1000).toFixed(1)}K</Text>
          <Text style={s.summaryLabel}>Toplam Değer ₺</Text>
        </View>
        <View style={[s.summaryCard, { backgroundColor: '#F59E0B' }]}>
          <Text style={s.summaryValue}>{totalStock}</Text>
          <Text style={s.summaryLabel}>Toplam Adet</Text>
        </View>
      </View>

      {products.map(p => {
        const isLow = p.currentStock <= p.criticalLimit;
        return (
          <View key={p.id} style={s.card}>
            <View style={s.cardRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>{p.productName}</Text>
                <Text style={s.cardSub}>{p.barcode}</Text>
              </View>
              {isLow && (
                <View style={s.riskBadge}>
                  <Text style={s.riskText}>KRİTİK</Text>
                </View>
              )}
            </View>
            <View style={s.cardFooter}>
              <Text style={s.footerItem}>Stok: <Text style={{ color: isLow ? '#EF4444' : '#10B981', fontWeight: '700' }}>{p.currentStock}</Text></Text>
              <Text style={s.footerItem}>Limit: {p.criticalLimit}</Text>
              <Text style={s.footerItem}>Birim: {p.unitPrice.toLocaleString('tr-TR')} ₺</Text>
              <Text style={s.footerItem}>Toplam: {(p.unitPrice * p.currentStock).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const PRIMARY = '#4338CA';
const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#F5F6FA' },
  center:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16, paddingBottom: 40 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  summaryCard: { width: '47%', borderRadius: 14, padding: 14, gap: 4 },
  summaryValue:{ fontSize: 22, fontWeight: '800', color: '#fff' },
  summaryLabel:{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  card:      { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2 },
  cardRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  cardSub:   { fontSize: 11, color: '#94A3B8' },
  riskBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  riskText:  { fontSize: 10, fontWeight: '700', color: '#EF4444' },
  cardFooter:{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  footerItem:{ fontSize: 12, color: '#64748B' },
});
