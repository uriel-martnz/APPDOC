import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { noteService } from '../../api/services/noteService';
import { useTheme } from '../../hooks/useTheme';
import NoteCard from '../../components/note/NoteCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { spacing } from '../../theme/spacing';

export default function NoteListScreen({ route, navigation }) {
  const { patientId, patientName } = route.params;
  const { colors } = useTheme();

  const {
    data: notes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notes', patientId],
    queryFn: () => noteService.getPatientNotes(patientId),
  });

  React.useEffect(() => {
    if (patientName) {
      navigation.setOptions({
        title: `Notas - ${patientName}`,
      });
    }
  }, [patientName, navigation]);

  const handleAddNote = () => {
    navigation.navigate('NoteForm', { patientId });
  };

  const handleNotePress = (note) => {
    navigation.navigate('NoteDetail', { noteId: note.id_nota, patientId });
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando notas médicas..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error al cargar notas"
        message={error.response?.data?.detail || error.message}
        onRetry={refetch}
      />
    );
  }

  const sortedNotes = notes ? [...notes].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) : [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={sortedNotes}
        keyExtractor={(item) => item.id_nota.toString()}
        renderItem={({ item }) => (
          <NoteCard note={item} onPress={() => handleNotePress(item)} />
        )}
        contentContainerStyle={[
          styles.listContent,
          sortedNotes.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={
          <EmptyState
            icon="note-text"
            title="No hay notas médicas"
            message="Agrega la primera nota médica de este paciente"
          />
        }
        refreshing={isLoading}
        onRefresh={refetch}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleAddNote}
        label="Nueva nota"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl + spacing.xl,
  },
  emptyListContent: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
  },
});
