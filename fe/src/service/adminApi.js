import api from './api';

const adminApi = {
  getAllUsers: (skip = 0, limit = 100) => {
    return api.get(`/admin/users?skip=${skip}&limit=${limit}`);
  },
  toggleUserStatus: (userId) => {
    return api.put(`/admin/users/${userId}/toggle`);
  },
  getDashboardStats: () => {
    return api.get('/admin/dashboard');
  },
  getAllMemes: (skip = 0, limit = 100) => {
    return api.get(`/admin/memes?skip=${skip}&limit=${limit}`);
  },
  toggleMemeStatus: (memeId) => {
    return api.put(`/admin/memes/${memeId}/toggle-status`);
  }
};

export default adminApi;