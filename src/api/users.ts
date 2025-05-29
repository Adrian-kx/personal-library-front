import api from './index';
import { User } from '../types/book';

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id: number) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: User) => {
  const response = await api.post('/users', user);
  return response.data;
};

export const updateUser = async (id: number, user: User) => {
  const response = await api.put(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};