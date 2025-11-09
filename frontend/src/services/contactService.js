import apiClient from './apiClient.js';

export const getContacts = async () => {
  const { data } = await apiClient.get('/contacts');
  return data.contacts;
};

export const createContact = async (payload) => {
  const { data } = await apiClient.post('/contacts', payload);
  return data.contact;
};

export const updateContact = async (id, payload) => {
  const { data } = await apiClient.put(`/contacts/${id}`, payload);
  return data.contact;
};

export const deleteContact = async (id) => {
  await apiClient.delete(`/contacts/${id}`);
};
