import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { ArrowUpRight, Package, AlertCircle, Wallet, Plus } from 'lucide-react-native';

export default function DashboardScreen({ navigation }: any) {
  const quickActions = [
    { id: '1', title: 'Transact', icon: Plus, screen: 'Transactions' },
    { id: '2', title: 'Refill', icon: Package, screen: 'Inventory' },
    { id: '3', title: 'Report', icon: AlertCircle, screen: 'Inventory' },
    { id: '4', title: 'Wallet', icon: Wallet, screen: 'Balance' },
  ];

  return (
    <SafeAreaView style={styles.container} testID="dashboard-safe-area">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Hello Rider,</Text>
            <Text style={styles.brandText}>NOFU COFFEE</Text>
          </View>
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitial}>R</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Total Earnings</Text>
            <Text style={styles.summaryValue}>Rp 1.280.000</Text>
          </View>
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() => navigation.navigate('Balance')}
          >
            <ArrowUpRight size={20} color={COLORS.black} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          {quickActions.map((action) => (
            <TouchableOpacity 
              key={action.id} 
              style={styles.gridItem}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={styles.iconContainer}>
                <action.icon size={32} color={COLORS.black} />
              </View>
              <Text style={styles.gridText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.newsCard}>
          <Text style={styles.newsTitle}>Station Status</Text>
          <Text style={styles.newsContent}>Your assigned station #402 is running low on Arabica Beans.</Text>
          <TouchableOpacity style={styles.newsButton}>
            <Text style={styles.newsButtonText}>Fix Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.black,
    opacity: 0.7,
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  viewDetailsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  gridItem: {
    width: '47.5%',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  iconContainer: {
    marginBottom: SPACING.sm,
  },
  gridText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  newsCard: {
    backgroundColor: COLORS.black,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
  },
  newsTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  newsContent: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  newsButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  newsButtonText: {
    color: COLORS.black,
    fontWeight: 'bold',
  },
});
