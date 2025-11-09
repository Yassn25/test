import apiClient from './apiClient.js';

export const register = async (payload) => {
  const { data } = await apiClient.post('/auth/register', payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await apiClient.post('/auth/login', payload);
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await apiClient.get('/auth/me');
  return data;
};
