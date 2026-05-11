import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Package, AlertCircle, X, ArrowLeft } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

interface InventoryItem {
  product_id: string;
  product_name: string;
  amount_sell: string;
  qty_base: number;
  qty_current: number;
}

export default function InventoryConfirmationScreen({ route, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { items, accessToken, refreshToken } = route.params;
  const { login } = useAuth();
  const [itemStatuses, setItemStatuses] = useState<Record<string, 'accepted' | 'rejected'>>(
    items.reduce((acc: any, item: InventoryItem) => ({ ...acc, [item.product_id]: 'accepted' }), {})
  );

  const toggleStatus = (productId: string, status: 'accepted' | 'rejected') => {
    setItemStatuses(prev => ({
      ...prev,
      [productId]: status
    }));
  };


  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(parseInt(value));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerBar, { paddingTop: insets.top }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Konfirmasi Stok</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Package size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Konfirmasi Inventaris</Text>
          <Text style={styles.subtitle}>
            Mohon periksa dan konfirmasi stok barang yang Anda bawa hari ini.
          </Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.alertBox}>
            <AlertCircle size={20} color={COLORS.primary} />
            <Text style={styles.alertText}>
              Pastikan jumlah barang sesuai dengan fisik yang Anda terima.
            </Text>
          </View>

          {items.map((item: InventoryItem) => (
            <View 
              key={item.product_id} 
              style={[
                styles.itemCard,
                itemStatuses[item.product_id] === 'rejected' && styles.itemCardRejected
              ]}
            >
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
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.rejectButton,
                      itemStatuses[item.product_id] === 'rejected' && styles.rejectButtonActive
                    ]}
                    onPress={() => toggleStatus(item.product_id, 'rejected')}
                  >
                    <X size={16} color={itemStatuses[item.product_id] === 'rejected' ? COLORS.white : COLORS.error} />
                    <Text style={[
                      styles.actionButtonText,
                      itemStatuses[item.product_id] === 'rejected' && styles.actionButtonTextActive
                    ]}>Tolak</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      styles.acceptButton,
                      itemStatuses[item.product_id] === 'accepted' && styles.acceptButtonActive
                    ]}
                    onPress={() => toggleStatus(item.product_id, 'accepted')}
                  >
                    <Check size={16} color={itemStatuses[item.product_id] === 'accepted' ? COLORS.black : COLORS.primary} />
                    <Text style={[
                      styles.actionButtonText,
                      styles.acceptButtonText,
                      itemStatuses[item.product_id] === 'accepted' && styles.acceptButtonTextActive
                    ]}>Terima</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
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
    flexGrow: 1,
  },
  mainContent: {
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
  itemCardRejected: {
    borderColor: COLORS.error,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  rejectButton: {
    borderColor: COLORS.error,
    backgroundColor: 'transparent',
  },
  rejectButtonActive: {
    backgroundColor: COLORS.error,
  },
  acceptButton: {
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  acceptButtonActive: {
    backgroundColor: COLORS.primary,
  },
  actionButtonTextActive: {
    color: COLORS.white,
  },
  acceptButtonText: {
    color: COLORS.primary,
  },
  acceptButtonTextActive: {
    color: COLORS.black,
  },
});
