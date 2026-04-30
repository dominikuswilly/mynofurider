import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { LogOut } from 'lucide-react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container} testID="home-safe-area">
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to NOFU</Text>
        <Text style={styles.subtitle}>You have successfully logged in as a Rider.</Text>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => navigation.replace('Login')}
          testID="home-logout-button"
        >
          <LogOut size={20} color={COLORS.black} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
  },
  logoutText: {
    marginLeft: SPACING.sm,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
});
