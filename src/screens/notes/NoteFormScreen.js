import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { TextInput, Button, Text, Divider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noteService } from '../../api/services/noteService';
import { useTheme } from '../../hooks/useTheme';
import { formatDateISO } from '../../utils/dateHelpers';
import { spacing } from '../../theme/spacing';

export default function NoteFormScreen({ route, navigation }) {
  const { patientId, note } = route.params;
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const isEdit = !!note;

  // Campos principales
  const [fecha, setFecha] = useState(note?.fecha ? new Date(note.fecha) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [motivoConsulta, setMotivoConsulta] = useState(note?.motivo_consulta || '');
  const [sintomas, setSintomas] = useState(note?.sintomas || '');
  const [diagnostico, setDiagnostico] = useState(note?.diagnostico || '');
  const [tratamiento, setTratamiento] = useState(note?.tratamiento || '');
  const [observaciones, setObservaciones] = useState(note?.observaciones || '');

  // Signos vitales
  const [presionSistolica, setPresionSistolica] = useState(
    note?.signos_vitales?.presion_sistolica?.toString() || ''
  );
  const [presionDiastolica, setPresionDiastolica] = useState(
    note?.signos_vitales?.presion_diastolica?.toString() || ''
  );
  const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState(
    note?.signos_vitales?.frecuencia_cardiaca?.toString() || ''
  );
  const [temperatura, setTemperatura] = useState(
    note?.signos_vitales?.temperatura?.toString() || ''
  );
  const [peso, setPeso] = useState(note?.signos_vitales?.peso?.toString() || '');
  const [altura, setAltura] = useState(note?.signos_vitales?.altura?.toString() || '');
  const [saturacionOxigeno, setSaturacionOxigeno] = useState(
    note?.signos_vitales?.saturacion_oxigeno?.toString() || ''
  );
  const [frecuenciaRespiratoria, setFrecuenciaRespiratoria] = useState(
    note?.signos_vitales?.frecuencia_respiratoria?.toString() || ''
  );

  const [errors, setErrors] = useState({});

  const createMutation = useMutation({
    mutationFn: noteService.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', patientId] });
      navigation.goBack();
    },
    onError: (error) => {
      console.error('Error creating note:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ noteId, noteData }) => noteService.updateNote(noteId, noteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', patientId] });
      queryClient.invalidateQueries({ queryKey: ['note', note.id_nota] });
      navigation.goBack();
    },
    onError: (error) => {
      console.error('Error updating note:', error);
    },
  });

  const validate = () => {
    const newErrors = {};

    if (!diagnostico.trim()) {
      newErrors.diagnostico = 'El diagnóstico es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const signosVitales = {};

    if (presionSistolica) signosVitales.presion_sistolica = parseFloat(presionSistolica);
    if (presionDiastolica) signosVitales.presion_diastolica = parseFloat(presionDiastolica);
    if (frecuenciaCardiaca) signosVitales.frecuencia_cardiaca = parseFloat(frecuenciaCardiaca);
    if (temperatura) signosVitales.temperatura = parseFloat(temperatura);
    if (peso) signosVitales.peso = parseFloat(peso);
    if (altura) signosVitales.altura = parseFloat(altura);
    if (saturacionOxigeno) signosVitales.saturacion_oxigeno = parseFloat(saturacionOxigeno);
    if (frecuenciaRespiratoria)
      signosVitales.frecuencia_respiratoria = parseFloat(frecuenciaRespiratoria);

    const noteData = {
      paciente_id: patientId,
      fecha: formatDateISO(fecha),
      motivo_consulta: motivoConsulta.trim() || null,
      sintomas: sintomas.trim() || null,
      diagnostico: diagnostico.trim(),
      tratamiento: tratamiento.trim() || null,
      observaciones: observaciones.trim() || null,
      signos_vitales: Object.keys(signosVitales).length > 0 ? signosVitales : null,
    };

    if (isEdit) {
      updateMutation.mutate({ noteId: note.id_nota, noteData });
    } else {
      createMutation.mutate(noteData);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFecha(selectedDate);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Fecha */}
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          icon="calendar"
          style={styles.dateButton}
        >
          Fecha: {fecha.toLocaleDateString('es-ES')}
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={fecha}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Información de la Consulta */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
          Información de la Consulta
        </Text>

        <TextInput
          label="Motivo de consulta"
          value={motivoConsulta}
          onChangeText={setMotivoConsulta}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <TextInput
          label="Síntomas"
          value={sintomas}
          onChangeText={setSintomas}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <TextInput
          label="Diagnóstico *"
          value={diagnostico}
          onChangeText={setDiagnostico}
          mode="outlined"
          multiline
          numberOfLines={3}
          error={!!errors.diagnostico}
          style={styles.input}
        />
        {errors.diagnostico && (
          <Text variant="bodySmall" style={[styles.errorText, { color: colors.error }]}>
            {errors.diagnostico}
          </Text>
        )}

        <TextInput
          label="Tratamiento"
          value={tratamiento}
          onChangeText={setTratamiento}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <TextInput
          label="Observaciones"
          value={observaciones}
          onChangeText={setObservaciones}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <Divider style={styles.divider} />

        {/* Signos Vitales */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
          Signos Vitales
        </Text>

        <View style={styles.row}>
          <TextInput
            label="Presión sistólica (mmHg)"
            value={presionSistolica}
            onChangeText={setPresionSistolica}
            mode="outlined"
            keyboardType="decimal-pad"
            style={[styles.input, styles.halfInput]}
          />
          <TextInput
            label="Presión diastólica (mmHg)"
            value={presionDiastolica}
            onChangeText={setPresionDiastolica}
            mode="outlined"
            keyboardType="decimal-pad"
            style={[styles.input, styles.halfInput]}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            label="Frecuencia cardíaca (lpm)"
            value={frecuenciaCardiaca}
            onChangeText={setFrecuenciaCardiaca}
            mode="outlined"
            keyboardType="decimal-pad"
            style={[styles.input, styles.halfInput]}
          />
          <TextInput
            label="Temperatura (°C)"
            value={temperatura}
            onChangeText={setTemperatura}
            mode="outlined"
            keyboardType="decimal-pad"
            style={[styles.input, styles.halfInput]}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            label="Peso (kg)"
            value={peso}
            onChangeText={setPeso}
            mode="outlined"
            keyboardType="decimal-pad"
            style={[styles.input, styles.halfInput]}
          />
          <TextInput
            label="Altura (cm)"
            value={altura}
            onChangeText={setAltura}
            mode="outlined"
            keyboardType="decimal-pad"
            style={[styles.input, styles.halfInput]}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            label="Saturación O₂ (%)"
            value={saturacionOxigeno}
            onChangeText={setSaturacionOxigeno}
            mode="outlined"
            keyboardType="decimal-pad"
            style={[styles.input, styles.halfInput]}
          />
          <TextInput
            label="Frec. respiratoria (rpm)"
            value={frecuenciaRespiratoria}
            onChangeText={setFrecuenciaRespiratoria}
            mode="outlined"
            keyboardType="decimal-pad"
            style={[styles.input, styles.halfInput]}
          />
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            {isEdit ? 'Actualizar nota' : 'Guardar nota'}
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            disabled={isLoading}
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
  dateButton: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
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
