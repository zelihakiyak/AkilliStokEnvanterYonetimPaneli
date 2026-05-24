import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, ProductType } from '../../App';
import apiClient from '../api/apiClient';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'StokHareket'>;
  route: RouteProp<RootStackParamList, 'StokHareket'>;
};

type TransactionType = 'In' | 'Out';

export default function StokHareketScreen({ navigation, route }: Props) {
  const params = route.params;

  const [barcode,     setBarcode]     = useState(params?.barcode     ?? '');
  const [productName, setProductName] = useState(params?.productName ?? '');
  const [product,     setProduct]     = useState<ProductType | null>(null);
  const [quantity,    setQuantity]    = useState(0);
  const [txType,      setTxType]      = useState<TransactionType>('In');
  const [searching,   setSearching]   = useState(false);
  const [saving,      setSaving]      = useState(false);

  // Parametre ile gelindiyse otomatik sorgula
  useEffect(() => {
    if (params?.barcode) {
      fetchProduct(params.barcode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Ürün Sorgula ──────────────────────────────────────────────────────────
  const fetchProduct = useCallback(async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setSearching(true);
    setProduct(null);
    try {
      const res = await apiClient.get<ProductType>(`/Products/barcode/${trimmed}`);
      setProduct(res.data);
      setProductName(res.data.productName);
      setBarcode(res.data.barcode);
    } catch (err: any) {
      if (err.response?.status === 404) {
        Alert.alert('Ürün Bulunamadı', `"${trimmed}" barkoduna ait ürün bulunamadı.`);
      } else {
        Alert.alert('Hata', 'Sunucuya bağlanılamadı.');
      }
    } finally {
      setSearching(false);
    }
  }, []);

  // ── Stok Onayla ──────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!product) {
      Alert.alert('Uyarı', 'Önce barkod ile bir ürün sorgulayın.');
      return;
    }
    if (quantity <= 0) {
      Alert.alert('Uyarı', 'Miktar 0\'dan büyük olmalıdır.');
      return;
    }
    if (txType === 'Out' && quantity > product.currentStock) {
      Alert.alert(
        'Yetersiz Stok',
        `Stokta yalnızca ${product.currentStock} adet var.`,
      );
      return;
    }

    setSaving(true);
    try {
      const payload = {
        productId:       product.id,
        quantityChanged: txType === 'In' ? quantity : -quantity,
        transactionType: txType,
      };
      const res = await apiClient.post('/StockLogs', payload);
      const newStock = res.data?.newStock;

      Alert.alert(
        '✅ İşlem Başarılı',
        `Stok güncellendi.\nYeni stok: ${newStock} adet`,
        [{
          text: 'Tamam',
          onPress: () => navigation.goBack(),
        }],
      );
    } catch {
      Alert.alert('Hata', 'Stok hareketi kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const increaseQty = () => setQuantity(q => q + 1);
  const decreaseQty = () => setQuantity(q => Math.max(0, q - 1));

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────── */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Stok Hareket Formu</Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={s.formCard}>
          {/* ── Ürün Adı ──────────────────────────────── */}
          <Text style={s.label}>Ürün Adı</Text>
          <View style={s.inputBox}>
            <TextInput
              style={s.input}
              placeholder="Ürün adı..."
              placeholderTextColor="#94A3B8"
              value={productName}
              onChangeText={setProductName}
              editable={!product}
            />
          </View>

          {/* ── Barkod ────────────────────────────────── */}
          <Text style={s.label}>Barkod</Text>
          <View style={s.inputBox}>
            <TextInput
              style={[s.input, { flex: 1 }]}
              placeholder="Barkod numarası..."
              placeholderTextColor="#94A3B8"
              value={barcode}
              onChangeText={setBarcode}
              keyboardType="default"
              returnKeyType="search"
              onSubmitEditing={() => fetchProduct(barcode)}
            />
            <TouchableOpacity
              style={s.barcodeSearchBtn}
              onPress={() => fetchProduct(barcode)}
              disabled={searching}
            >
              {searching
                ? <ActivityIndicator color={PRIMARY} size="small" />
                : <Text style={s.barcodeSearchIcon}>⊟</Text>
              }
            </TouchableOpacity>
          </View>

          {/* ── Hareket Tipi Toggle ───────────────────── */}
          <Text style={[s.label, { marginTop: 8 }]}>Hareket Tipi</Text>
          <View style={s.toggle}>
            <TouchableOpacity
              style={[s.toggleBtn, txType === 'In' && s.toggleBtnActive]}
              onPress={() => setTxType('In')}
              activeOpacity={0.8}
            >
              <Text style={[s.toggleBtnText, txType === 'In' && s.toggleBtnTextActive]}>
                Stok Girişi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.toggleBtn, txType === 'Out' && s.toggleBtnActiveOut]}
              onPress={() => setTxType('Out')}
              activeOpacity={0.8}
            >
              <Text style={[s.toggleBtnText, txType === 'Out' && s.toggleBtnTextActive]}>
                Stok Çıkışı
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Miktar ────────────────────────────────── */}
          <Text style={[s.label, { marginTop: 8 }]}>Miktar</Text>
          <View style={s.quantityCard}>
            <Text style={s.quantityDisplay}>{quantity}</Text>
            <View style={s.quantityBtns}>
              <TouchableOpacity style={s.qBtn} onPress={increaseQty}>
                <Text style={s.qBtnText}>⊕</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.qBtn} onPress={decreaseQty}>
                <Text style={s.qBtnText}>⊖</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Mevcut Stok Durumu ────────────────────── */}
        {product && (
          <View style={s.stockStatusCard}>
            <View style={s.stockStatusIcon}>
              <Text style={s.stockStatusIconText}>ℹ</Text>
            </View>
            <View style={s.stockStatusInfo}>
              <Text style={s.stockStatusLabel}>Mevcut Stok Durumu</Text>
              <Text style={s.stockStatusValue}>{product.currentStock} Adet</Text>
            </View>
            {product.currentStock <= product.criticalLimit && (
              <View style={s.criticalTag}>
                <Text style={s.criticalTagText}>KRİTİK</Text>
              </View>
            )}
          </View>
        )}

        {/* Ürün bulunamadıysa boş durum */}
        {!product && !searching && barcode.length === 0 && (
          <View style={s.hintBox}>
            <Text style={s.hintText}>
              💡 Barkod girerek ürünü sorgulayın, ardından stok girişi veya çıkışı yapın.
            </Text>
          </View>
        )}

        {/* ── Onayla Butonu ─────────────────────────── */}
        <TouchableOpacity
          style={[s.confirmBtn, (!product || saving) && s.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={!product || saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={s.confirmBtnIcon}>✓</Text>
              <Text style={s.confirmBtnText}>İşlemi Onayla</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Stiller ───────────────────────────────────────────────────────────────
const PRIMARY = '#4338CA';
const BG      = '#F5F6FA';
const WHITE   = '#FFFFFF';

const s = StyleSheet.create({
  root:        { flex: 1, backgroundColor: BG },
  scrollContent:{ paddingBottom: 24 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WHITE,
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 20,
  },
  backBtn:     { width: 38, height: 38, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  backIcon:    { fontSize: 20, color: '#1E293B' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B' },

  // Form Kartı
  formCard: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },

  // Label
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },

  // Input
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
    height: 52,
  },
  input: {
    fontSize: 15,
    color: '#1E293B',
    paddingVertical: 0,
    flex: 1,
  },
  barcodeSearchBtn: {
    paddingLeft: 10,
    paddingRight: 4,
  },
  barcodeSearchIcon: { fontSize: 22, color: PRIMARY },

  // Hareket Tipi Toggle
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: WHITE,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  toggleBtnActiveOut: {
    backgroundColor: '#FEE2E2',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  toggleBtnText:       { fontSize: 14, fontWeight: '600', color: '#94A3B8' },
  toggleBtnTextActive: { color: '#1E293B' },

  // Miktar Kartı
  quantityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  quantityDisplay: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    minWidth: 60,
    textAlign: 'center',
  },
  quantityBtns: { flexDirection: 'column', gap: 6 },
  qBtn:         { padding: 4 },
  qBtnText:     { fontSize: 26, color: PRIMARY, lineHeight: 28 },

  // Stok Durum Kartı
  stockStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    marginBottom: 20,
  },
  stockStatusIcon: {
    width: 40, height: 40,
    borderRadius: 12,
    backgroundColor: '#C7D2FE',
    alignItems: 'center', justifyContent: 'center',
  },
  stockStatusIconText: { fontSize: 18, color: PRIMARY, fontWeight: '700' },
  stockStatusInfo:     { flex: 1 },
  stockStatusLabel:    { fontSize: 12, color: '#6366F1', fontWeight: '600', marginBottom: 2 },
  stockStatusValue:    { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  criticalTag: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 8,
  },
  criticalTagText: { fontSize: 10, fontWeight: '700', color: '#EF4444' },

  // İpucu Kutusu
  hintBox: {
    marginHorizontal: 20,
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  hintText: { fontSize: 13, color: '#15803D', lineHeight: 20 },

  // Onayla Butonu
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    marginHorizontal: 20,
    borderRadius: 16,
    height: 56,
    gap: 10,
    shadowColor: PRIMARY,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  confirmBtnDisabled: { backgroundColor: '#94A3B8', shadowOpacity: 0 },
  confirmBtnIcon:     { fontSize: 20, color: '#fff' },
  confirmBtnText:     { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
});
