import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { ArrowUpRight, Package, AlertCircle } from 'lucide-react-native';

export default function BalanceHistoryScreen() {
  const activity = [
    { id: '1', type: 'transaction', amount: 'Rp 45.000', time: '10:45 AM', status: 'Success' },
    { id: '2', type: 'request', amount: '20 Items', time: '09:30 AM', status: 'Pending' },
    { id: '3', type: 'report', amount: '1 Damage', time: 'Yesterday', status: 'Critical' },
    { id: '4', type: 'transaction', amount: 'Rp 120.500', time: 'Yesterday', status: 'Success' },
  ];

  const renderIcon = (type: string) => {
    switch (type) {
      case 'transaction': return <ArrowUpRight size={24} color={COLORS.success} />;
      case 'request': return <Package size={24} color={COLORS.textSecondary} />;
      case 'report': return <AlertCircle size={24} color={COLORS.error} />;
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} testID="balance-safe-area">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Rider Wallet</Text>
        
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>Rp 485.500</Text>
        </View>

        <View style={styles.chartPlaceholder}>
          <Text style={styles.sectionTitle}>Earnings (last 7 days)</Text>
          <View style={styles.chartLineContainer}>
             {/* Simple visual representation of a chart line */}
             <View style={styles.chartLine} />
             <View style={[styles.chartDot, { left: '10%', bottom: 20 }]} />
             <View style={[styles.chartDot, { left: '30%', bottom: 40 }]} />
             <View style={[styles.chartDot, { left: '50%', bottom: 30 }]} />
             <View style={[styles.chartDot, { left: '70%', bottom: 60 }]} />
             <View style={[styles.chartDot, { left: '90%', bottom: 50 }]} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {activity.map((item) => (
          <View key={item.id} style={styles.activityItem}>
            <View style={styles.iconContainer}>
              {renderIcon(item.type)}
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityType}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </Text>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
            <View style={styles.activityValues}>
              <Text style={styles.activityAmount}>{item.amount}</Text>
              <Text style={styles.activityStatus}>{item.status}</Text>
            </View>
          </View>
        ))}
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.xl,
  },
  balanceCard: {
    backgroundColor: COLORS.black,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    marginBottom: SPACING.xs,
  },
  balanceAmount: {
    color: COLORS.white,
    fontSize: 40,
    fontWeight: 'bold',
  },
  chartPlaceholder: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  chartLineContainer: {
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: BORDER_RADIUS.md,
    position: 'relative',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  chartLine: {
    height: 2,
    backgroundColor: COLORS.black,
    position: 'absolute',
    bottom: 40,
    left: '5%',
    right: '5%',
  },
  chartDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.black,
    position: 'absolute',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  activityType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  activityTime: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  activityValues: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  activityStatus: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
