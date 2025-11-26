import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';

export default function PatientCard({ patient, onPress }) {
  const { colors } = useTheme();

  const getAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} años`;
  };

  const isActive = patient.estado === 'activo';

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium" style={[styles.title, { color: colors.text }]}>
          {patient.nombre} {patient.apellidos}
        </Text>

        <Text variant="bodySmall" style={[styles.detail, { color: colors.textSecondary }]}>
          <MaterialCommunityIcons name="cake" size={14} /> {getAge(patient.fecha_nacimiento)}
          {patient.sexo && ` • ${patient.sexo === 'M' ? 'Masculino' : 'Femenino'}`}
        </Text>

        {patient.telefono && (
          <Text variant="bodySmall" style={[styles.detail, { color: colors.textSecondary }]}>
            <MaterialCommunityIcons name="phone" size={14} /> {patient.telefono}
          </Text>
        )}

        {patient.email && (
          <Text
            variant="bodySmall"
            style={[styles.detail, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            <MaterialCommunityIcons name="email" size={14} /> {patient.email}
          </Text>
        )}

        <Chip
          mode="outlined"
          style={[
            styles.statusChip,
            {
              backgroundColor: isActive ? colors.success + '20' : colors.textTertiary + '20',
              borderColor: isActive ? colors.success : colors.textTertiary,
            },
          ]}
          textStyle={{
            color: isActive ? colors.success : colors.textTertiary,
            fontSize: 12,
          }}
        >
          {isActive ? 'Activo' : 'Inactivo'}
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
    minHeight: 200,
  },
  cardContent: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 120,
  },
  title: {
    marginBottom: spacing.xs,
    fontWeight: 'bold',
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
