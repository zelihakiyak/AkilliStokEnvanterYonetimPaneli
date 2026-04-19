import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert, ActivityIndicator,
    ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import apiClient from '../api/apiClient';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'AddProduct'>;
};

export default function AddProductScreen({ navigation }: Props) {
    const [barcode,       setBarcode]       = useState('');
    const [productName,   setProductName]   = useState('');
    const [unitPrice,     setUnitPrice]     = useState('');
    const [currentStock,  setCurrentStock]  = useState('');
    const [criticalLimit, setCriticalLimit] = useState('10');
    const [categoryId,    setCategoryId]    = useState('1');
    const [loading,       setLoading]       = useState(false);

    const handleAdd = async () => {
        if (!barcode.trim() || !productName.trim() || !unitPrice || !currentStock) {
            Alert.alert('Uyarı', 'Lütfen tüm zorunlu alanları doldurun.');
            return;
        }

        setLoading(true);
        try {
            await apiClient.post('/Products', {
                barcode,
                productName,
                unitPrice:     parseFloat(unitPrice),
                currentStock:  parseInt(currentStock),
                criticalLimit: parseInt(criticalLimit),
                categoryId:    parseInt(categoryId),
            });

            Alert.alert('Başarılı', 'Ürün eklendi.', [
                { text: 'Tamam', onPress: () => navigation.goBack() }
            ]);
        } catch {
            Alert.alert('Hata', 'Ürün eklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>← Geri</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Yeni Ürün</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 40 }}>

                {[
                    { label: 'Barkod *',         value: barcode,       setter: setBarcode,       keyboard: 'default' },
                    { label: 'Ürün Adı *',        value: productName,   setter: setProductName,   keyboard: 'default' },
                    { label: 'Birim Fiyat (₺) *', value: unitPrice,     setter: setUnitPrice,     keyboard: 'decimal-pad' },
                    { label: 'Mevcut Stok *',     value: currentStock,  setter: setCurrentStock,  keyboard: 'numeric' },
                    { label: 'Kritik Limit',      value: criticalLimit, setter: setCriticalLimit, keyboard: 'numeric' },
                    { label: 'Kategori ID',       value: categoryId,    setter: setCategoryId,    keyboard: 'numeric' },
                ].map(field => (
                    <View key={field.label}>
                        <Text style={styles.label}>{field.label}</Text>
                        <TextInput
                            style={styles.input}
                            value={field.value}
                            onChangeText={field.setter}
                            keyboardType={field.keyboard as any}
                            placeholderTextColor="#9CA3AF"
                            placeholder={field.label.replace(' *', '')}
                        />
                    </View>
                ))}

                <TouchableOpacity
                    style={[styles.btn, loading && styles.btnDisabled]}
                    onPress={handleAdd}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="#fff" />
                        : <Text style={styles.btnText}>Ürünü Kaydet</Text>
                    }
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#4F46E5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 52,
        paddingBottom: 16,
    },
    backBtn: { color: '#C7D2FE', fontSize: 15 },
    title:   { color: '#fff', fontSize: 18, fontWeight: '700' },
    form:    { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
    label:   { fontSize: 13, color: '#374151', marginBottom: 6, marginTop: 12, fontWeight: '500' },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 11,
        fontSize: 15,
        color: '#111827',
    },
    btn: {
        backgroundColor: '#4F46E5',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 24,
    },
    btnDisabled: { opacity: 0.6 },
    btnText:     { color: '#fff', fontSize: 16, fontWeight: '600' },
});