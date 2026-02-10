import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import type {
  ApplyLeaveRequest,
  ApproveLeaveRequest,
  RejectLeaveRequest,
  LeavesResponse,
  LeaveResponse,
  LeaveBalanceResponse,
  LeaveStatisticsResponse,
} from "../types/leave.types";

export const leaveApi = createApi({
  reducerPath: "leaveApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Leaves", "LeaveBalance", "LeaveStatistics"],
  endpoints: (builder) => ({
    // Apply for leave (Employee)
    applyLeave: builder.mutation<LeaveResponse, ApplyLeaveRequest>({
      query: (data) => ({
        url: "/leaves",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Leaves", "LeaveBalance"],
    }),

    // Get my leaves (Employee)
    getMyLeaves: builder.query<
      LeavesResponse,
      { status?: string; startDate?: string; endDate?: string; page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/leaves/my-leaves",
        params,
      }),
      providesTags: ["Leaves"],
    }),

    // Get my leave balance (Employee)
    getMyLeaveBalance: builder.query<LeaveBalanceResponse, { year?: number }>({
      query: (params) => ({
        url: "/leaves/my-balance",
        params,
      }),
      providesTags: ["LeaveBalance"],
    }),

    // Cancel leave (Employee)
    cancelLeave: builder.mutation<LeaveResponse, string>({
      query: (leaveId) => ({
        url: `/leaves/${leaveId}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: ["Leaves", "LeaveBalance"],
    }),

    // Get all leaves (Admin/Manager)
    getAllLeaves: builder.query<
      LeavesResponse,
      {
        status?: string;
        leaveType?: string;
        startDate?: string;
        endDate?: string;
        userId?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: (params) => ({
        url: "/leaves",
        params,
      }),
      providesTags: ["Leaves"],
    }),

    // Get pending leaves (Admin/Manager)
    getPendingLeaves: builder.query<LeavesResponse, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/leaves/pending",
        params,
      }),
      providesTags: ["Leaves"],
    }),

    // Get leave by ID
    getLeaveById: builder.query<LeaveResponse, string>({
      query: (leaveId) => ({
        url: `/leaves/${leaveId}`,
      }),
      providesTags: ["Leaves"],
    }),

    // Approve leave (Admin/Manager)
    approveLeave: builder.mutation<LeaveResponse, { leaveId: string; data: ApproveLeaveRequest }>({
      query: ({ leaveId, data }) => ({
        url: `/leaves/${leaveId}/approve`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Leaves", "LeaveStatistics"],
    }),

    // Reject leave (Admin/Manager)
    rejectLeave: builder.mutation<LeaveResponse, { leaveId: string; data: RejectLeaveRequest }>({
      query: ({ leaveId, data }) => ({
        url: `/leaves/${leaveId}/reject`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Leaves", "LeaveStatistics"],
    }),

    // Get leave statistics
    getLeaveStatistics: builder.query<
      LeaveStatisticsResponse,
      { userId?: string; year?: number }
    >({
      query: (params) => ({
        url: "/leaves/statistics",
        params,
      }),
      providesTags: ["LeaveStatistics"],
    }),

    // Get user leave balance (Admin/HR)
    getUserLeaveBalance: builder.query<LeaveBalanceResponse, { userId: string; year?: number }>({
      query: ({ userId, year }) => ({
        url: `/leaves/user/${userId}/balance`,
        params: { year },
      }),
      providesTags: ["LeaveBalance"],
    }),
  }),
});

export const {
  useApplyLeaveMutation,
  useGetMyLeavesQuery,
  useGetMyLeaveBalanceQuery,
  useCancelLeaveMutation,
  useGetAllLeavesQuery,
  useGetPendingLeavesQuery,
  useGetLeaveByIdQuery,
  useApproveLeaveMutation,
  useRejectLeaveMutation,
  useGetLeaveStatisticsQuery,
  useGetUserLeaveBalanceQuery,
} = leaveApi;
