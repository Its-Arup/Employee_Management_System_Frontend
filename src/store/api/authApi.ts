import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base URL for your API
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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
  status: number;
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      displayName: string;
      roles: string[];
      status: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  roles: string[];
  status: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: string;
}

export interface MeResponse {
  status: number;
  success: boolean;
  message: string;
  data: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// Base query with automatic token refresh
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 error, try to refresh the token
  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const data = refreshResult.data as RefreshTokenResponse;
        
        // Store the new tokens
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);

        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    } else {
      // No refresh token available
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
  }

  return result;
};

// Create the API slice
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    // Register mutation
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (credentials) => ({
        url: "/users/register",
        method: "POST",
        body: credentials,
      }),
    }),
    // Verify OTP mutation
    verifyOTP: builder.mutation<VerifyOTPResponse, VerifyOTPRequest>({
      query: (data) => ({
        url: "/users/verify-email",
        method: "POST",
        body: data,
      }),
    }),
    // Resend OTP mutation
    resendOTP: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/users/resend-verification",
        method: "POST",
        body: data,
      }),
    }),
    // Login mutation
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    // Get current user query
    getMe: builder.query<MeResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
    // Refresh token mutation
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (data) => ({
        url: "/auth/refresh",
        method: "POST",
        body: data,
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
  useGetMeQuery,
  useRefreshTokenMutation,
} = authApi;
