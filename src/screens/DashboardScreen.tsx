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
import { ArrowUpRight, Hammer } from 'lucide-react-native';

export default function DashboardScreen({ navigation }: any) {

  return (
    <SafeAreaView style={styles.container} testID="dashboard-safe-area">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Selamat Pagi,</Text>
            <Text style={styles.riderName}>Dominikus Willy</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>AKTIF</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Total Pendapatan</Text>
            <Text style={styles.summaryValue}>Rp 1.280.000</Text>
            <View style={styles.trendBadge}>
              <ArrowUpRight size={14} color={COLORS.success} />
              <Text style={styles.trendText}>+12.5% minggu ini</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() => navigation.navigate('Balance')}
          >
            <ArrowUpRight size={20} color={COLORS.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.constructionCard}>
          <View style={styles.constructionHeader}>
            <Hammer size={18} color={COLORS.primary} />
            <Text style={styles.constructionTitle}>SEGERA HADIR</Text>
          </View>
          <Text style={styles.constructionText}>Riwayat transaksi real-time sedang dalam pengembangan.</Text>
        </View>

        <View style={styles.constructionCard}>
          <View style={styles.constructionHeader}>
            <Hammer size={18} color={COLORS.primary} />
            <Text style={styles.constructionTitle}>MONITORING STASIUN</Text>
          </View>
          <Text style={styles.constructionText}>Fitur pemantauan status stasiun otomatis akan tersedia pada versi berikutnya.</Text>
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
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  riderName: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: 8,
  },
  statusText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
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

  constructionCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    borderStyle: 'dashed',
  },
  constructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  constructionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  constructionText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontWeight: '600',
  },
});
