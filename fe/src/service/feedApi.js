// src/services/feedApi.js
import api from './api';

export const getTrendingFeed = async (limit = 20) => {
  const response = await api.get(`/feed/trending?limit=${limit}`);
  return response.data;
};

export const getLatestFeed = async (limit = 20) => {
  const response = await api.get(`/feed/latest?limit=${limit}`);
  return response.data;
};

export const getRecommendedFeed = async (limit = 20) => {
  const response = await api.get(`/feed/recommended?limit=${limit}`);
  return response.data;
};

export const getUserMemes = async (userId, limit = 20) => {
  const response = await api.get(`/feed/user/${userId}?limit=${limit}`);
  return response.data;
};