import React, { useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { FAB, Chip } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { patientService } from '../../api/services/patientService';
import { useTheme } from '../../hooks/useTheme';
import { useDebounce } from '../../hooks/useDebounce';
import SearchBar from '../../components/common/SearchBar';
import PatientCard from '../../components/patient/PatientCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import { spacing } from '../../theme/spacing';

export default function PatientListScreen({ navigation }) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '' = todos, 'activo', 'inactivo'
  const debouncedSearch = useDebounce(searchQuery, 300);

  const {
    data: patients,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['patients', debouncedSearch, statusFilter],
    queryFn: () => patientService.getPatients(debouncedSearch, statusFilter),
  });

  const handlePatientPress = (patient) => {
    navigation.navigate('PatientDetail', { patientId: patient.id_paciente });
  };

  const handleAddPatient = () => {
    navigation.navigate('PatientForm');
  };

  const toggleStatusFilter = (status) => {
    setStatusFilter(statusFilter === status ? '' : status);
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando pacientes..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error al cargar pacientes"
        message={error.response?.data?.detail || error.message}
        onRetry={refetch}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar por nombre, apellido o email..."
      />

      <View style={styles.filterContainer}>
        <Chip
          selected={statusFilter === 'activo'}
          onPress={() => toggleStatusFilter('activo')}
          style={styles.filterChip}
          mode={statusFilter === 'activo' ? 'flat' : 'outlined'}
        >
          Activos
        </Chip>
        <Chip
          selected={statusFilter === 'inactivo'}
          onPress={() => toggleStatusFilter('inactivo')}
          style={styles.filterChip}
          mode={statusFilter === 'inactivo' ? 'flat' : 'outlined'}
        >
          Inactivos
        </Chip>
        {statusFilter && (
          <Chip
            onPress={() => setStatusFilter('')}
            style={styles.filterChip}
            mode="outlined"
            icon="close"
          >
            Limpiar
          </Chip>
        )}
      </View>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id_paciente}
        renderItem={({ item }) => (
          <PatientCard patient={item} onPress={() => handlePatientPress(item)} />
        )}
        contentContainerStyle={patients?.length === 0 ? styles.emptyContainer : styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="account-multiple"
            title="No hay pacientes"
            message={
              searchQuery || statusFilter
                ? 'No se encontraron pacientes con los filtros aplicados'
                : 'Agrega tu primer paciente usando el botón +'
            }
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleAddPatient}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  filterChip: {
    marginRight: spacing.sm,
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
  },
});
