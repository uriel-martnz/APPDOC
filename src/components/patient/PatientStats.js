import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';

export default function PatientStats({ appointmentCount = 0, noteCount = 0, photoCount = 0 }) {
  const { colors } = useTheme();

  const StatItem = ({ icon, label, count }) => (
    <View style={styles.statItem}>
      <MaterialCommunityIcons name={icon} size={32} color={colors.primary} />
      <Text variant="headlineSmall" style={[styles.count, { color: colors.text }]}>
        {count}
      </Text>
      <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
        {label}
      </Text>
    </View>
  );

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.statsContainer}>
          <StatItem icon="calendar-clock" label="Citas" count={appointmentCount} />
          <StatItem icon="text-box" label="Notas" count={noteCount} />
          <StatItem icon="image" label="Fotos" count={photoCount} />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: spacing.md,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  count: {
    marginTop: spacing.xs,
    fontWeight: 'bold',
  },
});
