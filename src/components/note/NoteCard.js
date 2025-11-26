import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { formatDate } from '../../utils/dateHelpers';
import { spacing } from '../../theme/spacing';

export default function NoteCard({ note, onPress }) {
  const { colors } = useTheme();

  const hasVitalSigns = note.signos_vitales && Object.keys(note.signos_vitales).some(
    (key) => note.signos_vitales[key] !== null && note.signos_vitales[key] !== undefined && note.signos_vitales[key] !== ''
  );

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          {/* Fecha y diagnóstico */}
          <View style={styles.header}>
            <View style={styles.dateContainer}>
              <MaterialCommunityIcons name="calendar" size={16} color={colors.primary} />
              <Text variant="bodyMedium" style={[styles.date, { color: colors.text }]}>
                {formatDate(note.fecha)}
              </Text>
            </View>
            {hasVitalSigns && (
              <Chip
                mode="flat"
                compact
                style={styles.vitalChip}
                textStyle={{ fontSize: 11 }}
                icon="heart-pulse"
              >
                Signos vitales
              </Chip>
            )}
          </View>

          {/* Diagnóstico */}
          {note.diagnostico && (
            <View style={styles.section}>
              <Text variant="titleMedium" style={[styles.diagnosis, { color: colors.text }]} numberOfLines={2}>
                {note.diagnostico}
              </Text>
            </View>
          )}

          {/* Motivo de consulta */}
          {note.motivo_consulta && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="text-box" size={14} color={colors.textSecondary} />
                <Text variant="bodySmall" style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  Motivo:
                </Text>
              </View>
              <Text variant="bodyMedium" style={{ color: colors.text }} numberOfLines={2}>
                {note.motivo_consulta}
              </Text>
            </View>
          )}

          {/* Síntomas */}
          {note.sintomas && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="alert-circle" size={14} color={colors.textSecondary} />
                <Text variant="bodySmall" style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  Síntomas:
                </Text>
              </View>
              <Text variant="bodyMedium" style={{ color: colors.text }} numberOfLines={2}>
                {note.sintomas}
              </Text>
            </View>
          )}

          {/* Tratamiento */}
          {note.tratamiento && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="pill" size={14} color={colors.textSecondary} />
                <Text variant="bodySmall" style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                  Tratamiento:
                </Text>
              </View>
              <Text variant="bodyMedium" style={{ color: colors.text }} numberOfLines={2}>
                {note.tratamiento}
              </Text>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.primary} />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    elevation: 2,
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  vitalChip: {
    height: 24,
  },
  section: {
    marginTop: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionLabel: {
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  diagnosis: {
    fontWeight: '700',
    lineHeight: 22,
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: spacing.sm,
  },
});
