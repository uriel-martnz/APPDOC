import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { formatDate, formatTime } from '../../utils/dateHelpers';
import { spacing } from '../../theme/spacing';

export default function AppointmentCard({ appointment, onPress }) {
  const { colors } = useTheme();

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

  const statusColor = getStatusColor(appointment.estado);

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons name="calendar" size={20} color={colors.primary} />
            <Text variant="titleMedium" style={[styles.date, { color: colors.text }]}>
              {formatDate(appointment.fecha)}
            </Text>
          </View>
          <View style={styles.time}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={colors.textSecondary} />
            <Text variant="bodyMedium" style={[styles.timeText, { color: colors.textSecondary }]}>
              {formatTime(appointment.hora)}
            </Text>
          </View>
        </View>

        {appointment.paciente && (
          <Text variant="titleSmall" style={[styles.patient, { color: colors.text }]}>
            Paciente: {appointment.paciente.nombre} {appointment.paciente.apellidos}
          </Text>
        )}

        {appointment.doctor && (
          <Text variant="bodySmall" style={[styles.detail, { color: colors.textSecondary }]}>
            <MaterialCommunityIcons name="doctor" size={14} /> Dr. {appointment.doctor}
          </Text>
        )}

        {appointment.motivo && (
          <Text
            variant="bodySmall"
            style={[styles.detail, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            <MaterialCommunityIcons name="text" size={14} /> {appointment.motivo}
          </Text>
        )}

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
            fontSize: 12,
          }}
        >
          {getStatusLabel(appointment.estado)}
        </Chip>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
    minHeight: 160,
  },
  cardContent: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    marginLeft: spacing.xs,
    fontWeight: 'bold',
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: spacing.xs,
  },
  patient: {
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  detail: {
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    height: 32,
  },
});
