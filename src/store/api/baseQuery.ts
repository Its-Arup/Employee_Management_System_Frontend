import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RefreshTokenResponse } from "../types/auth.types";

// Define the base URL for your API
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Base query with automatic token refresh
export const baseQueryWithReauth = async (
  args: any,
  api: any,
  extraOptions: any
) => {
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
