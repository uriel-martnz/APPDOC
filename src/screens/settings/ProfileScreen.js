import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Divider } from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../api/services/authService';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { validateEmail, validateRequired } from '../../utils/validation';
import { spacing } from '../../theme/spacing';

export default function ProfileScreen({ navigation }) {
  const { user, setUser } = useAuth();
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const [nombre, setNombre] = useState(user?.nombre || '');
  const [apellidos, setApellidos] = useState(user?.apellidos || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [especialidad, setEspecialidad] = useState(user?.especialidad || '');
  const [errors, setErrors] = useState({});

  const updateMutation = useMutation({
    mutationFn: authService.updateMe,
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigation.goBack();
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      if (error.response?.data?.detail) {
        setErrors({ general: error.response.data.detail });
      }
    },
  });

  const validate = () => {
    const newErrors = {};

    const nombreError = validateRequired(nombre, 'El nombre');
    if (nombreError) newErrors.nombre = nombreError;

    const apellidosError = validateRequired(apellidos, 'Los apellidos');
    if (apellidosError) newErrors.apellidos = apellidosError;

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const profileData = {
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      email: email.trim(),
      telefono: telefono.trim() || null,
      especialidad: especialidad.trim() || null,
    };

    updateMutation.mutate(profileData);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
          Información Personal
        </Text>

        <TextInput
          label="Nombre *"
          value={nombre}
          onChangeText={setNombre}
          mode="outlined"
          error={!!errors.nombre}
          style={styles.input}
        />
        {errors.nombre && (
          <Text variant="bodySmall" style={[styles.errorText, { color: colors.error }]}>
            {errors.nombre}
          </Text>
        )}

        <TextInput
          label="Apellidos *"
          value={apellidos}
          onChangeText={setApellidos}
          mode="outlined"
          error={!!errors.apellidos}
          style={styles.input}
        />
        {errors.apellidos && (
          <Text variant="bodySmall" style={[styles.errorText, { color: colors.error }]}>
            {errors.apellidos}
          </Text>
        )}

        <TextInput
          label="Email *"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          error={!!errors.email}
          style={styles.input}
        />
        {errors.email && (
          <Text variant="bodySmall" style={[styles.errorText, { color: colors.error }]}>
            {errors.email}
          </Text>
        )}

        <TextInput
          label="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Divider style={styles.divider} />

        <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
          Información Profesional
        </Text>

        <TextInput
          label="Especialidad"
          value={especialidad}
          onChangeText={setEspecialidad}
          mode="outlined"
          style={styles.input}
          placeholder="Ej: Medicina General, Pediatría, etc."
        />

        <TextInput
          label="Rol"
          value={user?.rol || 'Médico'}
          mode="outlined"
          disabled
          style={styles.input}
        />

        {errors.general && (
          <Text variant="bodyMedium" style={[styles.errorText, { color: colors.error }]}>
            {errors.general}
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={updateMutation.isPending}
            disabled={updateMutation.isPending}
            style={styles.button}
          >
            Guardar Cambios
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            disabled={updateMutation.isPending}
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
  sectionTitle: {
    fontWeight: '600',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  input: {
    marginBottom: spacing.md,
  },
  errorText: {
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  divider: {
    marginVertical: spacing.lg,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
  button: {
    marginBottom: spacing.sm,
  },
});
