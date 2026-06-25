import api from './api';

export const getPredictions = async (limit = 50, offset = 0) => {
  const res = await api.get(`/predictions/?limit=${limit}&offset=${offset}`);
  return res.data;
};

export const getPredictionStats = async (days = 7) => {
  const res = await api.get(`/predictions/stats?days=${days}`);
  return res.data;
};
