import api from './index';
import { Genre } from '../types/book';

export const getGenres = async () => {
  const response = await api.get('/genres');
  return response.data;
};

export const getGenreById = async (id: number) => {
  const response = await api.get(`/genres/${id}`);
  return response.data;
};

export const createGenre = async (genre: Genre) => {
  const response = await api.post('/genres', genre);
  return response.data;
};

export const updateGenre = async (id: number, genre: Genre) => {
  const response = await api.put(`/genres/${id}`, genre);
  return response.data;
};

export const deleteGenre = async (id: number) => {
  const response = await api.delete(`/genres/${id}`);
  return response.data;
};