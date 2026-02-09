import { useEffect } from 'react';
import { useGetMeQuery } from '@/store/api/authApi';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to check authentication status and keep user logged in
 * Usage: Call this hook in protected routes or App component
 */
export function useAuth() {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  
  // Skip the query if there's no token
  const { data, isLoading, isError, error } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    // If there's no token, the user is not authenticated
    if (!token) {
      return;
    }

    // If the query failed (e.g., invalid token), clear storage and redirect to login
    if (isError) {
      console.error('Authentication error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  }, [token, isError, error, navigate]);

  return {
    user: data?.data,
    isLoading,
    isAuthenticated: !!token && !isError,
  };
}
