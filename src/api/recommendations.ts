import api from './index';

export const getRecommendations = async (params: {
  title?: string;
  genre?: string;
  limit?: number;
}) => {
  const response = await api.get('/recommend_books', { params });
  return response.data;
};