import client from '../client';

export const photoService = {
  // Obtener fotos de un paciente
  getPatientPhotos: async (pacienteId) => {
    const response = await client.get(`/api/v1/pacientes/${pacienteId}/fotos`);
    return response.data;
  },

  // Subir foto
  uploadPhoto: async (pacienteId, photoUri, descripcion = '') => {
    const formData = new FormData();

    // Obtener el nombre del archivo y extensión
    const uriParts = photoUri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('file', {
      uri: photoUri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    if (descripcion) {
      formData.append('descripcion', descripcion);
    }

    const response = await client.post(
      `/api/v1/pacientes/${pacienteId}/fotos`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  // Eliminar foto
  deletePhoto: async (photoId) => {
    const response = await client.delete(`/api/v1/fotos/${photoId}`);
    return response.data;
  },
};
