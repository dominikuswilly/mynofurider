import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { CreditCard, Banknote, Check, Plus, Minus, Camera, Send, Coffee, Package, Bean } from 'lucide-react-native';
import apiClient from '../api/client';

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  request: string;
  icon: any;
}

const getProductIcon = (name: string) => {
  const lowercase = name.toLowerCase();
  if (lowercase.includes('bean')) return Bean;
  if (lowercase.includes('cup') || lowercase.includes('paper')) return Package;
  return Coffee;
};

export default function InventoryScreen() {
  const [activeTab, setActiveTab] = useState<'request' | 'report'>('request');
  const [requestItems, setRequestItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const fetchInventory = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const response = await apiClient.get('private/inventories');
      if (response.data && response.data.status === 'success') {
        const liveItems = response.data.data.map((item: any) => ({
          id: item.product_id,
          name: item.product_name,
          stock: item.qty_current,
          request: '0',
          icon: getProductIcon(item.product_name),
        }));
        setRequestItems(liveItems);
      }
    } catch (error: any) {
      console.error('Fetch inventories error:', error);
      Alert.alert('Gagal', 'Terjadi kesalahan saat memuat data inventaris');
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const updateRequest = (id: string, delta: number) => {
    setRequestItems(prev => prev.map(item => {
      if (item.id === id) {
        const newVal = Math.max(0, parseInt(item.request || '0') + delta);
        return { ...item, request: newVal.toString() };
      }
      return item;
    }));
  };

  const handleManualInput = (id: string, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    setRequestItems(prev => prev.map(item => 
      item.id === id ? { ...item, request: cleanValue } : item
    ));
  };

  const handleSubmit = async () => {
    const itemsToRequest = requestItems.filter(item => parseInt(item.request) > 0);
    
    if (itemsToRequest.length === 0) {
      Alert.alert('Peringatan', 'Harap isi jumlah permintaan stok terlebih dahulu.');
      return;
    }

    setRefreshing(true);
    try {
      const payload = {
        items: itemsToRequest.map(item => ({
          product_id: item.id,
          quantity: parseInt(item.request)
        }))
      };

      await apiClient.post('private/inventory/restock', payload);
      
      Alert.alert('Sukses', 'Permintaan stok berhasil dikirim!');
      setRequestItems(prev => prev.map(item => ({ ...item, request: '0' })));
      await fetchInventory(true);
    } catch (error: any) {
      Alert.alert('Gagal', error.response?.data?.message || error.message || 'Terjadi kesalahan saat mengirim permintaan');
    } finally {
      setRefreshing(false);
      setShowReview(false);
    }
  };

  const itemsToRequest = requestItems.filter(item => parseInt(item.request) > 0);

  if (loading && requestItems.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} testID="inventory-safe-area" edges={['left', 'right']}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'request' && styles.tabActive]}
          onPress={() => setActiveTab('request')}
        >
          <Text style={[styles.tabText, activeTab === 'request' && styles.tabTextActive]}>
            Permintaan Stok
          </Text>
          {activeTab === 'request' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'report' && styles.tabActive]}
          onPress={() => setActiveTab('report')}
        >
          <Text style={[styles.tabText, activeTab === 'report' && styles.tabTextActive]}>
            Lapor Kerusakan
          </Text>
          {activeTab === 'report' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'request' ? (
          <RequestStockView 
            items={requestItems} 
            updateRequest={updateRequest} 
            handleManualInput={handleManualInput} 
          />
        ) : (
          <ReportDamageView items={requestItems} fetchInventory={fetchInventory} />
        )}
      </ScrollView>

      {/* FIXED FAB POSITION AT THE BOTTOM RIGHT */}
      {activeTab === 'request' && (
        <TouchableOpacity 
          style={[styles.submitFab, refreshing && styles.submitFabDisabled]} 
          onPress={() => {
            if (itemsToRequest.length === 0) {
              Alert.alert('Peringatan', 'Harap isi jumlah permintaan stok terlebih dahulu.');
            } else {
              setShowReview(true);
            }
          }}
          disabled={refreshing}
        >
          {refreshing ? (
            <ActivityIndicator color={COLORS.black} />
          ) : (
            <Send size={28} color={COLORS.black} />
          )}
        </TouchableOpacity>
      )}

      {/* RESTOCK REVIEW MODAL */}
      <Modal
        visible={showReview}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewTitle}>Tinjau Permintaan</Text>
            
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.reviewItemsContainer}>
                {itemsToRequest.map((item) => (
                  <View key={item.id} style={styles.reviewItem}>
                    <View style={styles.reviewItemLeft}>
                      <Text style={styles.reviewItemName}>{item.name}</Text>
                      <Text style={styles.reviewItemStock}>Stok Saat Ini: {item.stock}</Text>
                    </View>
                    <View style={styles.reviewItemRight}>
                      <Text style={styles.reviewItemQty}>+{item.request}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.reviewFooter}>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Total Item</Text>
                  <Text style={styles.reviewValue}>{itemsToRequest.length} Produk</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Status</Text>
                  <Text style={styles.reviewValueStatus}>MENUNGGU PERSETUJUAN</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.reviewActions}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setShowReview(false)}
                disabled={refreshing}
              >
                <Text style={styles.secondaryButtonText}>UBAH</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleSubmit}
                disabled={refreshing}
              >
                {refreshing ? (
                  <ActivityIndicator color={COLORS.black} />
                ) : (
                  <Text style={styles.primaryButtonText}>KIRIM PERMINTAAN</Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={{ height: 32 }} /> 
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const RequestStockView = ({ items, updateRequest, handleManualInput }: any) => {
  const getStockColor = (stock: number) => {
    if (stock === 0) return COLORS.error;
    if (stock < 10) return COLORS.primary;
    return COLORS.textSecondary;
  };

  if (items.length === 0) {
    return (
      <View style={{ padding: SPACING.xl, alignItems: 'center' }}>
        <Text style={{ color: COLORS.textSecondary, fontWeight: '700' }}>Tidak ada produk tersedia</Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      {items.map((item: any) => (
        <View key={item.id} style={styles.inventoryCard}>
          <View style={styles.itemHeader}>
            <View style={styles.iconContainer}>
              <item.icon size={20} color={COLORS.primary} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={[styles.itemStock, { color: getStockColor(item.stock) }]}>
                Stok: {item.stock} unit
              </Text>
            </View>
          </View>
          
          <View style={styles.requestAction}>
            <TouchableOpacity 
              style={styles.stepperButton}
              onPress={() => updateRequest(item.id, -1)}
            >
              <Minus size={18} color={COLORS.black} />
            </TouchableOpacity>
            <TextInput
              style={styles.requestInput}
              value={item.request}
              onChangeText={(text) => handleManualInput(item.id, text)}
              keyboardType="numeric"
              selectTextOnFocus
            />
            <TouchableOpacity 
              style={styles.stepperButton}
              onPress={() => updateRequest(item.id, 1)}
            >
              <Plus size={18} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const ReportDamageView = ({ items, fetchInventory }: { items: InventoryItem[], fetchInventory: (isSilent?: boolean) => Promise<void> }) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [damageQty, setDamageQty] = useState(1);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitDamage = async () => {
    if (!selectedItemId) {
      Alert.alert('Peringatan', 'Harap pilih produk yang rusak terlebih dahulu.');
      return;
    }

    if (!reason.trim()) {
      Alert.alert('Peringatan', 'Harap isi keterangan/alasan kerusakan.');
      return;
    }

    const selectedItem = items.find(item => item.id === selectedItemId);
    if (!selectedItem) return;

    if (selectedItem.stock === 0) {
      Alert.alert('Peringatan', 'Stok produk ini kosong. Tidak dapat melaporkan kerusakan.');
      return;
    }

    if (damageQty > selectedItem.stock) {
      Alert.alert('Peringatan', `Jumlah kerusakan (${damageQty}) tidak boleh melebihi stok yang tersedia (${selectedItem.stock} unit).`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        product_id: selectedItemId,
        quantity: damageQty,
        reason: reason.trim(),
      };

      await apiClient.post('private/transaction/waste', payload);

      Alert.alert('Sukses', 'Laporan kerusakan berhasil dikirim!');
      setSelectedItemId(null);
      setDamageQty(1);
      setReason('');
      await fetchInventory(true);
    } catch (error: any) {
      Alert.alert('Gagal', error.response?.data?.message || error.message || 'Terjadi kesalahan saat mengirim laporan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.formLabel}>Pilih Item yang Rusak</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.itemPickerScroll}>
        {items.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[
              styles.pickerItem,
              selectedItemId === item.id && styles.pickerItemActive
            ]}
            onPress={() => setSelectedItemId(item.id)}
          >
            <View style={[
              styles.pickerIconContainer,
              selectedItemId === item.id && styles.pickerIconContainerActive
            ]}>
              <item.icon size={20} color={selectedItemId === item.id ? COLORS.black : COLORS.primary} />
            </View>
            <Text style={[
              styles.pickerItemName,
              selectedItemId === item.id && styles.pickerItemNameActive
            ]} numberOfLines={1}>
              {item.name.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.qtySection}>
        <Text style={styles.formLabel}>Jumlah Kerusakan</Text>
        <View style={styles.damageStepper}>
          <TouchableOpacity 
            style={styles.damageStepperBtn}
            onPress={() => setDamageQty(prev => Math.max(1, prev - 1))}
          >
            <Minus size={20} color={COLORS.black} />
          </TouchableOpacity>
          <Text style={styles.damageQtyText}>{damageQty}</Text>
          <TouchableOpacity 
            style={styles.damageStepperBtn}
            onPress={() => setDamageQty(prev => prev + 1)}
          >
            <Plus size={20} color={COLORS.black} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.formLabel}>Keterangan Kerusakan</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Jelaskan detail kerusakan (misal: pecah, tumpah di jalan)..."
        placeholderTextColor={COLORS.textSecondary}
        multiline
        numberOfLines={4}
        value={reason}
        onChangeText={setReason}
      />

      <TouchableOpacity style={styles.photoButton} onPress={() => Alert.alert('Info', 'Fitur ambil foto akan segera hadir!')}>
        <Camera size={24} color={COLORS.primary} />
        <Text style={styles.photoButtonText}>Ambil Foto Bukti</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.submitButton, submitting && { opacity: 0.6 }]} 
        onPress={handleSubmitDamage}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color={COLORS.black} />
        ) : (
          <Text style={styles.submitButtonText}>Kirim Laporan</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    position: 'relative',
  },
  tabActive: {},
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '40%',
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: 100, // Extra space for FAB
  },
  section: {
    gap: SPACING.md,
  },
  inventoryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(198, 255, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
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
  itemStock: {
    fontSize: 12,
    fontWeight: '700',
  },
  requestAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
    gap: 8,
  },
  stepperButton: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestInput: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    padding: 0,
  },
  submitFab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 999, // Ensure it's on top
  },
  submitFabDisabled: {
    opacity: 0.6,
    backgroundColor: COLORS.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  reviewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    maxHeight: '80%',
  },
  reviewTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
    letterSpacing: 1,
  },
  modalScroll: {
    marginBottom: SPACING.lg,
  },
  reviewItemsContainer: {
    marginBottom: SPACING.lg,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  reviewItemLeft: {
    flex: 1,
  },
  reviewItemName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  reviewItemStock: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  reviewItemRight: {
    backgroundColor: 'rgba(198, 255, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reviewItemQty: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
  },
  reviewFooter: {
    backgroundColor: COLORS.surfaceSecondary,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  reviewValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '900',
  },
  reviewValueStatus: {
    fontSize: 12,
    color: '#FBBF24',
    fontWeight: '900',
  },
  reviewActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  secondaryButton: {
    flex: 1,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceSecondary,
  },
  secondaryButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  primaryButton: {
    flex: 2,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  form: {
    marginTop: SPACING.sm,
    gap: SPACING.md,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pickerButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  pickerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  textArea: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    color: COLORS.text,
    fontSize: 14,
    height: 120,
    textAlignVertical: 'top',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(198, 255, 0, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    gap: 12,
  },
  photoButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  submitButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  itemPickerScroll: {
    marginBottom: SPACING.md,
  },
  pickerItem: {
    width: 80,
    alignItems: 'center',
    marginRight: SPACING.md,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pickerItemActive: {
    backgroundColor: 'rgba(198, 255, 0, 0.1)',
    borderColor: COLORS.primary,
  },
  pickerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(198, 255, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  pickerIconContainerActive: {
    backgroundColor: COLORS.primary,
  },
  pickerItemName: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  pickerItemNameActive: {
    color: COLORS.text,
  },
  qtySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  damageStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
    gap: 12,
  },
  damageStepperBtn: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  damageQtyText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    minWidth: 30,
    textAlign: 'center',
  },
});
