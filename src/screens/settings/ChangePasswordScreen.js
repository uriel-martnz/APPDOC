import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../../api/services/authService';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';

export default function ChangePasswordScreen({ navigation }) {
  const { colors } = useTheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const changePasswordMutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      navigation.goBack();
    },
    onError: (error) => {
      console.error('Error changing password:', error);
      if (error.response?.data?.detail) {
        setErrors({ general: error.response.data.detail });
      } else {
        setErrors({ general: 'Error al cambiar la contraseña' });
      }
    },
  });

  const validate = () => {
    const newErrors = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma la nueva contraseña';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    changePasswordMutation.mutate({
      current_password: currentPassword,
      new_password: newPassword,
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text variant="bodyMedium" style={{ color: colors.textSecondary, marginBottom: spacing.lg }}>
          Por seguridad, ingresa tu contraseña actual y luego la nueva contraseña.
        </Text>

        <TextInput
          label="Contraseña Actual *"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          mode="outlined"
          secureTextEntry={!showCurrentPassword}
          error={!!errors.currentPassword}
          right={
            <TextInput.Icon
              icon={showCurrentPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            />
          }
          style={styles.input}
        />
        {errors.currentPassword && (
          <Text variant="bodySmall" style={[styles.errorText, { color: colors.error }]}>
            {errors.currentPassword}
          </Text>
        )}

        <TextInput
          label="Nueva Contraseña *"
          value={newPassword}
          onChangeText={setNewPassword}
          mode="outlined"
          secureTextEntry={!showNewPassword}
          error={!!errors.newPassword}
          right={
            <TextInput.Icon
              icon={showNewPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowNewPassword(!showNewPassword)}
            />
          }
          style={styles.input}
        />
        {errors.newPassword && (
          <Text variant="bodySmall" style={[styles.errorText, { color: colors.error }]}>
            {errors.newPassword}
          </Text>
        )}

        <TextInput
          label="Confirmar Nueva Contraseña *"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          secureTextEntry={!showConfirmPassword}
          error={!!errors.confirmPassword}
          right={
            <TextInput.Icon
              icon={showConfirmPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
          style={styles.input}
        />
        {errors.confirmPassword && (
          <Text variant="bodySmall" style={[styles.errorText, { color: colors.error }]}>
            {errors.confirmPassword}
          </Text>
        )}

        {errors.general && (
          <Text variant="bodyMedium" style={[styles.errorText, { color: colors.error }]}>
            {errors.general}
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={changePasswordMutation.isPending}
            disabled={changePasswordMutation.isPending}
            style={styles.button}
          >
            Cambiar Contraseña
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            disabled={changePasswordMutation.isPending}
            style={styles.button}
          >
            Cancelar
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  input: {
    marginBottom: spacing.md,
  },
  errorText: {
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
  button: {
    marginBottom: spacing.sm,
  },
});
