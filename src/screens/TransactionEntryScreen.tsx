import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { CreditCard, Banknote, Check, Plus, Minus, Search } from 'lucide-react-native';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

const PRODUCTS: Product[] = [
  { id: '1', name: 'ESPRESSO SINGLE', price: 15000, category: 'Kopi' },
  { id: '2', name: 'AMERICANO ICE', price: 22000, category: 'Kopi' },
  { id: '3', name: 'CAFE LATTE', price: 28000, category: 'Kopi' },
  { id: '4', name: 'CAPPUCCINO', price: 26000, category: 'Kopi' },
  { id: '5', name: 'SIGNATURE CHOCO', price: 25000, category: 'Cokelat' },
  { id: '6', name: 'DARK COCOA', price: 27000, category: 'Cokelat' },
  { id: '7', name: 'EARL GREY TEA', price: 20000, category: 'Teh' },
  { id: '8', name: 'LEMON TEA ICE', price: 18000, category: 'Teh' },
];

export default function TransactionEntryScreen() {
  const [activeCategory, setActiveCategory] = useState('Kopi');
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'digital'>('cash');

  const categories = ['Kopi', 'Cokelat', 'Teh', 'Snack'];

  const updateCart = (productId: string, delta: number) => {
    setCart(prev => {
      const currentQty = prev[productId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      if (newQty === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const filteredProducts = PRODUCTS.filter(p => p.category === activeCategory);
  
  const totalAmount = Object.keys(cart).reduce((total, id) => {
    const product = PRODUCTS.find(p => p.id === id);
    const qty = cart[id] || 0;
    const price = product?.price || 0;
    return total + (price * qty);
  }, 0);

  return (
    <SafeAreaView style={styles.container} testID="transaction-safe-area">
      <View style={styles.tabContainer}>
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
      </View>

      <ScrollView contentContainerStyle={styles.productList}>
        <View style={styles.grid}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>Rp {product.price.toLocaleString('id-ID')}</Text>
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
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.paymentSection}>
          <TouchableOpacity 
            style={[styles.paymentButton, paymentMethod === 'cash' && styles.paymentButtonActive]}
            onPress={() => setPaymentMethod('cash')}
          >
            <Banknote size={20} color={paymentMethod === 'cash' ? COLORS.black : COLORS.textSecondary} />
            <Text style={[styles.paymentText, paymentMethod === 'cash' && styles.paymentTextActive]}>Tunai</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.paymentButton, paymentMethod === 'digital' && styles.paymentButtonActive]}
            onPress={() => setPaymentMethod('digital')}
          >
            <CreditCard size={20} color={paymentMethod === 'digital' ? COLORS.black : COLORS.textSecondary} />
            <Text style={[styles.paymentText, paymentMethod === 'digital' && styles.paymentTextActive]}>Digital</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Bayar</Text>
          <Text style={styles.totalAmount}>Rp {totalAmount.toLocaleString('id-ID')}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, totalAmount === 0 && styles.submitButtonDisabled]}
          disabled={totalAmount === 0}
        >
          <Text style={styles.submitButtonText}>Konfirmasi & Catat Transaksi</Text>
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
    paddingBottom: 220,
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
});
