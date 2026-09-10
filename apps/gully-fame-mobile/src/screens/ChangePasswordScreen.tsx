// Created by Kiro
// Change Password Screen - Update user password with validation

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { authService } from '../api/services/authService';

export default function ChangePasswordScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain lowercase letters';
    } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase letters';
    } else if (!/(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain numbers';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Handle change password
  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const result = await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (result.success) {
        Alert.alert('Success', 'Password changed successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword
    ) {
      Alert.alert('Discard Changes', 'Are you sure you want to discard changes?', [
        { text: 'Keep Editing', style: 'cancel' },
        {
          text: 'Discard',
          onPress: () => navigation.goBack(),
          style: 'destructive',
        },
      ]);
    } else {
      navigation.goBack();
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&])/.test(password)) strength++;

    if (strength <= 1) return { level: 'Weak', color: '#d32f2f' };
    if (strength <= 2) return { level: 'Fair', color: '#FFB800' };
    if (strength <= 3) return { level: 'Good', color: '#4CAF50' };
    return { level: 'Strong', color: '#2196F3' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Ionicons name="lock-closed" size={48} color="#007AFF" />
            <Text style={styles.headerTitle}>Change Password</Text>
            <Text style={styles.headerSubtitle}>
              Update your password to keep your account secure
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Current Password */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Current Password *</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    errors.currentPassword && styles.inputError,
                  ]}
                  placeholder="Enter current password"
                  value={formData.currentPassword}
                  onChangeText={(value) =>
                    handleInputChange('currentPassword', value)
                  }
                  secureTextEntry={!showPasswords.current}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                >
                  <Ionicons
                    name={showPasswords.current ? 'eye' : 'eye-off'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
              {errors.currentPassword && (
                <Text style={styles.errorText}>{errors.currentPassword}</Text>
              )}
            </View>

            {/* New Password */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>New Password *</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, errors.newPassword && styles.inputError]}
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChangeText={(value) =>
                    handleInputChange('newPassword', value)
                  }
                  secureTextEntry={!showPasswords.new}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      new: !prev.new,
                    }))
                  }
                >
                  <Ionicons
                    name={showPasswords.new ? 'eye' : 'eye-off'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
              {errors.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              )}

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    <View
                      style={[
                        styles.strengthFill,
                        { backgroundColor: passwordStrength.color },
                      ]}
                    />
                  </View>
                  <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                    Strength: {passwordStrength.level}
                  </Text>
                </View>
              )}

              {/* Password Requirements */}
              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>Password must contain:</Text>
                <View style={styles.requirement}>
                  <Ionicons
                    name={formData.newPassword.length >= 8 ? 'checkmark-circle' : 'close-circle'}
                    size={16}
                    color={formData.newPassword.length >= 8 ? '#4CAF50' : '#ccc'}
                  />
                  <Text style={styles.requirementText}>At least 8 characters</Text>
                </View>
                <View style={styles.requirement}>
                  <Ionicons
                    name={/(?=.*[a-z])/.test(formData.newPassword) ? 'checkmark-circle' : 'close-circle'}
                    size={16}
                    color={/(?=.*[a-z])/.test(formData.newPassword) ? '#4CAF50' : '#ccc'}
                  />
                  <Text style={styles.requirementText}>Lowercase letters (a-z)</Text>
                </View>
                <View style={styles.requirement}>
                  <Ionicons
                    name={/(?=.*[A-Z])/.test(formData.newPassword) ? 'checkmark-circle' : 'close-circle'}
                    size={16}
                    color={/(?=.*[A-Z])/.test(formData.newPassword) ? '#4CAF50' : '#ccc'}
                  />
                  <Text style={styles.requirementText}>Uppercase letters (A-Z)</Text>
                </View>
                <View style={styles.requirement}>
                  <Ionicons
                    name={/(?=.*\d)/.test(formData.newPassword) ? 'checkmark-circle' : 'close-circle'}
                    size={16}
                    color={/(?=.*\d)/.test(formData.newPassword) ? '#4CAF50' : '#ccc'}
                  />
                  <Text style={styles.requirementText}>Numbers (0-9)</Text>
                </View>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm Password *</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    errors.confirmPassword && styles.inputError,
                  ]}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange('confirmPassword', value)
                  }
                  secureTextEntry={!showPasswords.confirm}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                >
                  <Ionicons
                    name={showPasswords.confirm ? 'eye' : 'eye-off'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#007AFF" />
              ) : (
                <>
                  <Ionicons name="close" size={20} color="#007AFF" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.changeButton]}
              onPress={handleChangePassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.changeButtonText}>Change Password</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Spacing */}
          <View style={styles.footerSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  formSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
  },
  strengthContainer: {
    marginTop: 12,
  },
  strengthBar: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  strengthFill: {
    height: '100%',
    width: '60%',
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  requirementsContainer: {
    marginTop: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 12,
    color: '#666',
  },
  buttonSection: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  changeButton: {
    backgroundColor: '#007AFF',
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footerSpacing: {
    height: 20,
  },
});
