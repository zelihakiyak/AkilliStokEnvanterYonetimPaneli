import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../api/apiClient';

type LogItem = {
  id: number; productName: string; transactionType: string;
  quantity: number; oldStock: number; newStock: number; transactionDate: string;
};

const PERIODS = ['Bugün', 'Bu Hafta', 'Bu Ay'];

export default function HareketlerRaporu() {
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

  const filteredLogs = React.useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    if (period === 0) cutoff.setHours(0, 0, 0, 0);
    else if (period === 1) cutoff.setDate(now.getDate() - 7);
    else cutoff.setDate(now.getDate() - 30);
    return logs.filter(l => new Date(l.transactionDate) >= cutoff);
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

      <Text style={s.resultCount}>{filteredLogs.length} hareket</Text>

      {filteredLogs.length === 0 ? (
        <View style={s.emptyCard}>
          <Text style={s.emptyIcon}>📭</Text>
          <Text style={s.emptyText}>Bu dönemde hareket yok.</Text>
        </View>
      ) : (
        filteredLogs.map(l => (
          <View key={l.id} style={s.logCard}>
            <View style={[s.logIcon, l.transactionType === 'In' ? s.logIconIn : s.logIconOut]}>
              <Text style={s.logIconText}>{l.transactionType === 'In' ? '↑' : '↓'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.logName} numberOfLines={1}>{l.productName}</Text>
              <Text style={s.logDate}>
                {new Date(l.transactionDate).toLocaleDateString('tr-TR')} {new Date(l.transactionDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[s.logQty, l.transactionType === 'In' ? s.logQtyIn : s.logQtyOut]}>
                {l.transactionType === 'In' ? '+' : '-'}{Math.abs(l.quantity)}
              </Text>
              <Text style={s.logStockChange}>{l.oldStock} → {l.newStock}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const PRIMARY = '#4338CA';
const s = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#F5F6FA' },
  center:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16, paddingBottom: 40 },
  periodRow:       { flexDirection: 'row', gap: 8, marginBottom: 12 },
  periodBtn:       { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#F1F5F9' },
  periodBtnActive: { backgroundColor: PRIMARY },
  periodBtnText:   { fontSize: 12, fontWeight: '600', color: '#64748B' },
  periodBtnTextActive: { color: '#fff' },
  resultCount: { fontSize: 12, color: '#64748B', marginBottom: 10 },
  logCard:    { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowOffset: { width: 0, height: 1 }, shadowRadius: 4, elevation: 1 },
  logIcon:    { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logIconIn:  { backgroundColor: '#D1FAE5' },
  logIconOut: { backgroundColor: '#FEE2E2' },
  logIconText:{ fontSize: 16, fontWeight: '700' },
  logName:    { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  logDate:    { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  logQty:     { fontSize: 14, fontWeight: '700' },
  logQtyIn:   { color: '#10B981' },
  logQtyOut:  { color: '#EF4444' },
  logStockChange: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  emptyCard:  { backgroundColor: '#fff', borderRadius: 14, padding: 32, alignItems: 'center', gap: 10 },
  emptyIcon:  { fontSize: 40 },
  emptyText:  { fontSize: 14, color: '#94A3B8', textAlign: 'center' },
});
