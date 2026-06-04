import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, ScrollView, Platform, KeyboardAvoidingView,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ProductType } from '../../App';
import apiClient from '../api/apiClient';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'BarkodTara'>;
};

type TxType = 'In' | 'Out';

export default function BarkodTaraScreen({ navigation }: Props) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned,   setScanned]   = useState(false);
  const [product,   setProduct]   = useState<ProductType | null>(null);
  const [searching, setSearching] = useState(false);
  const [quantity,  setQuantity]  = useState(1);
  const [txType,    setTxType]    = useState<TxType>('In');
  const [saving,    setSaving]    = useState(false);
  const [torchOn,   setTorchOn]   = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // ── Barkod Algılandı ─────────────────────────────────────────────────────
  const handleBarCodeScanned = useCallback(({ data }: { data: string }) => {
    if (scanned || searching) return;
    setScanned(true);
    handleSearch(data);
  }, [scanned, searching]);

  // ── Ürün Sorgula ─────────────────────────────────────────────────────────
  const handleSearch = useCallback(async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setSearching(true);
    setProduct(null);
    setQuantity(1);
    setTxType('In');
    try {
      const res = await apiClient.get<ProductType>(`/Products/barcode/${trimmed}`);
      setProduct(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        navigation.navigate('AddProduct', { barcode: trimmed });
        setScanned(false);
      } else {
        Alert.alert('Hata', 'Sunucuya bağlanılamadı.');
        setScanned(false);
      }
    } finally {
      setSearching(false);
    }
  }, [navigation]);

  // ── Kaydet ───────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!product) return;
    if (quantity <= 0) { Alert.alert('Uyarı', "Miktar 0'dan büyük olmalı."); return; }
    if (txType === 'Out' && quantity > product.currentStock) {
      Alert.alert('Uyarı', `Stokta yalnızca ${product.currentStock} adet var.`);
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
      const newStock = res.data?.newStock ?? product.currentStock + payload.quantityChanged;
      Alert.alert(
        '✅ Başarılı',
        `Stok güncellendi.\nYeni stok: ${newStock} adet`,
        [{ text: 'Tamam', onPress: handleReset }],
      );
    } catch {
      Alert.alert('Hata', 'Stok kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  }, [product, quantity, txType]);

  const handleReset = () => {
    setProduct(null);
    setQuantity(1);
    setTxType('In');
    setScanned(false);
  };

  // ── İzin ─────────────────────────────────────────────────────────────────
  if (hasPermission === null) {
    return <View style={s.center}><ActivityIndicator color={PRIMARY} size="large" /></View>;
  }
  if (hasPermission === false) {
    return (
      <View style={s.center}>
        <Text style={s.permText}>Kamera izni gereklidir.</Text>
        <TouchableOpacity style={s.permBtn} onPress={async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
        }}>
          <Text style={s.permBtnText}>İzin Ver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      {/* ── Kamera Alanı ─────────────────────────────── */}
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

        <Text style={s.alignText}>Barkodu hizalayın...</Text>

        {/* Kamera */}
        <View style={s.cameraWrapper}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            enableTorch={torchOn}
            barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'qr', 'code128', 'code39'] }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
          <View style={s.scanFrame} pointerEvents="none">
            <View style={[s.corner, s.cornerTL]} />
            <View style={[s.corner, s.cornerTR]} />
            <View style={[s.corner, s.cornerBL]} />
            <View style={[s.corner, s.cornerBR]} />
          </View>
          {searching && (
            <View style={s.scanningOverlay}>
              <ActivityIndicator color="#fff" size="large" />
              <Text style={s.scanningText}>Aranıyor...</Text>
            </View>
          )}
        </View>

        {scanned && !searching && !product && (
          <TouchableOpacity style={s.rescanBtn} onPress={handleReset}>
            <Text style={s.rescanText}>🔄  Tekrar Tara</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Alt Panel ────────────────────────────────── */}
      <ScrollView style={s.bottomPanel} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {product ? (
          <>
            {/* Ürün başlık */}
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

            {/* Giriş / Çıkış toggle */}
            <View style={s.toggle}>
              <TouchableOpacity
                style={[s.toggleBtn, txType === 'In' && s.toggleBtnIn]}
                onPress={() => setTxType('In')}
              >
                <Text style={[s.toggleBtnText, txType === 'In' && s.toggleBtnTextActive]}>Giriş</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.toggleBtn, txType === 'Out' && s.toggleBtnOut]}
                onPress={() => setTxType('Out')}
              >
                <Text style={[s.toggleBtnText, txType === 'Out' && s.toggleBtnTextActive]}>Çıkış</Text>
              </TouchableOpacity>
            </View>

            {/* Miktar */}
            <Text style={s.quantityLabel}>Miktar Ekle / Çıkar</Text>
            <View style={s.quantityRow}>
              <TouchableOpacity style={s.qBtn} onPress={() => setQuantity(q => Math.max(1, q - 1))}>
                <Text style={s.qBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={s.qValue}>{quantity}</Text>
              <TouchableOpacity style={[s.qBtn, s.qBtnPlus]} onPress={() => setQuantity(q => q + 1)}>
                <Text style={[s.qBtnText, s.qBtnPlusText]}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Aksiyon */}
            <View style={s.actionRow}>
              <TouchableOpacity style={s.cancelBtn} onPress={handleReset} disabled={saving}>
                <Text style={s.cancelBtnText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={handleSave} disabled={saving}>
                {saving
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={s.saveBtnText}>Kaydet</Text>
                }
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={s.emptyState}>
            {searching ? (
              <>
                <ActivityIndicator color={PRIMARY} size="large" />
                <Text style={s.emptyText}>Barkod aranıyor...</Text>
              </>
            ) : (
              <>
                <Text style={s.emptyIcon}>📷</Text>
                <Text style={s.emptyTitle}>Kamera hazır</Text>
                <Text style={s.emptyText}>Barkodu kameraya gösterin, otomatik taranır.</Text>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const PRIMARY = '#4338CA';

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#0F172A' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F172A', gap: 16 },
  permText:    { color: '#fff', fontSize: 15, textAlign: 'center', marginHorizontal: 32 },
  permBtn:     { backgroundColor: PRIMARY, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12 },
  permBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  cameraArea:  { flex: 1, backgroundColor: '#0F172A', paddingBottom: 16 },
  camHeader:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 52, paddingHorizontal: 20, paddingBottom: 10 },
  camBtn:      { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  camBtnIcon:  { fontSize: 18, color: '#fff' },
  camTitle:    { fontSize: 17, fontWeight: '700', color: '#fff' },
  alignText:   { textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 12 },

  cameraWrapper: { alignSelf: 'center', width: 260, height: 160, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  scanFrame:     { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  corner:        { position: 'absolute', width: 28, height: 28, borderColor: '#fff' },
  cornerTL:      { top: 0,    left: 0,   borderTopWidth: 3,    borderLeftWidth: 3,  borderTopLeftRadius: 6 },
  cornerTR:      { top: 0,    right: 0,  borderTopWidth: 3,    borderRightWidth: 3, borderTopRightRadius: 6 },
  cornerBL:      { bottom: 0, left: 0,   borderBottomWidth: 3, borderLeftWidth: 3,  borderBottomLeftRadius: 6 },
  cornerBR:      { bottom: 0, right: 0,  borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 6 },
  scanningOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', gap: 8 },
  scanningText:    { color: '#fff', fontSize: 13, fontWeight: '600' },
  rescanBtn:       { alignSelf: 'center', marginTop: 14, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  rescanText:      { color: '#fff', fontSize: 13, fontWeight: '600' },

  bottomPanel:    { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingTop: 20, maxHeight: '55%' },

  productHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  productHeaderLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5 },
  stockTag:           { backgroundColor: '#1E293B', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignItems: 'center' },
  stockTagLabel:      { fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  stockTagValue:      { fontSize: 18, fontWeight: '800', color: '#fff', lineHeight: 22 },
  productName:        { fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  productBarcode:     { fontSize: 13, color: '#94A3B8', marginBottom: 12 },
  divider:            { height: 1, backgroundColor: '#F1F5F9', marginBottom: 14 },

  toggle:            { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4, marginBottom: 14 },
  toggleBtn:         { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center' },
  toggleBtnIn:       { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
  toggleBtnOut:      { backgroundColor: '#FEE2E2' },
  toggleBtnText:     { fontSize: 13, fontWeight: '600', color: '#94A3B8' },
  toggleBtnTextActive:{ color: '#1E293B' },

  quantityLabel: { fontSize: 13, fontWeight: '600', color: '#64748B', marginBottom: 10, textAlign: 'center' },
  quantityRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 18 },
  qBtn:          { width: 44, height: 44, borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  qBtnPlus:      { backgroundColor: PRIMARY, borderColor: PRIMARY },
  qBtnText:      { fontSize: 22, color: '#1E293B', lineHeight: 26 },
  qBtnPlusText:  { color: '#fff' },
  qValue:        { fontSize: 32, fontWeight: '800', color: '#1E293B', minWidth: 52, textAlign: 'center' },

  actionRow:     { flexDirection: 'row', gap: 10, paddingBottom: 24 },
  cancelBtn:     { flex: 1, height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#64748B' },
  saveBtn:       { flex: 2, height: 50, borderRadius: 14, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', shadowColor: PRIMARY, shadowOpacity: 0.35, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 5 },
  saveBtnText:   { fontSize: 15, fontWeight: '700', color: '#fff' },

  emptyState: { alignItems: 'center', paddingVertical: 28, gap: 10 },
  emptyIcon:  { fontSize: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  emptyText:  { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },
});
