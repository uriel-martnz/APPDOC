import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';

export default function PatientHeader({ patient }) {
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
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text variant="headlineSmall" style={{ color: colors.text }}>
        {patient.nombre} {patient.apellidos}
      </Text>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="cake" size={16} color={colors.textSecondary} />
        <Text variant="bodyMedium" style={[styles.infoText, { color: colors.textSecondary }]}>
          {getAge(patient.fecha_nacimiento)}
        </Text>
        {patient.sexo && (
          <>
            <MaterialCommunityIcons
              name={patient.sexo === 'M' ? 'gender-male' : 'gender-female'}
              size={16}
              color={colors.textSecondary}
              style={styles.icon}
            />
            <Text variant="bodyMedium" style={[styles.infoText, { color: colors.textSecondary }]}>
              {patient.sexo === 'M' ? 'Masculino' : 'Femenino'}
            </Text>
          </>
        )}
      </View>

      {patient.telefono && (
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="phone" size={16} color={colors.textSecondary} />
          <Text variant="bodyMedium" style={[styles.infoText, { color: colors.textSecondary }]}>
            {patient.telefono}
          </Text>
        </View>
      )}

      {patient.email && (
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="email" size={16} color={colors.textSecondary} />
          <Text variant="bodyMedium" style={[styles.infoText, { color: colors.textSecondary }]}>
            {patient.email}
          </Text>
        </View>
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
        textStyle={{ color: isActive ? colors.success : colors.textTertiary }}
      >
        {isActive ? 'Activo' : 'Inactivo'}
      </Chip>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  infoText: {
    marginLeft: spacing.xs,
  },
  icon: {
    marginLeft: spacing.md,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
  },
});
