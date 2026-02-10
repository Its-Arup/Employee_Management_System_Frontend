// User model
export interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  roles: string[];
  status: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: string;
  isEmailVerified: boolean;
}

// Registration
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

// OTP Verification
export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
  token?: string;
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

// Get current user
export interface MeResponse {
  status: number;
  success: boolean;
  message: string;
  data: User;
}

// User Profile
export interface UserProfileResponse {
  status: number;
  success: boolean;
  message: string;
  data: User;
}

// Refresh token
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
