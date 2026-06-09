import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProfilDuzenle'>;
};

export default function ProfilDuzenleScreen({ navigation }: Props) {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [email,    setEmail]    = useState(user?.email ?? '');
  const [saving,   setSaving]   = useState(false);

  const isDirty = fullName.trim() !== (user?.fullName ?? '') || email.trim() !== (user?.email ?? '');

  const handleSave = async () => {
    const trimmedName  = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      Alert.alert('Eksik Bilgi', 'Ad Soyad ve E-posta alanları boş bırakılamaz.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Geçersiz E-posta', 'Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    setSaving(true);
    try {
      const res = await apiClient.put('/Users/profile', { fullName: trimmedName, email: trimmedEmail });
      await updateUser({ fullName: res.data.fullName, email: res.data.email });
      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Profil güncellenirken bir hata oluştu.';
      Alert.alert('Güncelleme Başarısız', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={s.headerIconBox}>
          <Text style={s.headerIcon}>✎</Text>
        </View>
        <Text style={s.headerTitle}>Profili Düzenle</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.avatarWrap}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>👤</Text>
          </View>
        </View>

        <Text style={s.groupLabel}>KİŞİSEL BİLGİLER</Text>
        <View style={s.group}>
          <View style={s.field}>
            <Text style={s.fieldLabel}>Ad Soyad</Text>
            <TextInput
              style={s.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Ad Soyad"
              placeholderTextColor="#94A3B8"
              autoCapitalize="words"
            />
          </View>
          <View style={[s.field, s.fieldDivider]}>
            <Text style={s.fieldLabel}>E-posta</Text>
            <TextInput
              style={s.input}
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@eposta.com"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        <Text style={s.footnote}>
          Rolünüz değiştirilemez; rol değişiklikleri yalnızca yöneticiler tarafından yapılabilir.
        </Text>

        <TouchableOpacity
          style={[s.saveBtn, (!isDirty || saving) && s.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!isDirty || saving}
          activeOpacity={0.85}
        >
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.saveBtnText}>Değişiklikleri Kaydet</Text>}
        </TouchableOpacity>
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
  headerIcon:    { fontSize: 16, color: PRIMARY },
  headerTitle:   { flex: 1, fontSize: 18, fontWeight: '700', color: '#1E293B' },

  content: { padding: 20, paddingBottom: 60 },

  avatarWrap: { alignItems: 'center', marginBottom: 24 },
  avatar:     { width: 72, height: 72, borderRadius: 36, backgroundColor: '#E0E4FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 32 },

  groupLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.6, marginBottom: 8, marginLeft: 4 },
  group: { backgroundColor: WHITE, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2, marginBottom: 16 },

  field:        { paddingHorizontal: 16, paddingVertical: 12 },
  fieldDivider: { borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  fieldLabel:   { fontSize: 12, color: '#94A3B8', marginBottom: 6 },
  input:        { fontSize: 15, fontWeight: '600', color: '#1E293B', paddingVertical: 4 },

  footnote: { fontSize: 11, color: '#CBD5E1', textAlign: 'center', lineHeight: 16, marginBottom: 24, marginTop: 4, paddingHorizontal: 8 },

  saveBtn:         { backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  saveBtnDisabled: { backgroundColor: '#C7D2FE' },
  saveBtnText:     { color: '#fff', fontSize: 15, fontWeight: '700' },
});
