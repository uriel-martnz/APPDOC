import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';

export default function VitalSignsCard({ vitalSigns }) {
  const { colors } = useTheme();

  if (!vitalSigns) {
    return null;
  }

  const signs = [
    {
      icon: 'heart-pulse',
      label: 'Presión arterial',
      value: vitalSigns.presion_sistolica && vitalSigns.presion_diastolica
        ? `${vitalSigns.presion_sistolica}/${vitalSigns.presion_diastolica} mmHg`
        : null,
      color: colors.error,
    },
    {
      icon: 'heart',
      label: 'Frecuencia cardíaca',
      value: vitalSigns.frecuencia_cardiaca
        ? `${vitalSigns.frecuencia_cardiaca} lpm`
        : null,
      color: colors.error,
    },
    {
      icon: 'thermometer',
      label: 'Temperatura',
      value: vitalSigns.temperatura
        ? `${vitalSigns.temperatura} °C`
        : null,
      color: colors.warning,
    },
    {
      icon: 'weight-kilogram',
      label: 'Peso',
      value: vitalSigns.peso
        ? `${vitalSigns.peso} kg`
        : null,
      color: colors.primary,
    },
    {
      icon: 'human-male-height',
      label: 'Altura',
      value: vitalSigns.altura
        ? `${vitalSigns.altura} cm`
        : null,
      color: colors.primary,
    },
    {
      icon: 'water-percent',
      label: 'Saturación O₂',
      value: vitalSigns.saturacion_oxigeno
        ? `${vitalSigns.saturacion_oxigeno}%`
        : null,
      color: colors.info,
    },
    {
      icon: 'lungs',
      label: 'Frec. respiratoria',
      value: vitalSigns.frecuencia_respiratoria
        ? `${vitalSigns.frecuencia_respiratoria} rpm`
        : null,
      color: colors.info,
    },
  ];

  // Filtrar solo los signos que tienen valor
  const availableSigns = signs.filter((sign) => sign.value);

  if (availableSigns.length === 0) {
    return null;
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <MaterialCommunityIcons name="heart-pulse" size={20} color={colors.primary} />
          <Text variant="titleMedium" style={[styles.title, { color: colors.text }]}>
            Signos Vitales
          </Text>
        </View>

        <View style={styles.grid}>
          {availableSigns.map((sign, index) => (
            <View key={index} style={styles.signItem}>
              <View style={styles.signHeader}>
                <MaterialCommunityIcons name={sign.icon} size={20} color={sign.color} />
                <Text variant="bodySmall" style={[styles.signLabel, { color: colors.textSecondary }]}>
                  {sign.label}
                </Text>
              </View>
              <Text variant="bodyLarge" style={[styles.signValue, { color: colors.text }]}>
                {sign.value}
              </Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  signItem: {
    width: '50%',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },
  signHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  signLabel: {
    marginLeft: spacing.xs,
    fontSize: 12,
  },
  signValue: {
    fontWeight: '600',
    marginLeft: spacing.lg + spacing.xs,
  },
});
