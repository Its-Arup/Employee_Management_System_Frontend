// Salary Types
export interface SalaryStructure {
  basic: number;
  hra: number;
  medicalAllowance?: number;
  transportAllowance?: number;
  otherAllowances?: number;
  bonus?: number;
  providentFund?: number;
  professionalTax?: number;
  incomeTax?: number;
  otherDeductions?: number;
}

export interface Salary {
  _id: string;
  userId: {
    _id: string;
    displayName: string;
    email: string;
    employeeId?: string;
    department?: string;
    designation?: string;
  };
  month: number;
  year: number;
  structure: SalaryStructure;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid' | 'on-hold';
  creditDate?: string;
  actualCreditDate?: string;
  paymentMethod?: 'bank-transfer' | 'cheque' | 'cash';
  transactionId?: string;
  remarks?: string;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  absentDays: number;
  isProrated: boolean;
  createdBy: {
    _id: string;
    displayName: string;
    email: string;
  };
  processedBy?: {
    _id: string;
    displayName: string;
    email: string;
  };
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalaryRequest {
  userId: string;
  month: number;
  year: number;
  structure: SalaryStructure;
  workingDays: number;
  presentDays: number;
  leaveDays: number;
  absentDays: number;
  isProrated?: boolean;
  creditDate?: string;
  remarks?: string;
}

export interface UpdateSalaryStatusRequest {
  status: 'pending' | 'processed' | 'paid' | 'on-hold';
}

export interface ProcessSalaryPaymentRequest {
  paymentMethod: 'bank-transfer' | 'cheque' | 'cash';
  transactionId?: string;
  actualCreditDate?: string;
  remarks?: string;
}

export interface BulkGenerateSalaryRequest {
  month: number;
  year: number;
  department?: string;
}

export interface SalariesResponse {
  success: boolean;
  message: string;
  data: {
    salaries: Salary[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface SalaryResponse {
  success: boolean;
  message: string;
  data: Salary;
}

export interface SalaryStatistics {
  byStatus: {
    pending: { count: number; totalAmount: number };
    processed: { count: number; totalAmount: number };
    paid: { count: number; totalAmount: number };
    'on-hold': { count: number; totalAmount: number };
  };
  byMonth: Array<{
    month: number;
    count: number;
    totalAmount: number;
    avgSalary: number;
  }>;
}

export interface SalaryStatisticsResponse {
  success: boolean;
  message: string;
  data: SalaryStatistics;
}

export interface BulkGenerateResponse {
  success: boolean;
  message: string;
  data: {
    success: string[];
    failed: Array<{ userId: string; reason: string }>;
  };
}
