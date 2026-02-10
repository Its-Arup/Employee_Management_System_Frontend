// Leave Types
export interface Leave {
  _id: string;
  userId: {
    _id: string;
    displayName: string;
    email: string;
    employeeId?: string;
    department?: string;
    designation?: string;
  };
  leaveType: 'casual' | 'sick' | 'paid' | 'unpaid' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reviewedBy?: {
    _id: string;
    displayName: string;
    email: string;
    employeeId?: string;
  };
  reviewedAt?: string;
  reviewRemarks?: string;
  attachments?: string[];
  isHalfDay: boolean;
  halfDayPeriod?: 'first-half' | 'second-half';
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  _id: string;
  userId: string;
  year: number;
  casual: {
    total: number;
    used: number;
    remaining: number;
  };
  sick: {
    total: number;
    used: number;
    remaining: number;
  };
  paid: {
    total: number;
    used: number;
    remaining: number;
  };
  unpaid: {
    used: number;
  };
  carryForward?: {
    casual: number;
    sick: number;
    paid: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApplyLeaveRequest {
  leaveType: 'casual' | 'sick' | 'paid' | 'unpaid' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  reason: string;
  isHalfDay?: boolean;
  halfDayPeriod?: 'first-half' | 'second-half';
  attachments?: string[];
}

export interface ApproveLeaveRequest {
  remarks?: string;
}

export interface RejectLeaveRequest {
  remarks: string;
}

export interface LeavesResponse {
  success: boolean;
  message: string;
  data: {
    leaves: Leave[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface LeaveResponse {
  success: boolean;
  message: string;
  data: Leave;
}

export interface LeaveBalanceResponse {
  success: boolean;
  message: string;
  data: LeaveBalance;
}

export interface LeaveStatistics {
  pending: { count: number; totalDays: number };
  approved: { count: number; totalDays: number };
  rejected: { count: number; totalDays: number };
  cancelled: { count: number; totalDays: number };
}

export interface LeaveStatisticsResponse {
  success: boolean;
  message: string;
  data: LeaveStatistics;
}
