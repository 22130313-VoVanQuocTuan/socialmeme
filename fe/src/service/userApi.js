import api from './api';

export const getUserStats = async (userId) => {
  const response = await api.get(`/users/${userId}/stats`);
  return response.data;
};

export const getUserHistory = async (userId, limit = 50) => {
  const response = await api.get(`/users/${userId}/history?limit=${limit}`);
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/users/me', data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
