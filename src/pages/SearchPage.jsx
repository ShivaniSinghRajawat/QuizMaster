
import React from 'react';
import { Navigate } from 'react-router-dom';

// This page is no longer used in the Quiz Maker app. Redirect to home.
const SearchPage = () => {
  return <Navigate to="/" replace />;
};

export default SearchPage;
  