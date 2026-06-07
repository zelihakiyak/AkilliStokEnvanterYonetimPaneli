import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UrunDetay'>;
  route:      RouteProp<RootStackParamList, 'UrunDetay'>;
};

export default function UrunDetayScreen({ navigation, route }: Props) {
  const { isAdmin } = useAuth();
  const { product } = route.params;
  const [deleting, setDeleting] = useState(false);

  const isLow = product.currentStock <= product.criticalLimit;

  const handleDelete = () => {
    Alert.alert(
      'Ürünü Sil',
      `"${product.productName}" ürününü kalıcı olarak silmek istiyor musunuz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await apiClient.delete(`/Products/${product.id}`);
              Alert.alert('Başarılı', 'Ürün silindi.', [
                { text: 'Tamam', onPress: () => navigation.goBack() },
              ]);
            } catch {
              Alert.alert('Hata', 'Ürün silinemedi.');
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={s.headerIconBox}>
            <Text style={s.headerIcon}>📦</Text>
          </View>
          <Text style={s.headerTitle}>Ürün Detayı</Text>
          {isAdmin && (
            <TouchableOpacity
              style={s.editBtn}
              onPress={() => navigation.navigate('EditProduct', { product })}
            >
              <Text style={s.editIcon}>✎</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Status Badge */}
        {isLow && (
          <View style={s.alertBanner}>
            <Text style={s.alertBannerText}>⚠️  Bu ürünün stoğu kritik seviyenin altında!</Text>
          </View>
        )}

        {/* Ürün Başlık Kartı */}
        <View style={s.heroCard}>
          <View style={s.heroIconBox}>
            <Text style={s.heroIcon}>📦</Text>
          </View>
          <Text style={s.heroName}>{product.productName}</Text>
          <Text style={s.heroBarcode}>Barkod: {product.barcode}</Text>
          <View style={[s.stockBadge, isLow && s.stockBadgeLow]}>
            <Text style={[s.stockBadgeText, isLow && s.stockBadgeTextLow]}>
              {isLow ? '⚠️ Düşük Stok' : '✓ Normal Stok'}
            </Text>
          </View>
        </View>

        {/* Detay Bilgileri */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Stok Bilgileri</Text>
          <View style={s.card}>
            <DetailRow label="Mevcut Stok"    value={`${product.currentStock} Adet`} valueColor={isLow ? '#EF4444' : '#10B981'} />
            <DetailRow label="Kritik Limit"   value={`${product.criticalLimit} Adet`} />
            <DetailRow label="Birim Fiyat"    value={`${product.unitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`} />
            <DetailRow label="Toplam Değer"   value={`${(product.unitPrice * product.currentStock).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`} last />
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Ürün Bilgileri</Text>
          <View style={s.card}>
            <DetailRow label="Ürün ID"     value={`#${product.id}`} />
            <DetailRow label="Kategori ID" value={`#${product.categoryId}`} />
            <DetailRow label="Barkod"      value={product.barcode} last />
          </View>
        </View>

        {/* Stok Hareketi Butonu */}
        <View style={s.section}>
          <TouchableOpacity
            style={s.actionBtn}
            onPress={() => navigation.navigate('StokHareket', {
              barcode:     product.barcode,
              productName: product.productName,
            })}
            activeOpacity={0.85}
          >
            <Text style={s.actionBtnIcon}>🔄</Text>
            <Text style={s.actionBtnText}>Stok Hareketi Ekle</Text>
          </TouchableOpacity>
        </View>

        {/* Admin: Silme Butonu */}
        {isAdmin && (
          <View style={[s.section, { marginBottom: 40 }]}>
            <TouchableOpacity
              style={s.deleteBtn}
              onPress={handleDelete}
              disabled={deleting}
              activeOpacity={0.85}
            >
              {deleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={s.deleteBtnIcon}>🗑</Text>
                  <Text style={s.deleteBtnText}>Ürünü Sil</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Tab Bar */}
      <View style={s.tabBar}>
        {(['Panel', 'Envanter', 'SCAN', 'Raporlar', 'Ayarlar'] as const).map(key => {
          const isScan = key === 'SCAN';
          const ICONS: Record<string, string>  = { Panel: '🏠︎', Envanter: '📦', SCAN: '🀫', Raporlar: '📊', Ayarlar: '⚙️' };
          const LABELS: Record<string, string> = { Panel: 'Panel', Envanter: 'Envanter', SCAN: 'Tara', Raporlar: 'Raporlar', Ayarlar: 'Ayarlar' };
          if (isScan) {
            return (
              <TouchableOpacity key={key} style={s.scanBtn} onPress={() => navigation.navigate('BarkodTara')} activeOpacity={0.85}>
                <Text style={s.scanIcon}>🀫</Text>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              key={key}
              style={s.tabItem}
              onPress={() => {
                if (key === 'Panel')     navigation.navigate('Home',        {} as any);
                if (key === 'Envanter')  navigation.navigate('UrunListesi');
                if (key === 'Raporlar')  navigation.navigate('Raporlar');
                if (key === 'Ayarlar')   navigation.navigate('Ayarlar');
              }}
              activeOpacity={0.7}
            >
              <Text style={s.tabIcon}>{ICONS[key]}</Text>
              <Text style={s.tabLabel}>{LABELS[key]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function DetailRow({
  label, value, valueColor, last,
}: {
  label: string; value: string; valueColor?: string; last?: boolean;
}) {
  return (
    <View style={[dr.row, !last && dr.border]}>
      <Text style={dr.label}>{label}</Text>
      <Text style={[dr.value, valueColor ? { color: valueColor } : undefined]}>{value}</Text>
    </View>
  );
}
const dr = StyleSheet.create({
  row:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  border: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  label:  { fontSize: 14, color: '#64748B' },
  value:  { fontSize: 14, fontWeight: '600', color: '#1E293B' },
});

const PRIMARY = '#4338CA';
const BG      = '#F5F6FA';
const WHITE   = '#FFFFFF';

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: BG },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, paddingTop: 52, paddingBottom: 16, paddingHorizontal: 20, gap: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  backBtn:      { padding: 4 },
  backIcon:     { fontSize: 22, color: '#1E293B' },
  headerIconBox:{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#E0E4FF', alignItems: 'center', justifyContent: 'center' },
  headerIcon:   { fontSize: 18 },
  headerTitle:  { flex: 1, fontSize: 18, fontWeight: '700', color: '#1E293B' },
  editBtn:      { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E0E4FF', alignItems: 'center', justifyContent: 'center' },
  editIcon:     { fontSize: 18, color: PRIMARY },
  alertBanner:  { backgroundColor: '#FEF2F2', paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#FECACA' },
  alertBannerText: { fontSize: 13, color: '#EF4444', fontWeight: '600' },
  heroCard:     { backgroundColor: WHITE, margin: 16, borderRadius: 20, padding: 24, alignItems: 'center', gap: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 10, elevation: 3 },
  heroIconBox:  { width: 70, height: 70, borderRadius: 20, backgroundColor: '#E0E4FF', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  heroIcon:     { fontSize: 36 },
  heroName:     { fontSize: 20, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  heroBarcode:  { fontSize: 13, color: '#94A3B8' },
  stockBadge:       { marginTop: 4, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: '#D1FAE5' },
  stockBadgeLow:    { backgroundColor: '#FEE2E2' },
  stockBadgeText:   { fontSize: 13, fontWeight: '600', color: '#10B981' },
  stockBadgeTextLow:{ color: '#EF4444' },
  section:      { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 10 },
  card:         { backgroundColor: WHITE, borderRadius: 16, paddingHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2 },
  actionBtn:    { backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  actionBtnIcon:{ fontSize: 18 },
  actionBtnText:{ fontSize: 16, fontWeight: '700', color: WHITE },
  deleteBtn:    { backgroundColor: '#EF4444', borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  deleteBtnIcon:{ fontSize: 18 },
  deleteBtnText:{ fontSize: 16, fontWeight: '700', color: WHITE },
  tabBar:         { flexDirection: 'row', backgroundColor: WHITE, borderTopWidth: 1, borderTopColor: '#E2E8F0', height: 70, alignItems: 'center', paddingHorizontal: 8, paddingBottom: 8 },
  tabItem:        { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  tabIcon:        { fontSize: 20, color: '#94A3B8' },
  tabLabel:       { fontSize: 10, color: '#94A3B8' },
  scanBtn:        { width: 58, height: 58, borderRadius: 29, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', marginTop: -24, shadowColor: PRIMARY, shadowOpacity: 0.45, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 8 },
  scanIcon:       { fontSize: 26, color: WHITE },
});
