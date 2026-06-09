import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';
import apiClient from '../../api/apiClient';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SifreDegistir'>;
};

export default function SifreDegistirScreen({ navigation }: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving,          setSaving]          = useState(false);

  const canSubmit = currentPassword.length > 0 && newPassword.length > 0 && confirmPassword.length > 0;

  const handleSave = async () => {
    if (!canSubmit) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Geçersiz Şifre', 'Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Şifreler Eşleşmiyor', 'Yeni şifre ve tekrarı birbiriyle aynı olmalıdır.');
      return;
    }
    if (newPassword === currentPassword) {
      Alert.alert('Geçersiz Şifre', 'Yeni şifre, mevcut şifrenizle aynı olamaz.');
      return;
    }

    setSaving(true);
    try {
      await apiClient.put('/Users/change-password', {
        currentPassword,
        newPassword,
      });
      Alert.alert('Başarılı', 'Şifreniz başarıyla güncellendi.', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Şifre değiştirilirken bir hata oluştu.';
      Alert.alert('İşlem Başarısız', msg);
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
          <Text style={s.headerIcon}>🔒</Text>
        </View>
        <Text style={s.headerTitle}>Şifre Değiştir</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.infoText}>
          Hesabınızın güvenliği için mevcut şifrenizi doğrulayıp yeni bir şifre belirleyin.
          Yeni şifreniz en az 6 karakter olmalıdır.
        </Text>

        <Text style={s.groupLabel}>ŞİFRE BİLGİLERİ</Text>
        <View style={s.group}>
          <View style={s.field}>
            <Text style={s.fieldLabel}>Mevcut Şifre</Text>
            <TextInput
              style={s.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry
            />
          </View>
          <View style={[s.field, s.fieldDivider]}>
            <Text style={s.fieldLabel}>Yeni Şifre</Text>
            <TextInput
              style={s.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="En az 6 karakter"
              placeholderTextColor="#94A3B8"
              secureTextEntry
            />
          </View>
          <View style={[s.field, s.fieldDivider]}>
            <Text style={s.fieldLabel}>Yeni Şifre (Tekrar)</Text>
            <TextInput
              style={s.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Yeni şifrenizi tekrar girin"
              placeholderTextColor="#94A3B8"
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity
          style={[s.saveBtn, (!canSubmit || saving) && s.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!canSubmit || saving}
          activeOpacity={0.85}
        >
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.saveBtnText}>Şifreyi Güncelle</Text>}
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

  infoText: { fontSize: 13, color: '#64748B', lineHeight: 19, marginBottom: 20 },

  groupLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.6, marginBottom: 8, marginLeft: 4 },
  group: { backgroundColor: WHITE, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2, marginBottom: 24 },

  field:        { paddingHorizontal: 16, paddingVertical: 12 },
  fieldDivider: { borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  fieldLabel:   { fontSize: 12, color: '#94A3B8', marginBottom: 6 },
  input:        { fontSize: 15, fontWeight: '600', color: '#1E293B', paddingVertical: 4 },

  saveBtn:         { backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  saveBtnDisabled: { backgroundColor: '#C7D2FE' },
  saveBtnText:     { color: '#fff', fontSize: 15, fontWeight: '700' },
});
