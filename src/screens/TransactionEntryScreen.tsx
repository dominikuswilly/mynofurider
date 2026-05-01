import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { CreditCard, Banknote, Check, Plus, Minus } from 'lucide-react-native';
import apiClient from '../api/client';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}



export default function TransactionEntryScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  const [activeProducts, setActiveProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productRegistry, setProductRegistry] = useState<Record<string, Product>>({});
  
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
  const [loading, setLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeCategory) {
      fetchProducts(activeCategory);
    }
  }, [activeCategory]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('private/inventory/categories');
      if (response.data && response.data.status === 'success') {
        // Save new access token if provided
        if (response.data.access_token) {
          const refreshToken = await storage.getRefreshToken();
          await storage.saveTokens(response.data.access_token, refreshToken || '');
        }

        const catNames = response.data.data.map((c: any) => c.name);
        setCategories(catNames);
        if (catNames.length > 0) {
          setActiveCategory(catNames[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('Error', 'Gagal memuat kategori produk');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchProducts = async (category: string) => {
    setProductsLoading(true);
    try {
      const response = await apiClient.get(`private/inventories/${category}`);
      if (response.data && response.data.status === 'success') {
        // Save new access token if provided
        if (response.data.access_token) {
          const refreshToken = await storage.getRefreshToken();
          await storage.saveTokens(response.data.access_token, refreshToken || '');
        }

        const rawData = response.data.data || [];
        const products = rawData.map((p: any) => ({
          id: p.product_id,
          name: p.product_name,
          price: parseFloat(p.amount_sell) || 0,
          category: category
        }));

        setActiveProducts(products);
        
        // Update registry to resolve cart items later
        setProductRegistry(prev => {
          const newRegistry = { ...prev };
          products.forEach((p: Product) => {
            newRegistry[p.id] = p;
          });
          return newRegistry;
        });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Gagal memuat produk');
    } finally {
      setProductsLoading(false);
    }
  };

  const updateCart = (productId: string, delta: number) => {
    setCart(prev => {
      const currentQty = prev[productId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      const newCart = { ...prev };
      if (newQty === 0) {
        delete newCart[productId];
      } else {
        newCart[productId] = newQty;
      }
      return newCart;
    });
  };

  const totalAmount = Object.keys(cart).reduce((total, id) => {
    const product = productRegistry[id];
    const qty = cart[id] || 0;
    const price = product?.price || 0;
    return total + (price * qty);
  }, 0);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const payload = {
        total_amount: totalAmount,
        payment_method: paymentMethod,
        items: Object.keys(cart).map(id => {
          const product = productRegistry[id];
          return {
            product_id: id,
            name: product?.name,
            price: product?.price,
            quantity: cart[id]
          };
        })
      };

      await apiClient.post('public/transactions', payload);
      
      Alert.alert('Sukses', 'Transaksi berhasil dicatat!');
      setCart({}); // Clear cart
    } catch (error: any) {
      Alert.alert('Gagal', error.message || 'Terjadi kesalahan saat mencatat transaksi');
    } finally {
      setLoading(false);
      setShowReview(false);
    }
  };

  const cartItems = Object.keys(cart).map(id => {
    const product = productRegistry[id];
    return {
      id,
      name: product?.name || 'Unknown',
      price: product?.price || 0,
      quantity: cart[id]
    };
  });

  const FOOTER_HEIGHT = 220 + insets.bottom;

  return (
    <SafeAreaView style={styles.container} testID="transaction-safe-area" edges={['left', 'right']}>
      <View style={styles.tabContainer}>
        {categoriesLoading ? (
          <ActivityIndicator color={COLORS.primary} style={{ paddingVertical: 10 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.tab, activeCategory === cat && styles.tabActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.tabText, activeCategory === cat && styles.tabTextActive]}>
                  {cat.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <ScrollView contentContainerStyle={[styles.productList, { paddingBottom: FOOTER_HEIGHT + 20 }]}>
        {productsLoading ? (
          <View style={{ paddingVertical: 40 }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <View style={styles.grid}>
            {activeProducts.length > 0 ? (
              activeProducts.map((product) => (
                <View key={product.id} style={styles.productCard}>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>Rp {(product.price || 0).toLocaleString('id-ID')}</Text>
                  </View>
                  <View style={styles.stepper}>
                    <TouchableOpacity 
                      style={styles.stepperButton}
                      onPress={() => updateCart(product.id, -1)}
                    >
                      <Minus size={16} color={COLORS.black} />
                    </TouchableOpacity>
                    <Text style={styles.stepperValue}>{cart[product.id] || 0}</Text>
                    <TouchableOpacity 
                      style={styles.stepperButton}
                      onPress={() => updateCart(product.id, 1)}
                    >
                      <Plus size={16} color={COLORS.black} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={{ width: '100%', alignItems: 'center', paddingVertical: 40 }}>
                <Text style={{ color: '#64748B', fontWeight: '500' }}>Tidak ada produk di kategori ini</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + SPACING.lg }]}>
        <View style={styles.paymentSection}>
          <TouchableOpacity 
            style={[styles.paymentButton, paymentMethod === 'cash' && styles.paymentButtonActive]}
            onPress={() => setPaymentMethod('cash')}
          >
            <Banknote size={20} color={paymentMethod === 'cash' ? COLORS.black : COLORS.textSecondary} />
            <Text style={[styles.paymentText, paymentMethod === 'cash' && styles.paymentTextActive]}>Tunai</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.paymentButton, paymentMethod === 'qris' && styles.paymentButtonActive]}
            onPress={() => setPaymentMethod('qris')}
          >
            <CreditCard size={20} color={paymentMethod === 'qris' ? COLORS.black : COLORS.textSecondary} />
            <Text style={[styles.paymentText, paymentMethod === 'qris' && styles.paymentTextActive]}>QRIS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Bayar</Text>
          <Text style={styles.totalAmount}>Rp {(totalAmount || 0).toLocaleString('id-ID')}</Text>
        </View>

        <TouchableOpacity 
          style={[
            styles.submitButton, 
            (totalAmount === 0 || loading) && styles.submitButtonDisabled
          ]}
          disabled={totalAmount === 0 || loading}
          onPress={() => setShowReview(true)}
          testID="transaction-submit-button"
        >
          <Text style={styles.submitButtonText}>Tinjau Pesanan</Text>
        </TouchableOpacity>

        <Modal
          visible={showReview}
          transparent
          animationType="fade"
          onRequestClose={() => setShowReview(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>Tinjau Pesanan</Text>
              
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.reviewItemsContainer}>
                  {cartItems.map((item) => (
                    <View key={item.id} style={styles.reviewItem}>
                      <View style={styles.reviewItemLeft}>
                        <Text style={styles.reviewItemName}>{item.name}</Text>
                        <Text style={styles.reviewItemDetail}>
                          {item.quantity}x @ Rp {(item.price || 0).toLocaleString('id-ID')}
                        </Text>
                      </View>
                      <Text style={styles.reviewItemTotal}>
                        Rp {((item.price || 0) * item.quantity).toLocaleString('id-ID')}
                      </Text>
                    </View>
                  ))}
                </View>

                {paymentMethod === 'qris' && (
                  <View style={styles.qrisContainer}>
                    <Text style={styles.qrisLabel}>PINDAI QRIS UNTUK BAYAR</Text>
                    <View style={styles.qrisImageWrapper}>
                      <Image 
                        source={require('../../assets/qris_dummy.png')}
                        style={styles.qrisImage}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                )}

                <View style={styles.reviewFooter}>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Metode Bayar</Text>
                    <Text style={styles.reviewValue}>{paymentMethod === 'cash' ? 'Tunai' : 'QRIS'}</Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={styles.reviewTotalLabel}>Total</Text>
                    <Text style={styles.reviewTotalValue}>Rp {(totalAmount || 0).toLocaleString('id-ID')}</Text>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.reviewActions}>
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => setShowReview(false)}
                  disabled={loading}
                >
                  <Text style={styles.secondaryButtonText}>UBAH</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={handleConfirm}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.black} />
                  ) : (
                    <Text style={styles.primaryButtonText}>KONFIRMASI & CATAT</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabContainer: {
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  tabActive: {
    backgroundColor: 'rgba(198, 255, 0, 0.1)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  productList: {
    padding: SPACING.md,
    paddingBottom: 280,
  },
  grid: {
    gap: SPACING.sm,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
    gap: 12,
  },
  stepperButton: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    minWidth: 24,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderTopWidth: 2,
    borderTopColor: COLORS.border,
    gap: SPACING.md,
  },
  paymentSection: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  paymentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: BORDER_RADIUS.md,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  paymentButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  paymentTextActive: {
    color: COLORS.black,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.3,
    backgroundColor: COLORS.border,
  },
  submitButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  reviewItemDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  reviewItemTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  reviewFooter: {
    backgroundColor: COLORS.surfaceSecondary,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '700',
    opacity: 0.9,
  },
  reviewValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '900',
  },
  reviewTotalLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '900',
    marginTop: 8,
    textAlignVertical: 'center',
  },
  reviewTotalValue: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '900',
    marginTop: 8,
    textAlignVertical: 'center',
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
  qrisContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
  },
  qrisLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    letterSpacing: 1,
    backgroundColor: COLORS.black,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  qrisImageWrapper: {
    width: 220,
    height: 220,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  qrisImage: {
    width: '100%',
    height: '100%',
  },
  qrisNote: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
});
