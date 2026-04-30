import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { Plus, Minus, Camera, Send, Coffee, Package, Bean } from 'lucide-react-native';

export default function InventoryScreen() {
  const [activeTab, setActiveTab] = useState<'request' | 'report'>('request');

  return (
    <SafeAreaView style={styles.container} testID="inventory-safe-area">
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'request' && styles.tabActive]}
          onPress={() => setActiveTab('request')}
        >
          <Text style={[styles.tabText, activeTab === 'request' && styles.tabTextActive]}>
            Request Stock
          </Text>
          {activeTab === 'request' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'report' && styles.tabActive]}
          onPress={() => setActiveTab('report')}
        >
          <Text style={[styles.tabText, activeTab === 'report' && styles.tabTextActive]}>
            Report Damage
          </Text>
          {activeTab === 'report' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'request' ? <RequestStockView /> : <ReportDamageView />}
      </ScrollView>
    </SafeAreaView>
  );
}

const RequestStockView = () => {
  const [items, setItems] = useState([
    { id: '1', name: 'Original Cold Brew', stock: 12, request: '0', icon: Coffee },
    { id: '2', name: 'Vanilla Latte', stock: 8, request: '0', icon: Coffee },
    { id: '3', name: 'Arabica Beans (250g)', stock: 5, request: '0', icon: Bean },
    { id: '4', name: 'Paper Cups (S)', stock: 0, request: '0', icon: Package },
  ]);

  const updateRequest = (id: string, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newVal = Math.max(0, parseInt(item.request || '0') + delta);
        return { ...item, request: newVal.toString() };
      }
      return item;
    }));
  };

  const handleManualInput = (id: string, text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setItems(items.map(item => 
      item.id === id ? { ...item, request: numericValue } : item
    ));
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return COLORS.error;
    if (stock < 10) return COLORS.primary;
    return COLORS.textSecondary;
  };

  return (
    <View style={styles.viewContainer}>
      {items.map((item) => (
        <View key={item.id} style={styles.itemCard}>
          <View style={styles.itemIconContainer}>
            <item.icon size={24} color={COLORS.primary} />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.stockInfo}>
              <Text style={styles.stockLabel}>Stock: </Text>
              <Text style={[styles.stockValue, { color: getStockColor(item.stock) }]}>
                {item.stock}
              </Text>
            </View>
          </View>
          <View style={styles.stepper}>
            <TouchableOpacity 
              style={styles.stepperButton}
              onPress={() => updateRequest(item.id, -1)}
            >
              <Minus size={18} color={COLORS.black} />
            </TouchableOpacity>
            <TextInput
              style={styles.stepperInput}
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
      <TouchableOpacity style={styles.submitFab}>
        <Send size={28} color={COLORS.black} />
      </TouchableOpacity>
    </View>
  );
};

const ReportDamageView = () => {
  return (
    <View style={styles.form}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Item Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product ID"
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Issue Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the issue..."
          placeholderTextColor={COLORS.textSecondary}
          multiline
          numberOfLines={4}
        />
      </View>
      <TouchableOpacity style={styles.photoUpload}>
        <Camera size={40} color={COLORS.primary} />
        <Text style={styles.photoText}>TAP TO TAKE PHOTO OF DAMAGE</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>SUBMIT CRITICAL REPORT</Text>
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
    margin: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    // No background change, just the indicator
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 24,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.text,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: 120,
  },
  viewContainer: {
    flex: 1,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  itemIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  stockLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  stockValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
  },
  stepperButton: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperInput: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    minWidth: 40,
    textAlign: 'center',
    padding: 0,
  },
  submitFab: {
    position: 'absolute',
    right: 0,
    bottom: -80,
    backgroundColor: COLORS.primary,
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  form: {
    marginTop: SPACING.sm,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    height: 140,
    textAlignVertical: 'top',
  },
  photoUpload: {
    height: 180,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    backgroundColor: COLORS.surface,
  },
  photoText: {
    marginTop: SPACING.md,
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
