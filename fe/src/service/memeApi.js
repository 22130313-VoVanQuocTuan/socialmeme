// src/services/memeApi.js
import api from './api';

export const createMeme = async (caption, imageFile) => {
  const formData = new FormData();
  formData.append('caption', caption);
  formData.append('file', imageFile);
  
  const response = await api.post('/memes/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getMeme = async (id) => {
  const response = await api.get(`/memes/${id}`);
  return response.data;
};

export const deleteMeme = async (id) => {
  const response = await api.delete(`/memes/${id}`);
  return response.data;
};

export const likeMeme = async (id) => {
  const response = await api.post(`/likes/${id}/toggle`);
  return response.data;
};

export const shareMeme = async (id, platform) => {
  const response = await api.post(`/shares/${id}`, { platform });
  return response.data;
};