import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddProduct'>;
  route:      RouteProp<RootStackParamList, 'AddProduct'>;
};

type Category = { id: number; categoryName: string };

export default function AddProductScreen({ navigation, route }: Props) {
  const prefillBarcode = route.params?.barcode ?? '';

  const { token } = useAuth();

  const [productName,   setProductName]   = useState('');
  const [barcode,       setBarcode]       = useState(prefillBarcode);
  const [unitPrice,     setUnitPrice]     = useState('');
  const [currentStock,  setCurrentStock]  = useState('');
  const [criticalLimit, setCriticalLimit] = useState('10');
  const [categoryId,     setCategoryId]    = useState<number | null>(null);
  const [categoryText,   setCategoryText]  = useState('');
  const [categories,     setCategories]    = useState<Category[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [saving,         setSaving]        = useState(false);

  const filteredCategories = categories.filter(c => {
    const categoryNameSafe = c?.categoryName || '';
    const searchTextSafe = categoryText || '';
    return categoryNameSafe.toLowerCase().includes(searchTextSafe.toLowerCase());
  });

  useEffect(() => {
      if (!token) return; 

      apiClient.get<Category[]>('/Categories', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(r => {
        if (Array.isArray(r.data)) {
          setCategories(r.data);
        }
      })
      .catch((err) => {
        console.error("Kategoriler çekilirken hata oluştu:", err.message);
      });
    }, [token]); 

  const handleSave = async () => {
    if (!productName.trim() || !barcode.trim() || !unitPrice || !currentStock) {
      Alert.alert('Uyarı', 'Ürün adı, barkod, fiyat ve stok zorunludur.');
      return;
    }
    if (!categoryId) {
      Alert.alert('Uyarı', 'Lütfen bir kategori seçin.');
      return;
    }

    setSaving(true);
    try {
      await apiClient.post('/Products', {
        productName:   productName.trim(),
        barcode:       barcode.trim(),
        unitPrice:     parseFloat(unitPrice),
        currentStock:  parseInt(currentStock),
        criticalLimit: parseInt(criticalLimit) || 10,
        categoryId,
      });
      Alert.alert('✅ Başarılı', 'Ürün eklendi.', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Ürün eklenemedi.';
      Alert.alert('Hata', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Yeni Ürün Ekle</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.card}>
          {/* Ürün Adı */}
          <Text style={s.label}>Ürün Adı *</Text>
          <TextInput style={s.input} value={productName} onChangeText={setProductName} placeholder="Ürün adını girin" placeholderTextColor="#94A3B8" />

          {/* Barkod */}
          <Text style={s.label}>Barkod *</Text>
          <TextInput
            style={[s.input, prefillBarcode ? s.inputLocked : undefined]}
            value={barcode}
            onChangeText={setBarcode}
            placeholder="Barkod numarası"
            placeholderTextColor="#94A3B8"
            keyboardType="default"
            editable={!prefillBarcode}
          />
          {prefillBarcode ? (
            <Text style={s.lockedHint}>📷 Barkod kameradan okundu, değiştirilemez.</Text>
          ) : null}

          {/* Birim Fiyat */}
          <Text style={s.label}>Birim Fiyat (₺) *</Text>
          <TextInput style={s.input} value={unitPrice} onChangeText={setUnitPrice} placeholder="0.00" placeholderTextColor="#94A3B8" keyboardType="decimal-pad" />

          {/* Mevcut Stok */}
          <Text style={s.label}>Mevcut Stok *</Text>
          <TextInput style={s.input} value={currentStock} onChangeText={setCurrentStock} placeholder="0" placeholderTextColor="#94A3B8" keyboardType="number-pad" />

          {/* Kritik Limit */}
          <Text style={s.label}>Kritik Stok Limiti</Text>
          <TextInput style={s.input} value={criticalLimit} onChangeText={setCriticalLimit} placeholder="10" placeholderTextColor="#94A3B8" keyboardType="number-pad" />

          {/* Kategori */}
          <Text style={s.label}>Kategori *</Text>
          <View>
            <TextInput
              style={[s.input, categoryId ? s.inputSelected : undefined]}
              value={categoryText}
              onChangeText={text => {
                setCategoryText(text);
                setCategoryId(null);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Kategori seçiniz."
              placeholderTextColor="#94A3B8"
            />
            {categoryId ? (
              <Text style={s.selectedHint}>✓ Seçildi</Text>
            ) : null}
            
            
            {showSuggestions && (categoryText?.length ?? 0) > 0 && (filteredCategories?.length ?? 0) > 0 && (
              <View style={s.suggestionBox}>
                {filteredCategories.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={s.suggestionItem}
                    onPress={() => {
                      setCategoryId(c.id);
                      setCategoryText(c.categoryName || '');
                      setShowSuggestions(false);
                    }}
                  >
                    <Text style={s.suggestionText}>{c.categoryName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

          
            {showSuggestions && (categoryText?.length ?? 0) === 0 && (categories?.length ?? 0) > 0 && (
              <View style={s.suggestionBox}>
                {categories.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={s.suggestionItem}
                    onPress={() => {
                      setCategoryId(c.id);
                      setCategoryText(c.categoryName || '');
                      setShowSuggestions(false);
                    }}
                  >
                    <Text style={s.suggestionText}>{c.categoryName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Kaydet */}
        <TouchableOpacity
          style={[s.saveBtn, saving && s.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={s.saveBtnText}>✓  Ürünü Kaydet</Text>}
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const PRIMARY = '#4338CA';

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F6FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', paddingTop: 52, paddingBottom: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 20, color: '#1E293B' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B' },
  content: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 10, elevation: 2 },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8, marginTop: 4 },
  input: { borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#1E293B', backgroundColor: '#F8FAFC', marginBottom: 12 },
  noCategory: { color: '#94A3B8', fontSize: 13, marginBottom: 12 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
  categoryChipActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  categoryChipText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  categoryChipTextActive: { color: '#fff', fontWeight: '700' },
  saveBtn: { backgroundColor: PRIMARY, borderRadius: 16, height: 56, alignItems: 'center', justifyContent: 'center', shadowColor: PRIMARY, shadowOpacity: 0.35, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 6 },
  saveBtnDisabled: { backgroundColor: '#94A3B8', shadowOpacity: 0 },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  inputLocked:   { backgroundColor: '#F1F5F9', color: '#64748B', borderColor: '#CBD5E1' },
  inputSelected: { borderColor: '#4338CA', backgroundColor: '#F0F0FF' },
  lockedHint:    { fontSize: 11, color: '#64748B', marginTop: -8, marginBottom: 12, marginLeft: 4 },
  selectedHint:  { fontSize: 11, color: '#4338CA', marginTop: -8, marginBottom: 12, marginLeft: 4, fontWeight: '600' },
  suggestionBox: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, marginTop: -8, marginBottom: 12, overflow: 'hidden' },
  suggestionItem:{ paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  suggestionText:{ fontSize: 14, color: '#1E293B' },
});
