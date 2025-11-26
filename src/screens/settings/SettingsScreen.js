import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Switch, Button, Divider, Card, Text } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { patientService } from '../../api/services/patientService';
import { appointmentService } from '../../api/services/appointmentService';
import { spacing } from '../../theme/spacing';

export default function SettingsScreen({ navigation }) {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { logout, user } = useAuth();

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientService.getPatients(),
  });

  const { data: appointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentService.getAppointments(),
  });

  const totalPatients = patients?.length || 0;
  const totalAppointments = appointments?.length || 0;
  const upcomingAppointments = appointments?.filter(apt => apt.estado === 'programada').length || 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: colors.text, marginBottom: spacing.md }}>
              Resumen General
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={{ color: colors.primary, fontWeight: 'bold' }}>
                  {totalPatients}
                </Text>
                <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
                  Pacientes
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={{ color: colors.primary, fontWeight: 'bold' }}>
                  {upcomingAppointments}
                </Text>
                <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
                  Citas Pendientes
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="headlineMedium" style={{ color: colors.primary, fontWeight: 'bold' }}>
                  {totalAppointments}
                </Text>
                <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
                  Total Citas
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      <List.Section>
        <List.Subheader>Apariencia</List.Subheader>
        <List.Item
          title="Modo Oscuro"
          description="Alternar entre tema claro y oscuro"
          left={props => <List.Icon {...props} icon="brightness-6" />}
          right={() => <Switch value={isDarkMode} onValueChange={toggleTheme} />}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Cuenta</List.Subheader>
        <List.Item
          title="Mi Perfil"
          description="Ver y editar información personal"
          left={props => <List.Icon {...props} icon="account-circle" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('Profile')}
        />
        <List.Item
          title="Cambiar Contraseña"
          description="Actualizar contraseña de acceso"
          left={props => <List.Icon {...props} icon="key" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('ChangePassword')}
        />
        <List.Item
          title={user?.nombre || 'Usuario'}
          description={user?.email || ''}
          left={props => <List.Icon {...props} icon="account" />}
          disabled
        />
        <List.Item
          title="Rol"
          description={user?.rol || 'Médico'}
          left={props => <List.Icon {...props} icon="badge-account" />}
          disabled
        />
      </List.Section>

      <Divider />

      <View style={styles.logoutContainer}>
        <Button
          mode="contained"
          onPress={logout}
          icon="logout"
          buttonColor={colors.error}
        >
          Cerrar Sesión
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    padding: spacing.md,
  },
  statsCard: {
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  logoutContainer: {
    padding: spacing.lg,
    marginTop: spacing.md,
  },
});
