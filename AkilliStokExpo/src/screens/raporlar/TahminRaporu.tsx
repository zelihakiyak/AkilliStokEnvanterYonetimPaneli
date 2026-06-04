import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../api/apiClient';

type ForecastItem = {
  id: number; productName: string; currentStock: number;
  criticalLimit: number; totalOutLast30Days: number; dailyUsage: number;
  estimatedDaysLeft: number | null; estimatedEndDate: string | null; riskLevel: string;
};

const RISK_COLORS: Record<string, string> = {
  'Kritik': '#EF4444', 'Düşük': '#F59E0B', 'Orta': '#3B82F6', 'Yeterli': '#10B981', 'Veri Yok': '#94A3B8',
};

export default function TahminRaporu() {
  const [forecast,   setForecast]   = useState<ForecastItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await apiClient.get<ForecastItem[]>('/Forecast');
      setForecast(res.data);
    } catch { Alert.alert('Hata', 'Veriler yüklenemedi.'); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  if (loading) return <View style={s.center}><ActivityIndicator color={PRIMARY} size="large" /></View>;

  return (
    <ScrollView
      style={s.root}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={PRIMARY} />}
    >
      {/* Risk özet satırı */}
      <View style={s.riskSummaryRow}>
        {['Kritik', 'Düşük', 'Orta', 'Yeterli'].map(r => {
          const count = forecast.filter(f => f.riskLevel === r).length;
          return (
            <View key={r} style={[s.riskSummaryCard, { borderColor: RISK_COLORS[r] }]}>
              <Text style={[s.riskSummaryCount, { color: RISK_COLORS[r] }]}>{count}</Text>
              <Text style={s.riskSummaryLabel}>{r}</Text>
            </View>
          );
        })}
      </View>

      {forecast.map(f => (
        <View key={f.id} style={s.card}>
          <View style={s.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>{f.productName}</Text>
              <Text style={s.cardSub}>Günlük tüketim: {f.dailyUsage} adet</Text>
            </View>
            <View style={[s.riskBadge, { backgroundColor: RISK_COLORS[f.riskLevel] + '22' }]}>
              <Text style={[s.riskText, { color: RISK_COLORS[f.riskLevel] }]}>{f.riskLevel}</Text>
            </View>
          </View>
          <View style={s.cardFooter}>
            <Text style={s.footerItem}>Mevcut: {f.currentStock} adet</Text>
            <Text style={s.footerItem}>{f.estimatedDaysLeft !== null ? `≈ ${f.estimatedDaysLeft} gün` : 'Veri yok'}</Text>
            <Text style={s.footerItem}>{f.estimatedEndDate ? `Bitiş: ${f.estimatedEndDate}` : '-'}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const PRIMARY = '#4338CA';
const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#F5F6FA' },
  center:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16, paddingBottom: 40 },
  riskSummaryRow:  { flexDirection: 'row', gap: 8, marginBottom: 16 },
  riskSummaryCard: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 10, alignItems: 'center', borderWidth: 2 },
  riskSummaryCount:{ fontSize: 22, fontWeight: '800' },
  riskSummaryLabel:{ fontSize: 10, color: '#64748B', marginTop: 2 },
  card:      { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2 },
  cardRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  cardSub:   { fontSize: 11, color: '#94A3B8' },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  riskText:  { fontSize: 10, fontWeight: '700' },
  cardFooter:{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  footerItem:{ fontSize: 12, color: '#64748B' },
});
