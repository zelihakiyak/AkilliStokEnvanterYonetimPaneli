import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useAuth } from '../../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Hesap'>;
};

export default function HesapScreen({ navigation }: Props) {
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkmak istiyor musunuz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış Yap', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={s.headerIconBox}>
          <Text style={s.headerIcon}>👤</Text>
        </View>
        <Text style={s.headerTitle}>Hesap</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Profil kartı */}
        <View style={s.profileCard}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>👤</Text>
          </View>
          <Text style={s.profileName}>{user?.fullName ?? '—'}</Text>
          <Text style={s.profileEmail}>{user?.email ?? '—'}</Text>
          <View style={s.roleTag}>
            <Text style={s.roleTagText}>{isAdmin ? 'Admin' : 'Personel'}</Text>
          </View>
        </View>

        {/* Bilgiler */}
        <Text style={s.groupLabel}>HESAP BİLGİLERİ</Text>
        <View style={s.group}>
          <View style={[s.row, s.rowDivider]}>
            <Text style={s.rowLabel}>Ad Soyad</Text>
            <Text style={s.rowValue} numberOfLines={1}>{user?.fullName ?? '—'}</Text>
          </View>
          <View style={[s.row, s.rowDivider]}>
            <Text style={s.rowLabel}>E-posta</Text>
            <Text style={s.rowValue} numberOfLines={1}>{user?.email ?? '—'}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.rowLabel}>Rol</Text>
            <Text style={s.rowValue}>{user?.role ?? (isAdmin ? 'Admin' : 'Personel')}</Text>
          </View>
        </View>

        {/* Eylemler */}
        <Text style={s.groupLabel}>HESAP İŞLEMLERİ</Text>
        <View style={s.group}>
          <TouchableOpacity
            style={[s.actionRow, s.rowDivider]}
            onPress={() => navigation.navigate('ProfilDuzenle')}
            activeOpacity={0.7}
          >
            <View style={s.actionIconBox}>
              <Text style={s.actionIcon}>✎</Text>
            </View>
            <Text style={s.actionLabel}>Profili Düzenle</Text>
            <Text style={s.rowArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.actionRow, s.rowDivider]}
            onPress={() => navigation.navigate('SifreDegistir')}
            activeOpacity={0.7}
          >
            <View style={s.actionIconBox}>
              <Text style={s.actionIcon}>🔒</Text>
            </View>
            <Text style={s.actionLabel}>Şifre Değiştir</Text>
            <Text style={s.rowArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.actionRow}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={[s.actionIconBox, s.actionIconBoxDanger]}>
              <Text style={s.actionIcon}>⏻</Text>
            </View>
            <Text style={[s.actionLabel, s.actionLabelDanger]}>Çıkış Yap</Text>
            <Text style={s.rowArrow}>›</Text>
          </TouchableOpacity>
        </View>
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

  profileCard: { alignItems: 'center', backgroundColor: WHITE, borderRadius: 18, paddingVertical: 28, marginBottom: 24, gap: 6, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2 },
  avatar:     { width: 72, height: 72, borderRadius: 36, backgroundColor: '#E0E4FF', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  avatarText: { fontSize: 32 },
  profileName:  { fontSize: 17, fontWeight: '700', color: '#1E293B' },
  profileEmail: { fontSize: 13, color: '#64748B' },
  roleTag:      { backgroundColor: '#EEF2FF', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5, marginTop: 6 },
  roleTagText:  { fontSize: 11, fontWeight: '700', color: PRIMARY },

  groupLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.6, marginBottom: 8, marginLeft: 4 },
  group: { backgroundColor: WHITE, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2, marginBottom: 24 },

  row:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  rowLabel:   { fontSize: 14, color: '#64748B' },
  rowValue:   { fontSize: 14, fontWeight: '600', color: '#1E293B', maxWidth: '60%' },
  rowArrow:   { fontSize: 22, color: '#CBD5E1' },

  actionRow:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  actionIconBox:    { width: 38, height: 38, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  actionIconBoxDanger: { backgroundColor: '#FEE2E2' },
  actionIcon:       { fontSize: 16 },
  actionLabel:      { flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B' },
  actionLabelDanger:{ color: '#EF4444' },
});
