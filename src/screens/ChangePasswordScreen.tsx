import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import apiClient from '../api/client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ChangePasswordScreen({ navigation, route }: any) {
  const { login } = useAuth();
  const { accessToken, refreshToken } = route.params || {};
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Harap isi semua bidang');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Kata sandi baru tidak cocok');
      return;
    }

    setLoading(true);
    try {
      // Hit the private/change-password endpoint using PATCH
      await apiClient.patch('private/change-password', {
        new_password: newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      Alert.alert('Sukses', 'Kata sandi berhasil diubah.', [
        {
          text: 'OK',
          onPress: async () => {
            // Check inventory confirmation
            try {
              const checkRes = await axios.get('https://apinofudev.bengkelfajarjaya.com/api/mynofu/private/inventory/check-confirmation', {
                headers: { Authorization: `Bearer ${accessToken}` }
              });

              if (checkRes.data && checkRes.data.is_confirmed === false && checkRes.data.items?.length > 0) {
                navigation.navigate('InventoryConfirmation', { 
                  items: checkRes.data.items, 
                  accessToken: accessToken, 
                  refreshToken: refreshToken 
                });
              } else {
                login(accessToken, refreshToken);
              }
            } catch (checkError) {
              console.error('Inventory check failed:', checkError);
              login(accessToken, refreshToken);
            }
          }
        }
      ]);
    } catch (error: any) {
      Alert.alert('Gagal', error.message || 'Terjadi kesalahan saat mengubah kata sandi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <ShieldCheck size={40} color={COLORS.black} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Ubah Kata Sandi</Text>
              <Text style={styles.subtitle}>Demi keamanan, harap perbarui kata sandi Anda.</Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Kata Sandi Baru</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Kata Sandi Baru"
                  placeholderTextColor={COLORS.textSecondary}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPassword}
                  testID="new-password-input"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Konfirmasi Kata Sandi Baru</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Konfirmasi Kata Sandi Baru"
                  placeholderTextColor={COLORS.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  testID="confirm-password-input"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={COLORS.textSecondary} />
                  ) : (
                    <Eye size={20} color={COLORS.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleChangePassword}
              disabled={loading}
              testID="change-password-submit-button"
            >
              {loading ? (
                <ActivityIndicator color={COLORS.black} />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Perbarui Kata Sandi</Text>
                  <ArrowRight size={20} color={COLORS.black} />
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    marginTop: SPACING.lg,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    opacity: 0.8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 60,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  eyeIcon: {
    padding: SPACING.sm,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: '800',
    marginRight: SPACING.sm,
  },
  cancelButton: {
    alignSelf: 'center',
    marginTop: SPACING.lg,
    padding: SPACING.sm,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
});
