import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Gorunum'>;
};

type StartScreen = 'Panel' | 'Envanter' | 'Raporlar';
type ListLayout  = 'Kart' | 'Liste';

const START_SCREENS: { key: StartScreen; label: string; icon: string }[] = [
  { key: 'Panel',     label: 'Panel',        icon: '🏠' },
  { key: 'Envanter',  label: 'Ürün Listesi', icon: '📦' },
  { key: 'Raporlar',  label: 'Raporlar',     icon: '📊' },
];

const LAYOUTS: { key: ListLayout; label: string; icon: string }[] = [
  { key: 'Kart',  label: 'Kart Görünümü',  icon: '▦' },
  { key: 'Liste', label: 'Liste Görünümü', icon: '☰' },
];

export default function GorunumScreen({ navigation }: Props) {
  const [darkMode,     setDarkMode]     = useState(false);
  const [startScreen,  setStartScreen]  = useState<StartScreen>('Panel');
  const [listLayout,   setListLayout]   = useState<ListLayout>('Kart');
  const [compactStats, setCompactStats] = useState(false);

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={s.headerIconBox}>
          <Text style={s.headerIcon}>🎨</Text>
        </View>
        <Text style={s.headerTitle}>Görünüm</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Tema */}
        <Text style={s.groupLabel}>TEMA</Text>
        <View style={s.group}>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>Karanlık Mod</Text>
              <Text style={s.rowSubtitle}>Koyu renk paletiyle göz yormayan görünüm</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
              thumbColor={darkMode ? PRIMARY : '#fff'}
            />
          </View>
        </View>

        {/* Varsayılan açılış ekranı */}
        <Text style={s.groupLabel}>VARSAYILAN AÇILIŞ EKRANI</Text>
        <View style={s.group}>
          <Text style={s.groupHint}>Uygulama açıldığında ilk gösterilecek sekmeyi seç.</Text>
          <View style={s.optionList}>
            {START_SCREENS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[s.optionRow, startScreen === opt.key && s.optionRowActive]}
                onPress={() => setStartScreen(opt.key)}
                activeOpacity={0.75}
              >
                <Text style={s.optionIcon}>{opt.icon}</Text>
                <Text style={[s.optionLabel, startScreen === opt.key && s.optionLabelActive]}>{opt.label}</Text>
                {startScreen === opt.key && <Text style={s.optionCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Liste düzeni */}
        <Text style={s.groupLabel}>ÜRÜN LİSTESİ DÜZENİ</Text>
        <View style={s.group}>
          <Text style={s.groupHint}>Ürün Listesi ekranında varsayılan görünüm biçimi.</Text>
          <View style={s.layoutRow}>
            {LAYOUTS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[s.layoutCard, listLayout === opt.key && s.layoutCardActive]}
                onPress={() => setListLayout(opt.key)}
                activeOpacity={0.75}
              >
                <Text style={s.layoutIcon}>{opt.icon}</Text>
                <Text style={[s.layoutLabel, listLayout === opt.key && s.layoutLabelActive]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[s.row, s.rowTopBorder]}>
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>Kompakt İstatistik Kartları</Text>
              <Text style={s.rowSubtitle}>Dashboard'daki kartları daha küçük göster</Text>
            </View>
            <Switch
              value={compactStats}
              onValueChange={setCompactStats}
              trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
              thumbColor={compactStats ? PRIMARY : '#fff'}
            />
          </View>
        </View>

        <Text style={s.footnote}>
          Görünüm tercihleri cihazında saklanır ve yalnızca senin oturumunu etkiler.
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

  groupLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.6, marginBottom: 8, marginLeft: 4 },
  groupHint:  { fontSize: 12, color: '#94A3B8', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6, lineHeight: 17 },
  group: { backgroundColor: WHITE, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2, marginBottom: 24 },

  row:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  rowTopBorder:{ borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  rowTitle:    { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  rowSubtitle: { fontSize: 12, color: '#94A3B8', marginTop: 2, lineHeight: 16 },

  optionList: { paddingHorizontal: 12, paddingBottom: 12, gap: 8 },
  optionRow:        { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  optionRowActive:  { borderColor: PRIMARY, backgroundColor: '#F0F0FF' },
  optionIcon:       { fontSize: 18 },
  optionLabel:      { flex: 1, fontSize: 14, fontWeight: '600', color: '#64748B' },
  optionLabelActive:{ color: PRIMARY },
  optionCheck:      { fontSize: 15, fontWeight: '700', color: PRIMARY },

  layoutRow:  { flexDirection: 'row', gap: 10, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 4 },
  layoutCard: { flex: 1, alignItems: 'center', gap: 8, paddingVertical: 18, borderRadius: 14, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  layoutCardActive: { borderColor: PRIMARY, backgroundColor: '#F0F0FF' },
  layoutIcon:  { fontSize: 22, color: '#94A3B8' },
  layoutLabel: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  layoutLabelActive: { color: PRIMARY },

  footnote: { fontSize: 11, color: '#CBD5E1', textAlign: 'center', lineHeight: 16, marginTop: 4 },
});
