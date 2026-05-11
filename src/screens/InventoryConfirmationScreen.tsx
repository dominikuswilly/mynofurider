import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Package, AlertCircle, ArrowRight } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';

interface InventoryItem {
  product_id: string;
  product_name: string;
  amount_sell: string;
  qty_base: number;
  qty_current: number;
}

export default function InventoryConfirmationScreen({ route, navigation }: any) {
  const { items, accessToken, refreshToken } = route.params;
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Endpoint for confirmation - assuming private/inventory/confirm
      // Using axios directly or apiClient with temporary token if needed
      // But since we are not 'logged in' in the context yet, we use the token from params
      await apiClient.post('private/inventory/confirm', {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      // After successful confirmation, proceed to login
      await login(accessToken, refreshToken);
    } catch (error: any) {
      console.error('Confirmation error:', error);
      // Even if confirmation fails, we might want to let them login or show error
      Alert.alert(
        'Konfirmasi Gagal',
        error.response?.data?.message || 'Terjadi kesalahan saat mengonfirmasi inventaris.',
        [
          { text: 'Coba Lagi', style: 'default' },
          { text: 'Masuk Saja', onPress: () => login(accessToken, refreshToken) }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(parseInt(value));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Package size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Konfirmasi Inventaris</Text>
        <Text style={styles.subtitle}>
          Mohon periksa dan konfirmasi stok barang yang Anda bawa hari ini.
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.alertBox}>
          <AlertCircle size={20} color={COLORS.primary} />
          <Text style={styles.alertText}>
            Pastikan jumlah barang sesuai dengan fisik yang Anda terima.
          </Text>
        </View>

        {items.map((item: InventoryItem) => (
          <View key={item.product_id} style={styles.itemCard}>
            <View style={styles.itemMain}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.product_name}</Text>
                <Text style={styles.itemPrice}>{formatCurrency(item.amount_sell)}</Text>
              </View>
              <View style={styles.qtyBadge}>
                <Text style={styles.qtyLabel}>Stok</Text>
                <Text style={styles.qtyValue}>{item.qty_current}</Text>
              </View>
            </View>
            <View style={styles.itemFooter}>
              <Text style={styles.baseQty}>Stok Awal: {item.qty_base}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, loading && styles.disabledButton]}
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.black} />
          ) : (
            <>
              <Text style={styles.confirmButtonText}>Konfirmasi & Lanjutkan</Text>
              <Check size={20} color={COLORS.black} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.xl,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(198, 255, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(198, 255, 0, 0.05)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(198, 255, 0, 0.2)',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  alertText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  qtyBadge: {
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    minWidth: 60,
  },
  qtyLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  qtyValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  itemFooter: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  baseQty: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  disabledButton: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '800',
  },
});
