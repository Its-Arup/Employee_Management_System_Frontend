import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import type {
  RegisterRequest,
  RegisterResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "../types/auth.types";

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
