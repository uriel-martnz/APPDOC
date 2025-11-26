import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  getToken: async () => {
    return await AsyncStorage.getItem('token');
  },

  setToken: async (token) => {
    await AsyncStorage.setItem('token', token);
  },

  removeToken: async () => {
    await AsyncStorage.removeItem('token');
  },

  getUser: async () => {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setUser: async (user) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },

  removeUser: async () => {
    await AsyncStorage.removeItem('user');
  },
};
