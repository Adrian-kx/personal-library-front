import api from './index';
import { Review } from '../types/book';

export const getReviews = async () => {
  const response = await api.get('/reviews');
  return response.data;
};

export const getReviewById = async (id: number) => {
  const response = await api.get(`/reviews/${id}`);
  return response.data;
};

export const createReview = async (review: Review) => {
  const response = await api.post('/reviews', review);
  return response.data;
};

export const updateReview = async (id: number, review: Review) => {
  const response = await api.put(`/reviews/${id}`, review);
  return response.data;
};

export const deleteReview = async (id: number) => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};

export const getReviewsByBookId = async (bookId: number) => {
  const response = await api.get(`/books/${bookId}/reviews`);
  return response.data;
};