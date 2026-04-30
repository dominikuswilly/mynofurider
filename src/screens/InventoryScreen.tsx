import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { Plus, Minus, Camera, Send } from 'lucide-react-native';

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
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'report' && styles.tabActive]}
          onPress={() => setActiveTab('report')}
        >
          <Text style={[styles.tabText, activeTab === 'report' && styles.tabTextActive]}>
            Report Damage
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'request' ? <RequestStockView /> : <ReportDamageView />}
      </ScrollView>
    </SafeAreaView>
  );
}

const RequestStockView = () => {
  const items = [
    { id: '1', name: 'Original Cold Brew', stock: 12 },
    { id: '2', name: 'Vanilla Latte', stock: 8 },
    { id: '3', name: 'Arabica Beans (250g)', stock: 5 },
  ];

  return (
    <View>
      {items.map((item) => (
        <View key={item.id} style={styles.itemCard}>
          <View style={styles.itemImagePlaceholder} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemStock}>Current Stock: {item.stock}</Text>
          </View>
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepperButton}>
              <Minus size={20} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.stepperValue}>0</Text>
            <TouchableOpacity style={styles.stepperButton}>
              <Plus size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.submitFab}>
        <Send size={24} color={COLORS.white} />
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
        <Camera size={32} color={COLORS.black} />
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
    backgroundColor: 'rgba(0,0,0,0.05)',
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  tabActive: {
    backgroundColor: COLORS.black,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: 100,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: BORDER_RADIUS.sm,
  },
  itemInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  itemStock: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  stepperButton: {
    backgroundColor: COLORS.black,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    minWidth: 20,
    textAlign: 'center',
  },
  submitFab: {
    position: 'absolute',
    right: 0,
    bottom: -60,
    backgroundColor: COLORS.black,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  form: {
    marginTop: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.black,
    fontSize: 16,
    color: COLORS.black,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  photoUpload: {
    height: 200,
    borderWidth: 2,
    borderColor: COLORS.black,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  photoText: {
    marginTop: SPACING.md,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  submitButton: {
    backgroundColor: COLORS.black,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
