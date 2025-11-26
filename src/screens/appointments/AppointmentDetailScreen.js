import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Chip, FAB, Divider } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { appointmentService } from '../../api/services/appointmentService';
import { useTheme } from '../../hooks/useTheme';
import { formatDate, formatTime, formatRelativeDate } from '../../utils/dateHelpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { spacing } from '../../theme/spacing';

export default function AppointmentDetailScreen({ route, navigation }) {
  const { appointmentId } = route.params;
  const { colors } = useTheme();

  const {
    data: appointment,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => appointmentService.getAppointment(appointmentId),
  });

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'programada':
        return colors.info;
      case 'completada':
        return colors.success;
      case 'cancelada':
        return colors.error;
      default:
        return colors.textTertiary;
    }
  };

  const getStatusLabel = (estado) => {
    switch (estado) {
      case 'programada':
        return 'Programada';
      case 'completada':
        return 'Completada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return estado;
    }
  };

  const handleEdit = () => {
    navigation.navigate('AppointmentForm', { appointment });
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando cita..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error al cargar cita"
        message={error.response?.data?.detail || error.message}
        onRetry={refetch}
      />
    );
  }

  const statusColor = getStatusColor(appointment.estado);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <View style={styles.content}>
          {/* Fecha y Hora */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateSection}>
                  <MaterialCommunityIcons name="calendar" size={24} color={colors.primary} />
                  <View style={styles.dateInfo}>
                    <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
                      Fecha
                    </Text>
                    <Text variant="titleMedium" style={{ color: colors.text, fontWeight: 'bold' }}>
                      {formatDate(appointment.fecha)}
                    </Text>
                    <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
                      {formatRelativeDate(appointment.fecha)}
                    </Text>
                  </View>
                </View>
                <View style={styles.timeSection}>
                  <MaterialCommunityIcons name="clock-outline" size={24} color={colors.primary} />
                  <View style={styles.timeInfo}>
                    <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
                      Hora
                    </Text>
                    <Text variant="titleMedium" style={{ color: colors.text, fontWeight: 'bold' }}>
                      {formatTime(appointment.hora)}
                    </Text>
                  </View>
                </View>
              </View>

              <Divider style={styles.divider} />

              <Chip
                mode="outlined"
                style={[
                  styles.statusChip,
                  {
                    backgroundColor: statusColor + '20',
                    borderColor: statusColor,
                  },
                ]}
                textStyle={{
                  color: statusColor,
                  fontWeight: '600',
                }}
              >
                {getStatusLabel(appointment.estado)}
              </Chip>
            </Card.Content>
          </Card>

          {/* Información del Paciente */}
          {appointment.paciente && (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="account" size={20} color={colors.primary} />
                  <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                    Paciente
                  </Text>
                </View>
                <Text variant="titleLarge" style={{ color: colors.text, fontWeight: 'bold', marginTop: spacing.sm }}>
                  {appointment.paciente.nombre} {appointment.paciente.apellidos}
                </Text>
                {appointment.paciente.telefono && (
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="phone" size={16} color={colors.textSecondary} />
                    <Text variant="bodyMedium" style={[styles.infoText, { color: colors.textSecondary }]}>
                      {appointment.paciente.telefono}
                    </Text>
                  </View>
                )}
                {appointment.paciente.email && (
                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="email" size={16} color={colors.textSecondary} />
                    <Text variant="bodyMedium" style={[styles.infoText, { color: colors.textSecondary }]}>
                      {appointment.paciente.email}
                    </Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          )}

          {/* Doctor */}
          {appointment.doctor && (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="doctor" size={20} color={colors.primary} />
                  <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                    Doctor
                  </Text>
                </View>
                <Text variant="bodyLarge" style={{ color: colors.text, marginTop: spacing.sm }}>
                  Dr. {appointment.doctor}
                </Text>
              </Card.Content>
            </Card>
          )}

          {/* Motivo de Consulta */}
          {appointment.motivo && (
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="text" size={20} color={colors.primary} />
                  <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                    Motivo de consulta
                  </Text>
                </View>
                <Text variant="bodyMedium" style={{ color: colors.text, marginTop: spacing.sm, lineHeight: 22 }}>
                  {appointment.motivo}
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
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  dateSection: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  dateInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: spacing.md,
  },
  timeInfo: {
    marginLeft: spacing.md,
  },
  divider: {
    marginVertical: spacing.md,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  infoText: {
    marginLeft: spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
  },
});
