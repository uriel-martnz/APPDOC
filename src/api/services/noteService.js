import client from '../client';

export const noteService = {
  // Obtener notas de un paciente específico
  getPatientNotes: async (pacienteId) => {
    const response = await client.get(`/api/v1/pacientes/${pacienteId}/notas`);
    return response.data;
  },

  // Obtener una nota por ID
  getNote: async (noteId) => {
    const response = await client.get(`/api/v1/notas/${noteId}`);
    return response.data;
  },

  // Crear nueva nota
  createNote: async (noteData) => {
    const { paciente_id, ...restData } = noteData;
    const response = await client.post(`/api/v1/pacientes/${paciente_id}/notas`, restData);
    return response.data;
  },

  // Actualizar nota existente
  updateNote: async (noteId, noteData) => {
    const { paciente_id, ...restData } = noteData;
    const response = await client.put(`/api/v1/notas/${noteId}`, restData);
    return response.data;
  },

  // Eliminar nota
  deleteNote: async (noteId) => {
    const response = await client.delete(`/api/v1/notas/${noteId}`);
    return response.data;
  },
};
