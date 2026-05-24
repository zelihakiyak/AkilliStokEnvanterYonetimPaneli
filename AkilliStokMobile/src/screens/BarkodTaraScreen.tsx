/**
 * BarkodTaraScreen
 *
 * Şu an: Manuel barkod girişi + tam API bağlantısı.
 *
 * Gerçek kamera eklemek için:
 *   npm install react-native-vision-camera
 *   cd ios && pod install
 * Ardından TODO yorumlarını takip et.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ProductType } from '../../App';
import apiClient from '../api/apiClient';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'BarkodTara'>;
};

// ─── Ana Ekran ─────────────────────────────────────────────────────────────
export default function BarkodTaraScreen({ navigation }: Props) {
  const [barcode,     setBarcode]     = useState('');
  const [product,     setProduct]     = useState<ProductType | null>(null);
  const [searching,   setSearching]   = useState(false);
  const [quantity,    setQuantity]    = useState(1);
  const [torchOn,     setTorchOn]     = useState(false);
  const [saving,      setSaving]      = useState(false);

  // Tarama animasyonu
  const scanAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    ).start();
  }, [scanAnim]);

  const scanLineY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  // ── Barkod Sorgula ────────────────────────────────────────────────────────
  const handleSearch = useCallback(async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;

    setSearching(true);
    setProduct(null);
    setQuantity(1);
    try {
      const res = await apiClient.get<ProductType>(`/Products/barcode/${trimmed}`);
      setProduct(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        Alert.alert(
          'Ürün Bulunamadı',
          `"${trimmed}" barkoduna ait ürün kayıtlı değil.\nStok hareketi eklemek ister misiniz?`,
          [
            { text: 'İptal', style: 'cancel' },
            {
              text: 'Ekle',
              onPress: () =>
                navigation.navigate('StokHareket', { barcode: trimmed }),
            },
          ],
        );
      } else {
        Alert.alert('Hata', 'Sunucuya bağlanılamadı.');
      }
    } finally {
      setSearching(false);
    }
  }, [navigation]);

  // ── Stok Kaydet ───────────────────────────────────────────────────────────
  const handleSave = useCallback(async (type: 'In' | 'Out') => {
    if (!product) return;
    if (quantity <= 0) { Alert.alert('Uyarı', 'Miktar 0\'dan büyük olmalı.'); return; }
    if (type === 'Out' && quantity > product.currentStock) {
      Alert.alert('Uyarı', `Stokta yalnızca ${product.currentStock} adet var.`);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        productId:       product.id,
        quantityChanged: type === 'In' ? quantity : -quantity,
        transactionType: type,
      };
      const res = await apiClient.post('/StockLogs', payload);
      const newStock = res.data?.newStock ?? product.currentStock + payload.quantityChanged;

      Alert.alert(
        '✅ Başarılı',
        `Stok güncellendi.\nYeni stok: ${newStock} adet`,
        [{ text: 'Tamam', onPress: () => { setBarcode(''); setProduct(null); setQuantity(1); } }],
      );
    } catch {
      Alert.alert('Hata', 'Stok kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  }, [product, quantity]);

  // ── İptal ─────────────────────────────────────────────────────────────────
  const handleCancel = () => {
    setBarcode('');
    setProduct(null);
    setQuantity(1);
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ── Kamera Alanı (Simüle) ──────────────────────── */}
      <View style={s.cameraArea}>
        {/* Header */}
        <View style={s.camHeader}>
          <TouchableOpacity style={s.camBtn} onPress={() => navigation.goBack()}>
            <Text style={s.camBtnIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.camTitle}>Barkod Tarama</Text>
          <TouchableOpacity style={s.camBtn} onPress={() => setTorchOn(t => !t)}>
            <Text style={s.camBtnIcon}>{torchOn ? '⚡' : '○'}</Text>
          </TouchableOpacity>
        </View>

        {/* Hizalama metni */}
        <Text style={s.alignText}>Barkodu hizalayın...</Text>

        {/* Tarama çerçevesi */}
        <View style={s.scanFrame}>
          {/* Köşe çizgileri */}
          <View style={[s.corner, s.cornerTL]} />
          <View style={[s.corner, s.cornerTR]} />
          <View style={[s.corner, s.cornerBL]} />
          <View style={[s.corner, s.cornerBR]} />
          {/* Tarama çizgisi */}
          <Animated.View style={[s.scanLine, { transform: [{ translateY: scanLineY }] }]} />
        </View>

        {/* TODO: react-native-vision-camera entegrasyonu için:
            import { Camera, useCameraDevice } from 'react-native-vision-camera';
            const device = useCameraDevice('back');
            <Camera device={device} isActive={true} onCodeScanned={(codes) => handleSearch(codes[0]?.value ?? '')} />
        */}

        {/* Manuel Giriş */}
        <View style={s.manualRow}>
          <TextInput
            style={s.manualInput}
            placeholder="Barkodu girin veya yazın..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={barcode}
            onChangeText={setBarcode}
            keyboardType="default"
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(barcode)}
            selectionColor="#fff"
          />
          <TouchableOpacity
            style={s.manualSearchBtn}
            onPress={() => handleSearch(barcode)}
            disabled={searching}
          >
            {searching
              ? <ActivityIndicator color="#4338CA" size="small" />
              : <Text style={s.manualSearchBtnText}>Ara</Text>
            }
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Alt Panel ──────────────────────────────────── */}
      <ScrollView
        style={s.bottomPanel}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Ürün Bilgisi */}
        {product ? (
          <>
            <View style={s.productHeader}>
              <Text style={s.productHeaderLabel}>SON TARATILANLAR</Text>
              <View style={s.stockTag}>
                <Text style={s.stockTagLabel}>STOK</Text>
                <Text style={s.stockTagValue}>{product.currentStock}</Text>
              </View>
            </View>

            <Text style={s.productName} numberOfLines={2}>{product.productName}</Text>
            <Text style={s.productBarcode}>Barkod: {product.barcode}</Text>

            <View style={s.divider} />

            {/* Miktar */}
            <Text style={s.quantityLabel}>Miktar Ekle / Çıkar</Text>
            <View style={s.quantityRow}>
              <TouchableOpacity
                style={s.qBtn}
                onPress={() => setQuantity(q => Math.max(1, q - 1))}
              >
                <Text style={s.qBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={s.qValue}>{quantity}</Text>
              <TouchableOpacity
                style={[s.qBtn, s.qBtnPlus]}
                onPress={() => setQuantity(q => q + 1)}
              >
                <Text style={[s.qBtnText, s.qBtnPlusText]}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Aksiyon Butonları */}
            <View style={s.actionRow}>
              <TouchableOpacity style={s.cancelBtn} onPress={handleCancel} disabled={saving}>
                <Text style={s.cancelBtnText}>İptal</Text>
              </TouchableOpacity>

              <View style={s.saveGroup}>
                <TouchableOpacity
                  style={[s.saveBtn, s.saveBtnOut]}
                  onPress={() => handleSave('Out')}
                  disabled={saving}
                >
                  {saving
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={s.saveBtnText}>Çıkış</Text>
                  }
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.saveBtn, s.saveBtnIn]}
                  onPress={() => handleSave('In')}
                  disabled={saving}
                >
                  {saving
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={s.saveBtnText}>Kaydet</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View style={s.emptyState}>
            {searching ? (
              <>
                <ActivityIndicator color="#4338CA" size="large" />
                <Text style={s.emptyText}>Barkod aranıyor...</Text>
              </>
            ) : (
              <>
                <Text style={s.emptyIcon}>⊟</Text>
                <Text style={s.emptyTitle}>Barkod tarayın ya da girin</Text>
                <Text style={s.emptyText}>
                  Yukarıdaki alana barkod numarası yazıp "Ara"ya basın.
                </Text>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Stiller ───────────────────────────────────────────────────────────────
const PRIMARY = '#4338CA';

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A' },

  // ── Kamera Alanı
  cameraArea: {
    flex: 1,
    backgroundColor: '#1a1f35',
    paddingBottom: 20,
  },
  camHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  camBtn: {
    width: 38, height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  camBtnIcon: { fontSize: 18, color: '#fff' },
  camTitle:   { fontSize: 17, fontWeight: '700', color: '#fff' },

  alignText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 16,
  },

  // Tarama çerçevesi
  scanFrame: {
    alignSelf: 'center',
    width: 220,
    height: 140,
    position: 'relative',
    marginBottom: 20,
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 28, height: 28,
    borderColor: '#fff',
  },
  cornerTL: { top: 0, left: 0,  borderTopWidth: 3, borderLeftWidth: 3,  borderTopLeftRadius: 6 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 6 },
  cornerBL: { bottom: 0, left: 0,  borderBottomWidth: 3, borderLeftWidth: 3,  borderBottomLeftRadius: 6 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 6 },
  scanLine: {
    position: 'absolute',
    left: 10, right: 10,
    height: 2,
    backgroundColor: PRIMARY,
    borderRadius: 2,
    shadowColor: PRIMARY,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },

  // Manuel giriş
  manualRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 10,
  },
  manualInput: {
    flex: 1,
    height: 46,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 14,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  manualSearchBtn: {
    width: 64, height: 46,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  manualSearchBtnText: { fontSize: 14, fontWeight: '700', color: PRIMARY },

  // ── Alt Panel
  bottomPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    maxHeight: '50%',
  },

  // Ürün başlığı
  productHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  productHeaderLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5 },
  stockTag:       { backgroundColor: '#1E293B', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignItems: 'center' },
  stockTagLabel:  { fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  stockTagValue:  { fontSize: 18, fontWeight: '800', color: '#fff', lineHeight: 22 },

  productName:    { fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  productBarcode: { fontSize: 13, color: '#94A3B8', marginBottom: 16 },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 16 },

  // Miktar
  quantityLabel: { fontSize: 13, fontWeight: '600', color: '#64748B', marginBottom: 12, textAlign: 'center' },
  quantityRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 20 },
  qBtn: {
    width: 44, height: 44, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center', justifyContent: 'center',
  },
  qBtnPlus:     { backgroundColor: PRIMARY, borderColor: PRIMARY },
  qBtnText:     { fontSize: 22, color: '#1E293B', lineHeight: 26 },
  qBtnPlusText: { color: '#fff' },
  qValue:       { fontSize: 28, fontWeight: '800', color: '#1E293B', minWidth: 48, textAlign: 'center' },

  // Aksiyon butonları
  actionRow:   { flexDirection: 'row', gap: 10, paddingBottom: 24 },
  cancelBtn: {
    flex: 1,
    height: 50, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E2E8F0',
    alignItems: 'center', justifyContent: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#64748B' },
  saveGroup:   { flex: 2, flexDirection: 'row', gap: 8 },
  saveBtn:     { flex: 1, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  saveBtnOut:  { backgroundColor: '#EF4444' },
  saveBtnIn:   { backgroundColor: PRIMARY },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  // Boş durum
  emptyState: { alignItems: 'center', paddingVertical: 32, gap: 10 },
  emptyIcon:  { fontSize: 48, color: '#CBD5E1' },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  emptyText:  { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },
});
