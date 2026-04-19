import React, { useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import apiClient from '../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Product = {
    id: number;
    barcode: string;
    productName: string;
    unitPrice: number;
    currentStock: number;
    criticalLimit: number;
    categoryId: number;
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Products'>;
};

export default function ProductsScreen({ navigation }: Props) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading,  setLoading]  = useState(true);

const fetchProducts = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('TOKEN:', token); // ← ekle

        const response = await apiClient.get('/Products');
        setProducts(response.data);
    } catch (error: any) {
        console.log('HATA:', error.response?.status, error.response?.data);
        Alert.alert('Hata', 'Ürünler yüklenemedi.');
    } finally {
        setLoading(false);
    }
};

    // Ekrana her dönüldüğünde listeyi yenile
    useFocusEffect(
        React.useCallback(() => {
            fetchProducts();
        }, [])
    );

    const handleDelete = (id: number) => {
        Alert.alert(
            'Ürünü Sil',
            'Bu ürünü silmek istediğinize emin misiniz?',
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await apiClient.delete(`/Products/${id}`);
                            setProducts(prev => prev.filter(p => p.id !== id));
                        } catch {
                            Alert.alert('Hata', 'Ürün silinemedi.');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: Product }) => (
        <View style={[
            styles.card,
            item.currentStock <= item.criticalLimit && styles.cardCritical
        ]}>
            <View style={styles.cardLeft}>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.barcode}>Barkod: {item.barcode}</Text>
                <Text style={styles.price}>{item.unitPrice.toFixed(2)} ₺</Text>
            </View>
            <View style={styles.cardRight}>
                <View style={[
                    styles.stockBadge,
                    item.currentStock <= item.criticalLimit && styles.stockBadgeCritical
                ]}>
                    <Text style={styles.stockText}>{item.currentStock}</Text>
                    <Text style={styles.stockLabel}>adet</Text>
                </View>
                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item.id)}
                >
                    <Text style={styles.deleteBtnText}>Sil</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => navigation.navigate('EditProduct', { product: item })}
                >
                    <Text style={styles.editBtnText}>Düzenle</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#4F46E5" />
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>← Geri</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Ürünler</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddProduct')}>
                    <Text style={styles.addBtn}>+ Ekle</Text>
                </TouchableOpacity>
            </View>

            {/* Kritik stok uyarısı */}
            {products.some(p => p.currentStock <= p.criticalLimit) && (
                <View style={styles.warningBanner}>
                    <Text style={styles.warningText}>
                        ⚠️ Kritik stok seviyesinde ürünler var!
                    </Text>
                </View>
            )}

            <FlatList
                data={products}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Henüz ürün eklenmemiş.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container:     { flex: 1, backgroundColor: '#F3F4F6' },
    center:        { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        backgroundColor: '#4F46E5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 52,
        paddingBottom: 16,
    },
    backBtn:       { color: '#C7D2FE', fontSize: 15 },
    title:         { color: '#fff', fontSize: 18, fontWeight: '700' },
    addBtn:        { color: '#fff', fontSize: 15, fontWeight: '600' },
    warningBanner: {
        backgroundColor: '#FEF3C7',
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#FCD34D',
    },
    warningText:   { color: '#92400E', fontSize: 13, fontWeight: '500' },
    list:          { padding: 16, gap: 10 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
    },
    cardCritical:  { borderLeftWidth: 4, borderLeftColor: '#EF4444' },
    cardLeft:      { flex: 1 },
    productName:   { fontSize: 15, fontWeight: '600', color: '#111827' },
    barcode:       { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
    price:         { fontSize: 14, color: '#4F46E5', marginTop: 4, fontWeight: '500' },
    cardRight:     { alignItems: 'center', gap: 8 },
    stockBadge: {
        backgroundColor: '#ECFDF5',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        alignItems: 'center',
    },
    stockBadgeCritical: { backgroundColor: '#FEF2F2' },
    stockText:     { fontSize: 18, fontWeight: '700', color: '#059669' },
    stockLabel:    { fontSize: 10, color: '#6B7280' },
    deleteBtn: {
        backgroundColor: '#FEE2E2',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    deleteBtnText: { color: '#EF4444', fontSize: 12, fontWeight: '600' },
    emptyText:     { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
    editBtn: {
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    },
    editBtnText: { color: '#4F46E5', fontSize: 12, fontWeight: '600' },
});