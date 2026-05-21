import api from './api';

export const getComments = async (memeId) => {
  const response = await api.get(`/comments/meme/${memeId}`);
  return response.data;
};

export const createComment = async (memeId, content) => {
  const response = await api.post(`/comments/meme/${memeId}?content=${content}`,);
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};
