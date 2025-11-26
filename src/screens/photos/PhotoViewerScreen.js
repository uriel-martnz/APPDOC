import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { Text, IconButton, Card } from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '@env';
import { photoService } from '../../api/services/photoService';
import { useTheme } from '../../hooks/useTheme';
import { formatDateTime } from '../../utils/dateHelpers';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { spacing } from '../../theme/spacing';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function PhotoViewerScreen({ route, navigation }) {
  const { photo, patientId } = route.params;
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: photoService.deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos', patientId] });
      navigation.goBack();
    },
  });

  const getImageUrl = () => {
    if (!photo.url) return null;

    if (photo.url.startsWith('http')) {
      return photo.url;
    }

    const cleanUrl = photo.url.startsWith('/') ? photo.url : `/${photo.url}`;
    return `${API_BASE_URL}${cleanUrl}`;
  };

  const handleDelete = () => {
    setDeleteDialogVisible(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(photo.id_foto);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="delete"
          onPress={handleDelete}
          iconColor={colors.error}
        />
      ),
    });
  }, [navigation, colors]);

  const imageUrl = getImageUrl();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.image, { backgroundColor: colors.surfaceVariant }]}>
            <Text variant="bodyLarge" style={{ color: colors.textSecondary }}>
              No se pudo cargar la imagen
            </Text>
          </View>
        )}

        {(photo.descripcion || photo.created_at) && (
          <Card style={styles.infoCard}>
            <Card.Content>
              {photo.created_at && (
                <View style={styles.infoRow}>
                  <Text variant="labelMedium" style={{ color: colors.textSecondary }}>
                    Fecha:
                  </Text>
                  <Text variant="bodyMedium" style={{ color: colors.text, marginLeft: spacing.sm }}>
                    {formatDateTime(photo.created_at)}
                  </Text>
                </View>
              )}

              {photo.descripcion && (
                <View style={[styles.infoRow, { marginTop: spacing.sm }]}>
                  <Text variant="labelMedium" style={{ color: colors.textSecondary }}>
                    Descripción:
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ color: colors.text, marginLeft: spacing.sm, flex: 1 }}
                  >
                    {photo.descripcion}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Eliminar foto"
        message="¿Estás seguro de que deseas eliminar esta foto? Esta acción no se puede deshacer."
        onConfirm={confirmDelete}
        onDismiss={() => setDeleteDialogVisible(false)}
        confirmText="Eliminar"
        confirmLoading={deleteMutation.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    margin: spacing.md,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
