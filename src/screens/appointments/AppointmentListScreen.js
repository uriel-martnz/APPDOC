import React, { useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { FAB, Chip } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '../../api/services/appointmentService';
import { useTheme } from '../../hooks/useTheme';
import AppointmentCard from '../../components/appointment/AppointmentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import { spacing } from '../../theme/spacing';
import { getTodayISO, getDatePlusDays } from '../../utils/dateHelpers';

export default function AppointmentListScreen({ navigation }) {
  const { colors } = useTheme();
  const [statusFilter, setStatusFilter] = useState(''); // '', 'programada', 'completada', 'cancelada'

  const {
    data: appointments,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['appointments', statusFilter],
    queryFn: () => appointmentService.getAppointments('', '', statusFilter, ''),
  });

  const handleAppointmentPress = (appointment) => {
    navigation.navigate('AppointmentDetail', { appointmentId: appointment.id_cita });
  };

  const handleAddAppointment = () => {
    navigation.navigate('AppointmentForm');
  };

  const toggleStatusFilter = (status) => {
    setStatusFilter(statusFilter === status ? '' : status);
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando citas..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error al cargar citas"
        message={error.response?.data?.detail || error.message}
        onRetry={refetch}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.filterContainer}>
        <Chip
          selected={statusFilter === 'programada'}
          onPress={() => toggleStatusFilter('programada')}
          style={styles.filterChip}
          mode={statusFilter === 'programada' ? 'flat' : 'outlined'}
        >
          Programadas
        </Chip>
        <Chip
          selected={statusFilter === 'completada'}
          onPress={() => toggleStatusFilter('completada')}
          style={styles.filterChip}
          mode={statusFilter === 'completada' ? 'flat' : 'outlined'}
        >
          Completadas
        </Chip>
        <Chip
          selected={statusFilter === 'cancelada'}
          onPress={() => toggleStatusFilter('cancelada')}
          style={styles.filterChip}
          mode={statusFilter === 'cancelada' ? 'flat' : 'outlined'}
        >
          Canceladas
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
        data={appointments}
        keyExtractor={(item) => item.id_cita}
        renderItem={({ item }) => (
          <AppointmentCard appointment={item} onPress={() => handleAppointmentPress(item)} />
        )}
        contentContainerStyle={appointments?.length === 0 ? styles.emptyContainer : styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-blank"
            title="No hay citas"
            message={
              statusFilter
                ? 'No se encontraron citas con el filtro aplicado'
                : 'Agrega tu primera cita usando el botón +'
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
        onPress={handleAddAppointment}
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
    paddingVertical: spacing.md,
    flexWrap: 'wrap',
  },
  filterChip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  listContent: {
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
