import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../hooks/useTheme';
import PatientListScreen from '../screens/patients/PatientListScreen';
import PatientDetailScreen from '../screens/patients/PatientDetailScreen';
import PatientFormScreen from '../screens/patients/PatientFormScreen';
import NoteListScreen from '../screens/notes/NoteListScreen';
import NoteDetailScreen from '../screens/notes/NoteDetailScreen';
import NoteFormScreen from '../screens/notes/NoteFormScreen';
import PhotoGalleryScreen from '../screens/photos/PhotoGalleryScreen';
import PhotoViewerScreen from '../screens/photos/PhotoViewerScreen';

const Stack = createStackNavigator();

export default function PatientStackNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="PatientList"
        component={PatientListScreen}
        options={{ title: 'Pacientes' }}
      />
      <Stack.Screen
        name="PatientDetail"
        component={PatientDetailScreen}
        options={{ title: 'Detalle del Paciente' }}
      />
      <Stack.Screen
        name="PatientForm"
        component={PatientFormScreen}
        options={({ route }) => ({
          title: route.params?.patient ? 'Editar Paciente' : 'Nuevo Paciente',
        })}
      />
      <Stack.Screen
        name="NoteList"
        component={NoteListScreen}
        options={{ title: 'Notas Médicas' }}
      />
      <Stack.Screen
        name="NoteDetail"
        component={NoteDetailScreen}
        options={{ title: 'Detalle de Nota' }}
      />
      <Stack.Screen
        name="NoteForm"
        component={NoteFormScreen}
        options={({ route }) => ({
          title: route.params?.note ? 'Editar Nota Médica' : 'Nueva Nota Médica',
        })}
      />
      <Stack.Screen
        name="PhotoGallery"
        component={PhotoGalleryScreen}
        options={{ title: 'Galería de Fotos' }}
      />
      <Stack.Screen
        name="PhotoViewer"
        component={PhotoViewerScreen}
        options={{ title: 'Ver Foto' }}
      />
    </Stack.Navigator>
  );
}
