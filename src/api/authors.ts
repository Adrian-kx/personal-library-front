import api from './index';
import { Author } from '../types/book';

export const getAuthors = async () => {
  const response = await api.get('/authors');
  return response.data;
};

export const getAuthorById = async (id: number) => {
  const response = await api.get(`/authors/${id}`);
  return response.data;
};

export const createAuthor = async (author: Author) => {
  const response = await api.post('/authors', author);
  return response.data;
};

export const updateAuthor = async (id: number, author: Author) => {
  const response = await api.put(`/authors/${id}`, author);
  return response.data;
};

export const deleteAuthor = async (id: number) => {
  const response = await api.delete(`/authors/${id}`);
  return response.data;
};