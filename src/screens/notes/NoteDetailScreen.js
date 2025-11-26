import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, FAB, IconButton, Menu } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { noteService } from '../../api/services/noteService';
import { useTheme } from '../../hooks/useTheme';
import { formatDate } from '../../utils/dateHelpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import VitalSignsCard from '../../components/note/VitalSignsCard';
import { spacing } from '../../theme/spacing';

export default function NoteDetailScreen({ route, navigation }) {
  const { noteId, patientId } = route.params;
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const {
    data: note,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => noteService.getNote(noteId),
  });

  const deleteMutation = useMutation({
    mutationFn: noteService.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', patientId] });
      navigation.goBack();
    },
  });

  const handleEdit = () => {
    setMenuVisible(false);
    navigation.navigate('NoteForm', { patientId, note });
  };

  const handleDelete = () => {
    setMenuVisible(false);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(noteId);
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando nota médica..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error al cargar nota"
        message={error.response?.data?.detail || error.message}
        onRetry={refetch}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <View style={styles.content}>
          {/* Fecha */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.dateContainer}>
                <MaterialCommunityIcons name="calendar" size={20} color={colors.primary} />
                <Text variant="titleMedium" style={[styles.dateText, { color: colors.text }]}>
                  {formatDate(note.fecha)}
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Diagnóstico */}
          {note.diagnostico && (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="clipboard-text" size={20} color={colors.primary} />
                  <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                    Diagnóstico
                  </Text>
                </View>
                <Text variant="bodyLarge" style={{ color: colors.text, marginTop: spacing.sm, lineHeight: 24 }}>
                  {note.diagnostico}
                </Text>
              </Card.Content>
            </Card>
          )}

          {/* Motivo de Consulta */}
          {note.motivo_consulta && (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="text-box" size={20} color={colors.primary} />
                  <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                    Motivo de consulta
                  </Text>
                </View>
                <Text variant="bodyMedium" style={{ color: colors.text, marginTop: spacing.sm, lineHeight: 22 }}>
                  {note.motivo_consulta}
                </Text>
              </Card.Content>
            </Card>
          )}

          {/* Síntomas */}
          {note.sintomas && (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="alert-circle" size={20} color={colors.primary} />
                  <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                    Síntomas
                  </Text>
                </View>
                <Text variant="bodyMedium" style={{ color: colors.text, marginTop: spacing.sm, lineHeight: 22 }}>
                  {note.sintomas}
                </Text>
              </Card.Content>
            </Card>
          )}

          {/* Signos Vitales */}
          <VitalSignsCard vitalSigns={note.signos_vitales} />

          {/* Tratamiento */}
          {note.tratamiento && (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="pill" size={20} color={colors.primary} />
                  <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                    Tratamiento
                  </Text>
                </View>
                <Text variant="bodyMedium" style={{ color: colors.text, marginTop: spacing.sm, lineHeight: 22 }}>
                  {note.tratamiento}
                </Text>
              </Card.Content>
            </Card>
          )}

          {/* Observaciones */}
          {note.observaciones && (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="note-text" size={20} color={colors.primary} />
                  <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                    Observaciones
                  </Text>
                </View>
                <Text variant="bodyMedium" style={{ color: colors.text, marginTop: spacing.sm, lineHeight: 22 }}>
                  {note.observaciones}
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>

      <FAB
        icon="pencil"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleEdit}
        label="Editar"
      />

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <IconButton
            icon="dots-vertical"
            size={24}
            onPress={() => setMenuVisible(true)}
            style={styles.menuButton}
          />
        }
      >
        <Menu.Item onPress={handleEdit} leadingIcon="pencil" title="Editar" />
        <Menu.Item onPress={handleDelete} leadingIcon="delete" title="Eliminar" />
      </Menu>

      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Eliminar nota"
        message="¿Estás seguro de que deseas eliminar esta nota médica? Esta acción no se puede deshacer."
        onConfirm={confirmDelete}
        onDismiss={() => setDeleteDialogVisible(false)}
        confirmText="Eliminar"
        confirmLoading={deleteMutation.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl + spacing.xl,
  },
  card: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
  },
  menuButton: {
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
  },
});
