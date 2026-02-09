import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base URL for your API
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Define types for the API requests and responses
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: string;
}

export interface RegisterResponse {
  message: string;
  userId?: string;
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    username: string;
  };
}

// Create the API slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // Add authorization token if available
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    // Register mutation
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/users/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    // Verify OTP mutation
    verifyOTP: builder.mutation<VerifyOTPResponse, VerifyOTPRequest>({
      query: (data) => ({
        url: '/users/verify-email',
        method: 'POST',
        body: data,
      }),
    }),
    // Resend OTP mutation
    resendOTP: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: '/users/resend-verification',
        method: 'POST',
        body: data,
      }),
    }),
    // Login mutation
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useRegisterMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useLoginMutation,
} = authApi;
