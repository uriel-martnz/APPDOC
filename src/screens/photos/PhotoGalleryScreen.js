import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { FAB, Portal, Dialog, TextInput, Button } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { photoService } from '../../api/services/photoService';
import { takePhoto, pickImage } from '../../utils/imageHelpers';
import { useTheme } from '../../hooks/useTheme';
import PhotoGrid from '../../components/photo/PhotoGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { spacing } from '../../theme/spacing';

export default function PhotoGalleryScreen({ route, navigation }) {
  const { patientId, patientName } = route.params;
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const [fabOpen, setFabOpen] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [uploading, setUploading] = useState(false);

  const {
    data: photos,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['photos', patientId],
    queryFn: () => photoService.getPatientPhotos(patientId),
  });

  const uploadMutation = useMutation({
    mutationFn: ({ photoUri, desc }) => photoService.uploadPhoto(patientId, photoUri, desc),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos', patientId] });
      setDialogVisible(false);
      setSelectedImageUri(null);
      setDescripcion('');
      setUploading(false);
    },
    onError: (error) => {
      console.error('Error uploading photo:', error);
      setUploading(false);
      Alert.alert('Error', 'No se pudo subir la foto');
    },
  });

  React.useEffect(() => {
    if (patientName) {
      navigation.setOptions({
        title: `Fotos - ${patientName}`,
      });
    }
  }, [patientName, navigation]);

  const handlePhotoPress = (photo) => {
    navigation.navigate('PhotoViewer', { photo, patientId });
  };

  const handleTakePhoto = async () => {
    setFabOpen(false);
    const uri = await takePhoto();
    if (uri) {
      setSelectedImageUri(uri);
      setDialogVisible(true);
    }
  };

  const handlePickImage = async () => {
    setFabOpen(false);
    const uri = await pickImage();
    if (uri) {
      setSelectedImageUri(uri);
      setDialogVisible(true);
    }
  };

  const handleUpload = () => {
    if (!selectedImageUri) return;

    setUploading(true);
    uploadMutation.mutate({
      photoUri: selectedImageUri,
      desc: descripcion.trim(),
    });
  };

  const handleCancelUpload = () => {
    setDialogVisible(false);
    setSelectedImageUri(null);
    setDescripcion('');
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando fotos..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error al cargar fotos"
        message={error.response?.data?.detail || error.message}
        onRetry={refetch}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <PhotoGrid photos={photos} onPhotoPress={handlePhotoPress} />
      </ScrollView>

      <Portal>
        <FAB.Group
          open={fabOpen}
          visible
          icon={fabOpen ? 'close' : 'plus'}
          actions={[
            {
              icon: 'camera',
              label: 'Tomar foto',
              onPress: handleTakePhoto,
            },
            {
              icon: 'image',
              label: 'Seleccionar de galería',
              onPress: handlePickImage,
            },
          ]}
          onStateChange={({ open }) => setFabOpen(open)}
          fabStyle={{ backgroundColor: colors.primary, marginBottom: 60 }}
        />

        <Dialog visible={dialogVisible} onDismiss={handleCancelUpload}>
          <Dialog.Title>Agregar descripción</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Descripción (opcional)"
              value={descripcion}
              onChangeText={setDescripcion}
              mode="outlined"
              multiline
              numberOfLines={3}
              placeholder="Ej: Radiografía de tórax, Examen de sangre, etc."
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCancelUpload} disabled={uploading}>
              Cancelar
            </Button>
            <Button onPress={handleUpload} loading={uploading} disabled={uploading}>
              Subir
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
