import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, SegmentedButtons, Snackbar, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../../api/services/patientService';
import { useTheme } from '../../hooks/useTheme';
import { validateEmail, validateRequired } from '../../utils/validation';
import { spacing } from '../../theme/spacing';

export default function PatientFormScreen({ route, navigation }) {
  const { patient } = route.params || {};
  const isEditing = !!patient;
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    nombre: patient?.nombre || '',
    apellidos: patient?.apellidos || '',
    fecha_nacimiento: patient?.fecha_nacimiento ? new Date(patient.fecha_nacimiento) : new Date(),
    sexo: patient?.sexo || 'M',
    telefono: patient?.telefono || '',
    email: patient?.email || '',
    direccion: patient?.direccion || '',
    estado: patient?.estado || 'activo',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: patientService.createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      navigation.goBack();
    },
    onError: (err) => {
      setError(err.response?.data?.detail || 'Error al crear paciente');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => patientService.updatePatient(patient.id_paciente, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      queryClient.invalidateQueries(['patient', patient.id_paciente]);
      navigation.goBack();
    },
    onError: (err) => {
      setError(err.response?.data?.detail || 'Error al actualizar paciente');
    },
  });

  const handleSubmit = () => {
    // Validaciones
    if (!validateRequired(formData.nombre)) {
      setError('El nombre es requerido');
      return;
    }

    if (!validateRequired(formData.apellidos)) {
      setError('Los apellidos son requeridos');
      return;
    }

    if (formData.email && !validateEmail(formData.email)) {
      setError('Email inválido');
      return;
    }

    // Preparar datos
    const dataToSubmit = {
      ...formData,
      fecha_nacimiento: formData.fecha_nacimiento.toISOString().split('T')[0],
    };

    if (isEditing) {
      updateMutation.mutate(dataToSubmit);
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={{ backgroundColor: colors.background }}>
        <View style={styles.content}>
          <TextInput
            label="Nombre *"
            value={formData.nombre}
            onChangeText={(text) => setFormData({ ...formData, nombre: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Apellidos *"
            value={formData.apellidos}
            onChangeText={(text) => setFormData({ ...formData, apellidos: text })}
            mode="outlined"
            style={styles.input}
          />

          <View style={styles.input}>
            <Text variant="bodySmall" style={{ color: colors.textSecondary, marginBottom: 4 }}>
              Fecha de Nacimiento *
            </Text>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              icon="calendar"
            >
              {formData.fecha_nacimiento.toLocaleDateString()}
            </Button>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formData.fecha_nacimiento}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setFormData({ ...formData, fecha_nacimiento: selectedDate });
                }
              }}
            />
          )}

          <View style={styles.input}>
            <Text variant="bodySmall" style={{ color: colors.textSecondary, marginBottom: 4 }}>
              Sexo
            </Text>
            <SegmentedButtons
              value={formData.sexo}
              onValueChange={(value) => setFormData({ ...formData, sexo: value })}
              buttons={[
                { value: 'M', label: 'Masculino', icon: 'gender-male' },
                { value: 'F', label: 'Femenino', icon: 'gender-female' },
              ]}
            />
          </View>

          <TextInput
            label="Teléfono"
            value={formData.telefono}
            onChangeText={(text) => setFormData({ ...formData, telefono: text })}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Dirección"
            value={formData.direccion}
            onChangeText={(text) => setFormData({ ...formData, direccion: text })}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <View style={styles.input}>
            <Text variant="bodySmall" style={{ color: colors.textSecondary, marginBottom: 4 }}>
              Estado
            </Text>
            <SegmentedButtons
              value={formData.estado}
              onValueChange={(value) => setFormData({ ...formData, estado: value })}
              buttons={[
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' },
              ]}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
          >
            {isEditing ? 'Actualizar Paciente' : 'Crear Paciente'}
          </Button>
        </View>
      </ScrollView>

      <Snackbar visible={!!error} onDismiss={() => setError('')} duration={3000}>
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});
