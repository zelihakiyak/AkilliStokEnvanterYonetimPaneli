import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../api/apiClient';

type LogItem = {
  id: number; productName: string; transactionType: string;
  quantity: number; transactionDate: string;
};

const PERIODS = ['Bugün', 'Bu Hafta', 'Bu Ay'];
const PRIMARY = '#4338CA';

export default function HacimRaporu() {
  const [logs,       setLogs]       = useState<LogItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period,     setPeriod]     = useState(1);

  const fetchData = useCallback(async () => {
    try {
      const res = await apiClient.get<LogItem[]>('/StockLogs');
      setLogs(res.data);
    } catch { Alert.alert('Hata', 'Veriler yüklenemedi.'); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  const volumeData = React.useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    if (period === 0) cutoff.setHours(0, 0, 0, 0);
    else if (period === 1) cutoff.setDate(now.getDate() - 7);
    else cutoff.setDate(now.getDate() - 30);

    const filtered = logs.filter(l => new Date(l.transactionDate) >= cutoff);
    const map: Record<string, number> = {};
    filtered.forEach(l => {
      map[l.productName] = (map[l.productName] || 0) + Math.abs(l.quantity);
    });
    return Object.entries(map).map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total).slice(0, 10);
  }, [logs, period]);

  if (loading) return <View style={s.center}><ActivityIndicator color={PRIMARY} size="large" /></View>;

  return (
    <ScrollView
      style={s.root}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={PRIMARY} />}
    >
      <View style={s.periodRow}>
        {PERIODS.map((label, i) => (
          <TouchableOpacity key={i} style={[s.periodBtn, period === i && s.periodBtnActive]} onPress={() => setPeriod(i)}>
            <Text style={[s.periodBtnText, period === i && s.periodBtnTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {volumeData.length === 0 ? (
        <View style={s.emptyCard}>
          <Text style={s.emptyIcon}>📭</Text>
          <Text style={s.emptyText}>Bu dönemde hareket yok.</Text>
        </View>
      ) : (
        volumeData.map((item, index) => {
          const pct = (item.total / volumeData[0].total) * 100;
          return (
            <View key={item.name} style={s.card}>
              <View style={s.cardRow}>
                <View style={s.rankBadge}>
                  <Text style={s.rankText}>#{index + 1}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={s.cardTitle} numberOfLines={1}>{item.name}</Text>
                </View>
                <Text style={s.volumeCount}>{item.total} adet</Text>
              </View>
              <View style={s.progressBg}>
                <View style={[s.progressFill, { width: `${pct}%` }]} />
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#F5F6FA' },
  center:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16, paddingBottom: 40 },
  periodRow:       { flexDirection: 'row', gap: 8, marginBottom: 12 },
  periodBtn:       { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#F1F5F9' },
  periodBtnActive: { backgroundColor: PRIMARY },
  periodBtnText:   { fontSize: 12, fontWeight: '600', color: '#64748B' },
  periodBtnTextActive: { color: '#fff' },
  card:      { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2 },
  cardRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  rankBadge: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#E0E4FF', alignItems: 'center', justifyContent: 'center' },
  rankText:  { fontSize: 11, fontWeight: '700', color: PRIMARY },
  volumeCount:  { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  progressBg:   { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: PRIMARY },
  emptyCard: { backgroundColor: '#fff', borderRadius: 14, padding: 32, alignItems: 'center', gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: 14, color: '#94A3B8', textAlign: 'center' },
});
