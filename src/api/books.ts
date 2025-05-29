import api from './index';
import { Book } from '../types/book';

export const getBooks = async () => {
  const response = await api.get('/books');
  return response.data;
};

export const getBookById = async (id: number) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const createBook = async (book: Book) => {
  const response = await api.post('/books', book);
  return response.data;
};

export const updateBook = async (id: number, book: Book) => {
  const response = await api.put(`/books/${id}`, book);
  return response.data;
};

export const deleteBook = async (id: number) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};