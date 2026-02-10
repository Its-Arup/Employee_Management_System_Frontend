import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import type {
  User,
  ApproveUserRequest,
  RejectUserRequest,
  UpdateUserRolesRequest,
  ToggleUserStatusRequest,
  UsersResponse,
  UserResponse,
  PendingUsersResponse,
} from "../types/admin.types";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Users", "PendingUsers"],
  endpoints: (builder) => ({
    // Get all users (Admin/HR)
    getAllUsers: builder.query<
      UsersResponse,
      {
        status?: string;
        role?: string;
        department?: string;
        page?: number;
        limit?: number;
        search?: string;
      }
    >({
      query: (params) => ({
        url: "/users",
        params,
      }),
      providesTags: ["Users"],
    }),

    // Get pending users (Admin/HR)
    getPendingUsers: builder.query<PendingUsersResponse, void>({
      query: () => ({
        url: "/users/pending",
      }),
      providesTags: ["PendingUsers"],
    }),

    // Get user by ID (Admin/HR)
    getUserById: builder.query<UserResponse, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
      }),
      providesTags: ["Users"],
    }),

    // Approve user (Admin/HR)
    approveUser: builder.mutation<UserResponse, { userId: string; data: ApproveUserRequest }>({
      query: ({ userId, data }) => ({
        url: `/users/${userId}/approve`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users", "PendingUsers"],
    }),

    // Reject user (Admin/HR)
    rejectUser: builder.mutation<UserResponse, { userId: string; data: RejectUserRequest }>({
      query: ({ userId, data }) => ({
        url: `/users/${userId}/reject`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users", "PendingUsers"],
    }),

    // Update user (Admin/HR)
    updateUser: builder.mutation<UserResponse, { userId: string; data: Partial<User> }>({
      query: ({ userId, data }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // Update user roles (Admin)
    updateUserRoles: builder.mutation<
      UserResponse,
      { userId: string; data: UpdateUserRolesRequest }
    >({
      query: ({ userId, data }) => ({
        url: `/users/${userId}/roles`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // Toggle user status (Admin/HR)
    toggleUserStatus: builder.mutation<
      UserResponse,
      { userId: string; data: ToggleUserStatusRequest }
    >({
      query: ({ userId, data }) => ({
        url: `/users/${userId}/status`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // Delete user (Admin)
    deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetPendingUsersQuery,
  useGetUserByIdQuery,
  useApproveUserMutation,
  useRejectUserMutation,
  useUpdateUserMutation,
  useUpdateUserRolesMutation,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
} = adminApi;
