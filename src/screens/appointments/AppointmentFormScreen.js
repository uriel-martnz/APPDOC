import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, SegmentedButtons, Snackbar, Text, Menu, Divider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { appointmentService } from '../../api/services/appointmentService';
import { patientService } from '../../api/services/patientService';
import { useTheme } from '../../hooks/useTheme';
import { validateRequired } from '../../utils/validation';
import { spacing } from '../../theme/spacing';

export default function AppointmentFormScreen({ route, navigation }) {
  const { appointment } = route.params || {};
  const isEditing = !!appointment;
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    id_paciente: appointment?.id_paciente || '',
    fecha: appointment?.fecha ? new Date(appointment.fecha) : new Date(),
    hora: appointment?.hora || '09:00',
    motivo: appointment?.motivo || '',
    doctor: appointment?.doctor || '',
    estado: appointment?.estado || 'programada',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [error, setError] = useState('');

  // Cargar lista de pacientes para el selector
  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientService.getPatients('', 'activo'),
  });

  const selectedPatient = patients?.find(p => p.id_paciente === formData.id_paciente);

  const createMutation = useMutation({
    mutationFn: appointmentService.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      navigation.goBack();
    },
    onError: (err) => {
      setError(err.response?.data?.detail || 'Error al crear cita');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => appointmentService.updateAppointment(appointment.id_cita, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      queryClient.invalidateQueries(['appointment', appointment.id_cita]);
      navigation.goBack();
    },
    onError: (err) => {
      setError(err.response?.data?.detail || 'Error al actualizar cita');
    },
  });

  const handleSubmit = () => {
    if (!formData.id_paciente) {
      setError('Debe seleccionar un paciente');
      return;
    }

    const dataToSubmit = {
      ...formData,
      fecha: formData.fecha.toISOString().split('T')[0],
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
          <View style={styles.input}>
            <Text variant="bodySmall" style={{ color: colors.textSecondary, marginBottom: 4 }}>
              Paciente *
            </Text>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setMenuVisible(true)}
                  icon="account"
                >
                  {selectedPatient
                    ? `${selectedPatient.nombre} ${selectedPatient.apellidos}`
                    : 'Seleccionar paciente'}
                </Button>
              }
            >
              {patients?.map((patient) => (
                <Menu.Item
                  key={patient.id_paciente}
                  onPress={() => {
                    setFormData({ ...formData, id_paciente: patient.id_paciente });
                    setMenuVisible(false);
                  }}
                  title={`${patient.nombre} ${patient.apellidos}`}
                />
              ))}
            </Menu>
          </View>

          <View style={styles.input}>
            <Text variant="bodySmall" style={{ color: colors.textSecondary, marginBottom: 4 }}>
              Fecha *
            </Text>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              icon="calendar"
            >
              {formData.fecha.toLocaleDateString()}
            </Button>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formData.fecha}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setFormData({ ...formData, fecha: selectedDate });
                }
              }}
            />
          )}

          <View style={styles.input}>
            <Text variant="bodySmall" style={{ color: colors.textSecondary, marginBottom: 4 }}>
              Hora *
            </Text>
            <Button
              mode="outlined"
              onPress={() => setShowTimePicker(true)}
              icon="clock-outline"
            >
              {formData.hora}
            </Button>
          </View>

          {showTimePicker && (
            <DateTimePicker
              value={new Date(`2000-01-01T${formData.hora}`)}
              mode="time"
              display="default"
              is24Hour={true}
              onChange={(event, selectedTime) => {
                setShowTimePicker(Platform.OS === 'ios');
                if (selectedTime) {
                  const hours = selectedTime.getHours().toString().padStart(2, '0');
                  const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
                  setFormData({ ...formData, hora: `${hours}:${minutes}` });
                }
              }}
            />
          )}

          <TextInput
            label="Doctor"
            value={formData.doctor}
            onChangeText={(text) => setFormData({ ...formData, doctor: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Motivo de consulta"
            value={formData.motivo}
            onChangeText={(text) => setFormData({ ...formData, motivo: text })}
            mode="outlined"
            multiline
            numberOfLines={4}
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
                { value: 'programada', label: 'Programada' },
                { value: 'completada', label: 'Completada' },
                { value: 'cancelada', label: 'Cancelada' },
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
            {isEditing ? 'Actualizar Cita' : 'Crear Cita'}
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
