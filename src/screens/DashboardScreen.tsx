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
import { ArrowUpRight } from 'lucide-react-native';

export default function DashboardScreen({ navigation }: any) {

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
            <View style={styles.trendBadge}>
              <ArrowUpRight size={14} color={COLORS.success} />
              <Text style={styles.trendText}>+12.5% this week</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() => navigation.navigate('Balance')}
          >
            <ArrowUpRight size={20} color={COLORS.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.lastTransactionCard}>
          <Text style={styles.lastTransactionLabel}>Last Transaction</Text>
          <Text style={styles.lastTransactionValue}>Rp 45.000 • 10:45 AM</Text>
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
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  brandText: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.text, // Brightest text for contrast
    letterSpacing: 0.5,
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
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '700',
  },
  lastTransactionCard: {
    backgroundColor: COLORS.surfaceSecondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastTransactionLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  lastTransactionValue: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '700',
  },
  viewDetailsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
