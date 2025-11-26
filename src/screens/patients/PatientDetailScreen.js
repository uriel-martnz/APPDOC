import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, IconButton, Divider, Button, Card } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { patientService } from '../../api/services/patientService';
import { noteService } from '../../api/services/noteService';
import { photoService } from '../../api/services/photoService';
import { appointmentService } from '../../api/services/appointmentService';
import { useTheme } from '../../hooks/useTheme';
import PatientHeader from '../../components/patient/PatientHeader';
import PatientStats from '../../components/patient/PatientStats';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatDate } from '../../utils/dateHelpers';
import { spacing } from '../../theme/spacing';

export default function PatientDetailScreen({ route, navigation }) {
  const { patientId } = route.params;
  const { colors } = useTheme();

  const { data: patient, isLoading, error, refetch } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => patientService.getPatient(patientId),
  });

  const { data: notes = [] } = useQuery({
    queryKey: ['notes', patientId],
    queryFn: () => noteService.getPatientNotes(patientId),
  });

  const { data: photos = [] } = useQuery({
    queryKey: ['photos', patientId],
    queryFn: () => photoService.getPatientPhotos(patientId),
  });

  const { data: allAppointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentService.getAppointments(),
  });

  // Filtrar citas del paciente actual
  const patientAppointments = allAppointments.filter(
    apt => apt.id_paciente === patientId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="pencil"
          onPress={() => navigation.navigate('PatientForm', { patient })}
          disabled={isLoading || error}
        />
      ),
    });
  }, [navigation, patient, isLoading, error]);

  if (isLoading) {
    return <LoadingSpinner message="Cargando paciente..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error al cargar paciente"
        message={error.response?.data?.detail || error.message}
        onRetry={refetch}
      />
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <PatientHeader patient={patient} />

      <PatientStats
        appointmentCount={patientAppointments.length}
        noteCount={notes.length}
        photoCount={photos.length}
      />

      <Divider style={styles.divider} />

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
            Notas Médicas Recientes
          </Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('NoteList', { patientId, patientName: `${patient.nombre} ${patient.apellidos}` })}
            compact
          >
            Ver todas
          </Button>
        </View>

        {notes && notes.length > 0 ? (
          <>
            {notes.slice(0, 3).map((note) => (
              <Card
                key={note.id_nota}
                style={styles.noteCard}
                onPress={() => navigation.navigate('NoteDetail', { noteId: note.id_nota, patientId })}
              >
                <Card.Content>
                  <View style={styles.noteHeader}>
                    <MaterialCommunityIcons name="calendar" size={14} color={colors.primary} />
                    <Text variant="bodySmall" style={[styles.noteDate, { color: colors.textSecondary }]}>
                      {formatDate(note.fecha)}
                    </Text>
                  </View>
                  {note.diagnostico && (
                    <Text variant="bodyMedium" style={[styles.noteDiagnosis, { color: colors.text }]} numberOfLines={2}>
                      {note.diagnostico}
                    </Text>
                  )}
                </Card.Content>
              </Card>
            ))}
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('NoteForm', { patientId })}
              style={styles.addButton}
              icon="plus"
            >
              Nueva nota médica
            </Button>
          </>
        ) : (
          <View style={styles.emptyNotes}>
            <MaterialCommunityIcons name="note-text-outline" size={48} color={colors.textTertiary} />
            <Text variant="bodyMedium" style={{ color: colors.textSecondary, marginTop: spacing.sm, marginBottom: spacing.md }}>
              No hay notas médicas registradas
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('NoteForm', { patientId })}
              icon="plus"
            >
              Agregar primera nota
            </Button>
          </View>
        )}
      </View>

      <Divider style={styles.divider} />

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
            Fotos Recientes
          </Text>
          <Button
            mode="text"
            onPress={() => navigation.navigate('PhotoGallery', { patientId, patientName: `${patient.nombre} ${patient.apellidos}` })}
            compact
          >
            Ver todas
          </Button>
        </View>

        {photos && photos.length > 0 ? (
          <View>
            <View style={styles.photoRow}>
              {photos.slice(0, 4).map((photo) => (
                <Card
                  key={photo.id_foto}
                  style={styles.photoThumbnail}
                  onPress={() => navigation.navigate('PhotoViewer', { photo, patientId })}
                >
                  <MaterialCommunityIcons name="image" size={32} color={colors.primary} />
                </Card>
              ))}
            </View>
            <Text variant="bodySmall" style={{ color: colors.textSecondary, marginTop: spacing.xs }}>
              {photos.length} {photos.length === 1 ? 'foto' : 'fotos'} en total
            </Text>
          </View>
        ) : (
          <View style={styles.emptyNotes}>
            <MaterialCommunityIcons name="image-off" size={48} color={colors.textTertiary} />
            <Text variant="bodyMedium" style={{ color: colors.textSecondary, marginTop: spacing.sm, marginBottom: spacing.md }}>
              No hay fotos registradas
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('PhotoGallery', { patientId, patientName: `${patient.nombre} ${patient.apellidos}` })}
              icon="plus"
            >
              Agregar primera foto
            </Button>
          </View>
        )}
      </View>

      {patient.direccion && (
        <>
          <Divider style={styles.divider} />
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
              Dirección
            </Text>
            <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
              {patient.direccion}
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: spacing.sm,
  },
  noteCard: {
    marginBottom: spacing.sm,
    elevation: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  noteDate: {
    marginLeft: spacing.xs,
  },
  noteDiagnosis: {
    fontWeight: '600',
  },
  addButton: {
    marginTop: spacing.sm,
  },
  emptyNotes: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  photoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoThumbnail: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
});
