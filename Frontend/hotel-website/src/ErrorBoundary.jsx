import React from 'react';
import { useRouteError } from 'react-router-dom';

function ErrorBoundary() {
  const error = useRouteError();
  console.error('ErrorBoundary caught:', error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-4">{error.message || 'An unexpected error occurred.'}</p>
        <a href="/" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Go to Home
        </a>
      </div>
    </div>
  );
}

export default ErrorBoundary;