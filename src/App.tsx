import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import BookListPage from './pages/books/BookListPage';
import BookDetailPage from './pages/books/BookDetailPage';
import BookFormPage from './pages/books/BookFormPage';
import AuthorListPage from './pages/authors/AuthorListPage';
import AuthorFormPage from './pages/authors/AuthorFormPage';
import GenreListPage from './pages/genres/GenreListPage';
import GenreFormPage from './pages/genres/GenreFormPage';
import UserListPage from './pages/users/UserListPage';
import UserFormPage from './pages/users/UserFormPage';
import ReviewListPage from './pages/reviews/ReviewListPage';
import ReviewFormPage from './pages/reviews/ReviewFormPage';
import RecommendationsPage from './pages/recommendations/RecommendationsPage';

const { defaultAlgorithm, darkAlgorithm } = theme;

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            
            {/* Books Routes */}
            <Route path="books" element={<BookListPage />} />
            <Route path="books/new" element={<BookFormPage />} />
            <Route path="books/:id" element={<BookDetailPage />} />
            <Route path="books/:id/edit" element={<BookFormPage />} />
            <Route path="books/:bookId/reviews/new" element={<ReviewFormPage />} />
            
            {/* Authors Routes */}
            <Route path="authors" element={<AuthorListPage />} />
            <Route path="authors/new" element={<AuthorFormPage />} />
            <Route path="authors/:id/edit" element={<AuthorFormPage />} />
            
            {/* Genres Routes */}
            <Route path="genres" element={<GenreListPage />} />
            <Route path="genres/new" element={<GenreFormPage />} />
            <Route path="genres/:id/edit" element={<GenreFormPage />} />
            
            {/* Users Routes */}
            <Route path="users" element={<UserListPage />} />
            <Route path="users/new" element={<UserFormPage />} />
            <Route path="users/:id/edit" element={<UserFormPage />} />
            
            {/* Reviews Routes */}
            <Route path="reviews" element={<ReviewListPage />} />
            <Route path="reviews/new" element={<ReviewFormPage />} />
            <Route path="reviews/:id/edit" element={<ReviewFormPage />} />
            
            {/* Recommendations Route */}
            <Route path="recommendations" element={<RecommendationsPage />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/\" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;