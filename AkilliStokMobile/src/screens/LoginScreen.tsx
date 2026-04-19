import React, { useState, useContext } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import apiClient from '../api/apiClient';
import { AuthContext } from '../context/AuthContext';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation: _navigation }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Uyarı', 'Email ve şifre boş bırakılamaz.');
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.post('/Users/login', { email, password });
            const userData = response.data;

            if (userData.token) {
                await login(userData.token, userData);
                
            } else {
                Alert.alert('Hata', 'Sunucudan geçerli bir token alınamadı.');
            }

        } catch (error: any) {
            console.log('LOGIN HATA:', error.response?.status, error.response?.data, error.message);
            const msg = error.response?.data?.message || 'Sunucuya bağlanılamadı.';
            Alert.alert('Giriş Hatası', msg);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.card}>
                <Text style={styles.title}>📦 Stok Yönetim</Text>
                <Text style={styles.subtitle}>Hesabınıza giriş yapın</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email adresiniz"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Şifreniz"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.buttonText}>Giriş Yap</Text>
                    }
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 28,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 28,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#111827',
        marginBottom: 14,
        backgroundColor: '#F9FAFB',
    },
    button: {
        backgroundColor: '#4F46E5',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});