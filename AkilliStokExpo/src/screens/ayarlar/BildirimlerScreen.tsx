import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Bildirimler'>;
};

const THRESHOLD_OPTIONS = [3, 5, 7, 14];

export default function BildirimlerScreen({ navigation }: Props) {
  const [criticalAlertsEnabled, setCriticalAlertsEnabled] = useState(true);
  const [bannerEnabled,        setBannerEnabled]          = useState(true);
  const [soundEnabled,         setSoundEnabled]           = useState(true);
  const [vibrationEnabled,     setVibrationEnabled]       = useState(true);
  const [threshold,            setThreshold]              = useState(3);

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={s.headerIconBox}>
          <Text style={s.headerIcon}>🔔</Text>
        </View>
        <Text style={s.headerTitle}>Bildirimler</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.infoText}>
          Bu ayarlar, tahminleme algoritmasının "yakında bitecek ürünler" uyarılarının
          ne zaman ve nasıl gösterileceğini belirler.
        </Text>

        {/* Genel anahtar */}
        <Text style={s.groupLabel}>KRİTİK STOK UYARILARI</Text>
        <View style={s.group}>
          <View style={[s.row, s.rowDivider]}>
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>Açılış Uyarısı (Alert)</Text>
              <Text style={s.rowSubtitle}>Uygulama açıldığında acil ürünleri bildir</Text>
            </View>
            <Switch
              value={criticalAlertsEnabled}
              onValueChange={setCriticalAlertsEnabled}
              trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
              thumbColor={criticalAlertsEnabled ? PRIMARY : '#fff'}
            />
          </View>

          <View style={[s.row, s.rowDivider]}>
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>Kalıcı Banner (Badge)</Text>
              <Text style={s.rowSubtitle}>Dashboard'da uyarı şeridini göster</Text>
            </View>
            <Switch
              value={bannerEnabled}
              onValueChange={setBannerEnabled}
              trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
              thumbColor={bannerEnabled ? PRIMARY : '#fff'}
            />
          </View>

          <View style={[s.row, s.rowDivider]}>
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>Bildirim Sesi</Text>
              <Text style={s.rowSubtitle}>Uyarı geldiğinde ses çal</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
              thumbColor={soundEnabled ? PRIMARY : '#fff'}
            />
          </View>

          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>Titreşim</Text>
              <Text style={s.rowSubtitle}>Uyarı geldiğinde titreşim ver</Text>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
              thumbColor={vibrationEnabled ? PRIMARY : '#fff'}
            />
          </View>
        </View>

        {/* Eşik gün sayısı */}
        <Text style={s.groupLabel}>UYARI EŞİĞİ</Text>
        <View style={s.group}>
          <View style={s.thresholdHeader}>
            <Text style={s.rowTitle}>Kaç gün kala uyarılayım?</Text>
            <Text style={s.rowSubtitle}>
              Tahmini bitiş süresi seçtiğin gün sayısının altına düşen ürünler için uyarı gösterilir.
            </Text>
          </View>
          <View style={s.thresholdRow}>
            {THRESHOLD_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[s.thresholdChip, threshold === opt && s.thresholdChipActive]}
                onPress={() => setThreshold(opt)}
                activeOpacity={0.75}
              >
                <Text style={[s.thresholdChipText, threshold === opt && s.thresholdChipTextActive]}>
                  {opt} gün
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={s.footnote}>
          Not: Bu ekrandaki tercihler arayüz üzerinde anlık olarak uygulanır; sunucu tarafı
          senkronizasyonu ileride eklenebilir.
        </Text>
      </ScrollView>
    </View>
  );
}

const PRIMARY = '#4338CA';
const BG      = '#F5F6FA';
const WHITE   = '#FFFFFF';

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: BG },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, paddingTop: 52, paddingBottom: 16, paddingHorizontal: 20, gap: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn:       { padding: 4 },
  backIcon:      { fontSize: 22, color: '#1E293B' },
  headerIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#E0E4FF', alignItems: 'center', justifyContent: 'center' },
  headerIcon:    { fontSize: 18, color: PRIMARY },
  headerTitle:   { flex: 1, fontSize: 18, fontWeight: '700', color: '#1E293B' },

  content: { padding: 20, paddingBottom: 60 },

  infoText: { fontSize: 13, color: '#64748B', lineHeight: 19, marginBottom: 20 },

  groupLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.6, marginBottom: 8, marginLeft: 4 },
  group: { backgroundColor: WHITE, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2, marginBottom: 24, padding: 4 },

  row:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 14, gap: 10 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  rowTitle:    { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  rowSubtitle: { fontSize: 12, color: '#94A3B8', marginTop: 2, lineHeight: 16 },

  thresholdHeader: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 4 },
  thresholdRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 12 },
  thresholdChip:      { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  thresholdChipActive:{ backgroundColor: PRIMARY, borderColor: PRIMARY },
  thresholdChipText:      { fontSize: 13, color: '#64748B', fontWeight: '600' },
  thresholdChipTextActive:{ color: '#fff', fontWeight: '700' },

  footnote: { fontSize: 11, color: '#CBD5E1', textAlign: 'center', lineHeight: 16, marginTop: 4 },
});
