export interface Book {
  id?: number;
  title: string;
  genre_id: number;
  author_ids: number[];
  description?: string;
  published_year?: number;
  cover_image?: string;
}

export interface BookWithDetails extends Book {
  genre: Genre;
  authors: Author[];
  reviews?: Review[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Author {
  id: number;
  name: string;
  biography?: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  user_id: number;
  book_id: number;
  user?: User;
  created_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface RecommendedBook {
  id: string;
  title: string;
  authors: string[];
  description: string;
  publishedDate: string;
  thumbnail: string;
  categories: string[];
}