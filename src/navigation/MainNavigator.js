import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../hooks/useTheme';
import PatientStackNavigator from './PatientStackNavigator';
import AppointmentStackNavigator from './AppointmentStackNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'PatientsTab') {
            iconName = 'account-group';
          } else if (route.name === 'AppointmentsTab') {
            iconName = 'calendar-clock';
          } else if (route.name === 'SettingsTab') {
            iconName = 'cog';
          }

          return (
            <MaterialCommunityIcons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
      })}
    >
      <Tab.Screen
        name="PatientsTab"
        component={PatientStackNavigator}
        options={{ title: 'Pacientes', headerShown: false }}
      />
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentStackNavigator}
        options={{ title: 'Citas', headerShown: false }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{ title: 'Configuración', headerShown: false }}
      />
    </Tab.Navigator>
  );
}
