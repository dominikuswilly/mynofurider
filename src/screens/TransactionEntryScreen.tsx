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
import { ChevronDown, CreditCard, Banknote } from 'lucide-react-native';

export default function TransactionEntryScreen() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'digital'>('cash');

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
                testID="transaction-amount-input"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Product Category</Text>
            <TouchableOpacity style={styles.dropdown} testID="transaction-category-dropdown">
              <Text style={styles.dropdownText}>Select Category</Text>
              <ChevronDown size={20} color={COLORS.black} />
            </TouchableOpacity>
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
                <Banknote size={20} color={COLORS.black} />
                <Text style={styles.segmentText}>Cash</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  paymentMethod === 'digital' && styles.segmentButtonActive,
                ]}
                onPress={() => setPaymentMethod('digital')}
                testID="transaction-payment-digital"
              >
                <CreditCard size={20} color={COLORS.black} />
                <Text style={styles.segmentText}>Digital</Text>
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
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.xl,
  },
  formGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    borderBottomWidth: 3,
    borderBottomColor: COLORS.black,
    paddingVertical: SPACING.sm,
  },
  currencyPrefix: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    marginRight: SPACING.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.black,
    padding: 0,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.black,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    gap: SPACING.sm,
  },
  segmentButtonActive: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  spacer: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: COLORS.black,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
