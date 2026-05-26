import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [loading,      setLoading]      = useState(false);
  const [rememberMe,   setRememberMe]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Uyarı', 'E-posta ve şifre boş bırakılamaz.');
      return;
    }
    setLoading(true);
    await login(email.trim(), password);
    // Başarılı girişte App.tsx otomatik olarak Home'a yönlendirir
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Kart */}
        <View style={styles.card}>

          {/* Logo */}
          <View style={styles.logoWrapper}>
            <View style={styles.logoBox}>
              <Text style={styles.logoIcon}>▤</Text>
            </View>
          </View>

          {/* Başlık */}
          <Text style={styles.title}>Envanter Yönetim Sistemi</Text>
          <Text style={styles.subtitle}>Devam etmek için giriş yapın</Text>

          {/* E-posta */}
          <Text style={styles.label}>E-posta</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>✉</Text>
            <TextInput
              style={styles.input}
              placeholder="eposta@sirket.com"
              placeholderTextColor="#A0AEC0"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Şifre */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>Şifre</Text>
            <TouchableOpacity onPress={() => Alert.alert('Bilgi', 'Şifre sıfırlama yakında aktif olacak.')}>
              <Text style={styles.forgotText}>Şifremi Unuttum?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#A0AEC0"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          {/* Beni Hatırla */}
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberText}>Beni hatırla</Text>
          </TouchableOpacity>

          {/* Giriş Yap Butonu */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Giriş Yap  →</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          © 2024 Kurumsal Envanter Yönetim Sistemi v2.4.0{'\n'}
          Güvenli erişim protokolü aktif.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const PRIMARY = '#4338CA';
const LIGHT_BG = '#EEEEF8';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEEF5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  /* Kart */
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 36,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 5,
  },

  /* Logo */
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: LIGHT_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 34,
    color: PRIMARY,
  },

  /* Başlık */
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 32,
  },

  /* Label */
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY,
  },

  /* Input */
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F7F8FC',
    marginBottom: 16,
    height: 52,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
    color: '#718096',
  },
  eyeIcon: {
    fontSize: 16,
    color: '#718096',
    paddingLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#2D3748',
    paddingVertical: 0,
  },

  /* Beni Hatırla */
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  rememberText: {
    fontSize: 14,
    color: '#4A5568',
  },

  /* Buton */
  button: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  /* Footer */
  footer: {
    marginTop: 28,
    textAlign: 'center',
    fontSize: 12,
    color: '#718096',
    lineHeight: 18,
  },
});