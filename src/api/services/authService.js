import client from '../client';

export const authService = {
  login: async (email, contrasena) => {
    const response = await client.post('/api/v1/auth/login', { email, contrasena });
    return response.data;
  },

  register: async (nombre, email, contrasena, rol = 'medico') => {
    const response = await client.post('/api/v1/auth/register', {
      nombre,
      email,
      contrasena,
      rol,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await client.get('/api/v1/auth/me');
    return response.data;
  },

  updateMe: async (data) => {
    const response = await client.put('/api/v1/auth/me', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await client.put('/api/v1/auth/change-password', data);
    return response.data;
  },

  logout: async () => {
    await client.post('/api/v1/auth/logout');
  },
};
