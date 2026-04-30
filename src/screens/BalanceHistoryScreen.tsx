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
import { ArrowUpRight, Package, AlertCircle, TrendingUp, ChevronRight } from 'lucide-react-native';

export default function BalanceHistoryScreen() {
  const sections = [
    {
      title: 'Today',
      data: [
        { id: '1', type: 'transaction', subType: 'Sales', amount: 'Rp 45.000', time: '10:45 AM', status: 'Success' },
        { id: '2', type: 'request', subType: 'Refill', amount: '20 Items', time: '09:30 AM', status: 'Pending' },
      ]
    },
    {
      title: 'Yesterday',
      data: [
        { id: '3', type: 'report', subType: 'Damage', amount: '1 Damage', time: '04:15 PM', status: 'Critical' },
        { id: '4', type: 'transaction', subType: 'Bonus', amount: 'Rp 120.500', time: '11:20 AM', status: 'Success' },
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return COLORS.success;
      case 'Pending': return '#F59E0B'; // Amber
      case 'Critical': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'transaction': return <TrendingUp size={20} color={COLORS.success} />;
      case 'request': return <Package size={20} color={COLORS.primary} />;
      case 'report': return <AlertCircle size={20} color={COLORS.error} />;
      default: return <ChevronRight size={20} color={COLORS.textSecondary} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} testID="balance-safe-area">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Rider Wallet</Text>
        
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={styles.balanceAmount}>Rp 485.500</Text>
            </View>
            <TouchableOpacity style={styles.withdrawButton}>
              <Text style={styles.withdrawText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterText}>Station #402 • Verified Partner</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Earnings Trend</Text>
            <Text style={styles.chartSubTitle}>Last 7 days</Text>
          </View>
          <View style={styles.chartLineContainer}>
             <View style={styles.chartLine} />
             <View style={[styles.chartDot, { left: '10%', bottom: 20 }]} />
             <View style={[styles.chartDot, { left: '30%', bottom: 40 }]} />
             <View style={[styles.chartDot, { left: '50%', bottom: 30, backgroundColor: COLORS.error }]} />
             <View style={[styles.chartDot, { left: '70%', bottom: 65 }]} />
             <View style={[styles.chartDot, { left: '90%', bottom: 50 }]} />
          </View>
          <View style={styles.chartXAxis}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <Text key={i} style={styles.xAxisText}>{day}</Text>
            ))}
          </View>
        </View>

        <View style={styles.activityHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            {section.data.map((item) => (
              <View key={item.id} style={styles.activityItem}>
                <View style={styles.iconContainer}>
                  {renderIcon(item.type)}
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityType}>{item.subType}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
                <View style={styles.activityValues}>
                  <Text style={styles.activityAmount}>{item.amount}</Text>
                  <Text style={[styles.activityStatus, { color: getStatusColor(item.status) }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            ))}
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
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: SPACING.xl,
    letterSpacing: -0.5,
  },
  balanceCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  balanceAmount: {
    color: COLORS.text,
    fontSize: 36,
    fontWeight: '900',
  },
  withdrawButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  withdrawText: {
    color: COLORS.black,
    fontWeight: '800',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  cardFooter: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cardFooterText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: SPACING.lg,
  },
  chartSubTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  chartLineContainer: {
    height: 100,
    position: 'relative',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  chartLine: {
    height: 2,
    backgroundColor: 'rgba(198, 255, 0, 0.2)', // Faded primary color
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  chartDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  chartXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: SPACING.sm,
  },
  xAxisText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    marginLeft: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  activityType: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  activityTime: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  activityValues: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  activityStatus: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
});
