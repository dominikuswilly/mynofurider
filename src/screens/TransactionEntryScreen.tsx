import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { CreditCard, Banknote, Check } from 'lucide-react-native';

export default function TransactionEntryScreen() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'digital'>('cash');
  const [category, setCategory] = useState<string>('Coffee');

  const categories = ['Coffee', 'Beans', 'Food', 'Merch'];

  return (
    <SafeAreaView style={styles.container} testID="transaction-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>New Transaction</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencyPrefix}>Rp</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  autoFocus={true}
                  testID="transaction-amount-input"
                />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Product Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, category === cat && styles.chipActive]}
                  onPress={() => setCategory(cat)}
                  testID={`transaction-category-${cat}`}
                >
                  <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Payment Method</Text>
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  paymentMethod === 'cash' && styles.segmentButtonActive,
                ]}
                onPress={() => setPaymentMethod('cash')}
                testID="transaction-payment-cash"
              >
                {paymentMethod === 'cash' ? (
                  <Check size={20} color={COLORS.black} />
                ) : (
                  <Banknote size={20} color={COLORS.textSecondary} />
                )}
                <Text style={[styles.segmentText, paymentMethod === 'cash' && styles.segmentTextActive]}>
                  Cash
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  paymentMethod === 'digital' && styles.segmentButtonActive,
                ]}
                onPress={() => setPaymentMethod('digital')}
                testID="transaction-payment-digital"
              >
                {paymentMethod === 'digital' ? (
                  <Check size={20} color={COLORS.black} />
                ) : (
                  <CreditCard size={20} color={COLORS.textSecondary} />
                )}
                <Text style={[styles.segmentText, paymentMethod === 'digital' && styles.segmentTextActive]}>
                  Digital
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.spacer} />

          <TouchableOpacity style={styles.submitButton} testID="transaction-submit-button">
            <Text style={styles.submitButtonText}>Confirm & Log Transaction</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    flexGrow: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  formGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    opacity: 0.9,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
    paddingVertical: SPACING.sm,
  },
  currencyPrefix: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.text,
    padding: 0,
  },
  chipContainer: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.black,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.sm,
    gap: SPACING.sm,
  },
  segmentButtonActive: {
    backgroundColor: COLORS.primary,
  },
  segmentText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  segmentTextActive: {
    color: COLORS.black,
  },
  spacer: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  submitButtonText: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
