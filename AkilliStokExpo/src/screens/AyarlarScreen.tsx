import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Ayarlar'>;
};

type RowKey = 'Hesap' | 'Bildirimler' | 'Gorunum';

const ROWS: { key: RowKey; icon: string; title: string; subtitle: string; route: keyof RootStackParamList }[] = [
  { key: 'Hesap',       icon: '👤', title: 'Hesap',       subtitle: 'Profil bilgileri, rol ve oturum',           route: 'Hesap' },
  { key: 'Bildirimler', icon: '🔔', title: 'Bildirimler', subtitle: 'Kritik stok uyarıları ve eşik ayarları',     route: 'Bildirimler' },
  { key: 'Gorunum',     icon: '🎨', title: 'Görünüm',     subtitle: 'Tema, varsayılan ekran ve liste düzeni',    route: 'Gorunum' },
];

export default function AyarlarScreen({ navigation }: Props) {
  const { user, isAdmin } = useAuth();

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={s.headerIconBox}>
          <Text style={s.headerIcon}>⚙️</Text>
        </View>
        <Text style={s.headerTitle}>Ayarlar</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Kullanıcı kartı */}
        <View style={s.userCard}>
          <View style={s.userAvatar}>
            <Text style={s.userAvatarText}>👤</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.userName} numberOfLines={1}>{user?.fullName ?? '—'}</Text>
            <Text style={s.userEmail} numberOfLines={1}>{user?.email ?? '—'}</Text>
          </View>
          <View style={s.roleTag}>
            <Text style={s.roleTagText}>{isAdmin ? 'Admin' : 'Personel'}</Text>
          </View>
        </View>

        {/* Ayar satırları */}
        <Text style={s.groupLabel}>GENEL</Text>
        <View style={s.group}>
          {ROWS.map((row, i) => (
            <TouchableOpacity
              key={row.key}
              style={[s.row, i !== ROWS.length - 1 && s.rowDivider]}
              onPress={() => navigation.navigate(row.route as any)}
              activeOpacity={0.7}
            >
              <View style={s.rowIconBox}>
                <Text style={s.rowIcon}>{row.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowTitle}>{row.title}</Text>
                <Text style={s.rowSubtitle} numberOfLines={1}>{row.subtitle}</Text>
              </View>
              <Text style={s.rowArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.versionText}>Akıllı Stok Envanter Yönetim Paneli · v1.0.0</Text>
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

  content: { padding: 20, paddingBottom: 110 },

  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, borderRadius: 16, padding: 16, gap: 12, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2 },
  userAvatar:     { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E0E4FF', alignItems: 'center', justifyContent: 'center' },
  userAvatarText: { fontSize: 22 },
  userName:  { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  userEmail: { fontSize: 12, color: '#64748B', marginTop: 2 },
  roleTag:      { backgroundColor: '#EEF2FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  roleTagText:  { fontSize: 11, fontWeight: '700', color: PRIMARY },

  groupLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.6, marginBottom: 8, marginLeft: 4 },
  group: { backgroundColor: WHITE, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2, marginBottom: 24 },
  row:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  rowDivider:  { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  rowIconBox:  { width: 38, height: 38, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  rowIcon:     { fontSize: 18 },
  rowTitle:    { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  rowSubtitle: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  rowArrow:    { fontSize: 22, color: '#CBD5E1' },

  versionText: { textAlign: 'center', fontSize: 11, color: '#CBD5E1', marginTop: 4 },
});
