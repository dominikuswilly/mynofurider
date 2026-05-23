import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { ArrowUpRight, Hammer } from 'lucide-react-native';
import { storage } from '../utils/storage';
import { decodeJWT } from '../utils/jwt';
import apiClient from '../api/client';

export default function DashboardScreen({ navigation }: any) {
  const [riderName, setRiderName] = useState('Rider');
  const [totalEarnings, setTotalEarnings] = useState('Rp 0');
  const [loading, setLoading] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value).replace(/,00$/, '');
  };

  const loadRiderData = async () => {
    try {
      const token = await storage.getAccessToken();
      if (token) {
        const claims = decodeJWT(token);
        if (claims && claims.name) {
          setRiderName(claims.name);
        }
      }

      const response = await apiClient.get('private/wallet/summary');
      if (response.data) {
        const earningsVal = response.data.total_earnings || 0;
        setTotalEarnings(formatCurrency(earningsVal));
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRiderData();
    const unsubscribe = navigation.addListener('focus', () => {
      loadRiderData();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} testID="dashboard-safe-area" edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Selamat Pagi,</Text>
            <Text style={styles.riderName}>{riderName}</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>AKTIF</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Total Pendapatan</Text>
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ alignSelf: 'flex-start', marginVertical: SPACING.sm }} />
            ) : (
              <Text style={styles.summaryValue}>{totalEarnings}</Text>
            )}
            <View style={styles.trendBadge}>
              <ArrowUpRight size={14} color={COLORS.success} />
              <Text style={styles.trendText}>Komisi harian terakumulasi</Text>
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
