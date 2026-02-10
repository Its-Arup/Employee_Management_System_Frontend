import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import type {
  Salary,
  CreateSalaryRequest,
  UpdateSalaryStatusRequest,
  ProcessSalaryPaymentRequest,
  BulkGenerateSalaryRequest,
  SalariesResponse,
  SalaryResponse,
  SalaryStatisticsResponse,
  BulkGenerateResponse,
} from "../types/salary.types";

export const salaryApi = createApi({
  reducerPath: "salaryApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Salaries", "SalaryStatistics"],
  endpoints: (builder) => ({
    // Get my salaries (Employee)
    getMySalaries: builder.query<
      SalariesResponse,
      { year?: number; month?: number; page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/salaries/my-salaries",
        params,
      }),
      providesTags: ["Salaries"],
    }),

    // Get salary by ID
    getSalaryById: builder.query<SalaryResponse, string>({
      query: (salaryId) => ({
        url: `/salaries/${salaryId}`,
      }),
      providesTags: ["Salaries"],
    }),

    // Create salary record (Admin/HR)
    createSalary: builder.mutation<SalaryResponse, CreateSalaryRequest>({
      query: (data) => ({
        url: "/salaries",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Salaries", "SalaryStatistics"],
    }),

    // Generate bulk salaries (Admin/HR)
    generateBulkSalaries: builder.mutation<BulkGenerateResponse, BulkGenerateSalaryRequest>({
      query: (data) => ({
        url: "/salaries/bulk-generate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Salaries", "SalaryStatistics"],
    }),

    // Get all salaries (Admin/HR)
    getAllSalaries: builder.query<
      SalariesResponse,
      {
        userId?: string;
        year?: number;
        month?: number;
        status?: string;
        department?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: (params) => ({
        url: "/salaries",
        params,
      }),
      providesTags: ["Salaries"],
    }),

    // Get salary statistics (Admin/HR)
    getSalaryStatistics: builder.query<
      SalaryStatisticsResponse,
      { year?: number; department?: string }
    >({
      query: (params) => ({
        url: "/salaries/statistics",
        params,
      }),
      providesTags: ["SalaryStatistics"],
    }),

    // Update salary status (Admin/HR)
    updateSalaryStatus: builder.mutation<
      SalaryResponse,
      { salaryId: string; data: UpdateSalaryStatusRequest }
    >({
      query: ({ salaryId, data }) => ({
        url: `/salaries/${salaryId}/status`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Salaries", "SalaryStatistics"],
    }),

    // Process salary payment (Admin/HR)
    processSalaryPayment: builder.mutation<
      SalaryResponse,
      { salaryId: string; data: ProcessSalaryPaymentRequest }
    >({
      query: ({ salaryId, data }) => ({
        url: `/salaries/${salaryId}/process-payment`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Salaries", "SalaryStatistics"],
    }),

    // Update salary record (Admin/HR)
    updateSalary: builder.mutation<SalaryResponse, { salaryId: string; data: Partial<Salary> }>({
      query: ({ salaryId, data }) => ({
        url: `/salaries/${salaryId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Salaries", "SalaryStatistics"],
    }),

    // Delete salary record (Admin)
    deleteSalary: builder.mutation<{ success: boolean; message: string }, string>({
      query: (salaryId) => ({
        url: `/salaries/${salaryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Salaries", "SalaryStatistics"],
    }),
  }),
});

export const {
  useGetMySalariesQuery,
  useGetSalaryByIdQuery,
  useCreateSalaryMutation,
  useGenerateBulkSalariesMutation,
  useGetAllSalariesQuery,
  useGetSalaryStatisticsQuery,
  useUpdateSalaryStatusMutation,
  useProcessSalaryPaymentMutation,
  useUpdateSalaryMutation,
  useDeleteSalaryMutation,
} = salaryApi;
