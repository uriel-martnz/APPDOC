import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_BASE_URL } from '@env';
import { useTheme } from '../../hooks/useTheme';
import { formatDate } from '../../utils/dateHelpers';
import { spacing } from '../../theme/spacing';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = (SCREEN_WIDTH - spacing.md * 4) / 3;

export default function PhotoGrid({ photos, onPhotoPress }) {
  const { colors } = useTheme();

  const getImageUrl = (photo) => {
    if (!photo.url) return null;

    // Si la URL ya es completa, usarla directamente
    if (photo.url.startsWith('http')) {
      return photo.url;
    }

    // Construir URL completa
    const cleanUrl = photo.url.startsWith('/') ? photo.url : `/${photo.url}`;
    return `${API_BASE_URL}${cleanUrl}`;
  };

  if (!photos || photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons name="image-off" size={64} color={colors.textTertiary} />
        <Text variant="bodyMedium" style={{ color: colors.textSecondary, marginTop: spacing.sm }}>
          No hay fotos
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {photos.map((photo) => {
        const imageUrl = getImageUrl(photo);

        return (
          <TouchableOpacity
            key={photo.id_foto}
            style={[styles.photoContainer, { borderColor: colors.border }]}
            onPress={() => onPhotoPress(photo)}
            activeOpacity={0.7}
          >
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.photo}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.photo, { backgroundColor: colors.surfaceVariant }]}>
                <MaterialCommunityIcons name="image-broken" size={32} color={colors.textTertiary} />
              </View>
            )}

            {photo.descripcion && (
              <View style={[styles.descriptionOverlay, { backgroundColor: colors.backdrop }]}>
                <Text variant="bodySmall" style={styles.descriptionText} numberOfLines={2}>
                  {photo.descripcion}
                </Text>
              </View>
            )}

            {photo.created_at && (
              <View style={[styles.dateOverlay, { backgroundColor: colors.backdrop }]}>
                <Text variant="labelSmall" style={styles.dateText}>
                  {formatDate(photo.created_at)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.xs,
  },
  photoContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: spacing.xs,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  photo: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xs,
  },
  descriptionText: {
    color: '#fff',
    fontSize: 11,
  },
  dateOverlay: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dateText: {
    color: '#fff',
    fontSize: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
});
