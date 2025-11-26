import client from '../client';

export const patientService = {
  getPatients: async (search = '', estado = '') => {
    const params = {};
    if (search) params.search = search;
    if (estado) params.estado = estado;

    const response = await client.get('/api/v1/pacientes', { params });
    return response.data;
  },

  getPatient: async (id) => {
    const response = await client.get(`/api/v1/pacientes/${id}`);
    return response.data;
  },

  createPatient: async (patientData) => {
    const response = await client.post('/api/v1/pacientes', patientData);
    return response.data;
  },

  updatePatient: async (id, patientData) => {
    const response = await client.put(`/api/v1/pacientes/${id}`, patientData);
    return response.data;
  },
};
