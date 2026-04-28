// frontend/src/services/viewApi.js
import api from './api';

export const trackView = async (memeId, duration = 0) => {
  try {
    const response = await api.post(`/views/${memeId}/track`, null, {
      params: { duration }
    });
    return response.data;
  } catch (error) {
    console.error('Track view error:', error);
    return null;
  }
};