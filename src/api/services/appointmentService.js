import client from '../client';

export const appointmentService = {
  getAppointments: async (fecha_inicio = '', fecha_fin = '', estado = '', doctor = '') => {
    const params = {};
    if (fecha_inicio) params.fecha_inicio = fecha_inicio;
    if (fecha_fin) params.fecha_fin = fecha_fin;
    if (estado) params.estado = estado;
    if (doctor) params.doctor = doctor;

    const response = await client.get('/api/v1/citas', { params });
    return response.data;
  },

  getAppointment: async (id) => {
    const response = await client.get(`/api/v1/citas/${id}`);
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await client.post('/api/v1/citas', appointmentData);
    return response.data;
  },

  updateAppointment: async (id, appointmentData) => {
    const response = await client.put(`/api/v1/citas/${id}`, appointmentData);
    return response.data;
  },
};
