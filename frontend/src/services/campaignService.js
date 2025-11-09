import apiClient from './apiClient.js';

export const getCampaigns = async () => {
  const { data } = await apiClient.get('/campaigns');
  return data.campaigns;
};

export const getCampaign = async (id) => {
  const { data } = await apiClient.get(`/campaigns/${id}`);
  return data.campaign;
};

export const createCampaign = async (payload) => {
  const { data } = await apiClient.post('/campaigns', payload);
  return data.campaign;
};

export const updateCampaignStatus = async (id, status) => {
  const { data } = await apiClient.patch(`/campaigns/${id}/status`, { status });
  return data.campaign;
};
