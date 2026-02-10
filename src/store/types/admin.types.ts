// Admin/User Management Types
export interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  roles: ('employee' | 'admin' | 'hr' | 'manager')[];
  status: 'pending' | 'active' | 'rejected' | 'suspended';
  dateOfBirth?: string;
  profilePictureUrl?: string;
  designation?: string;
  department?: string;
  phoneNumber?: string;
  address?: string;
  joiningDate?: string;
  employeeId?: string;
  approvedBy?: {
    _id: string;
    displayName: string;
  };
  approvedAt?: string;
  rejectionReason?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApproveUserRequest {
  roles: ('employee' | 'admin' | 'hr' | 'manager')[];
  employeeId?: string;
  designation?: string;
  department?: string;
  joiningDate?: string;
}

export interface RejectUserRequest {
  reason: string;
}

export interface UpdateUserRolesRequest {
  roles: ('employee' | 'admin' | 'hr' | 'manager')[];
}

export interface ToggleUserStatusRequest {
  status: 'active' | 'suspended';
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface PendingUsersResponse {
  success: boolean;
  message: string;
  data: User[];
}
