import { useParams, useNavigate } from 'react-router-dom';
import { useGetSalaryByIdQuery, useUpdateSalaryStatusMutation } from '@/store/api/salaryApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User, Calendar, DollarSign } from 'lucide-react';
import { formatDate } from '@/helper/formatDate';
import { toast } from 'sonner';

export function SalaryDetailPage() {
  const { salaryId } = useParams<{ salaryId: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useGetSalaryByIdQuery(salaryId!);
  const [updateSalaryStatus] = useUpdateSalaryStatusMutation();

  const salary = data?.data;
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateSalaryStatus({
        salaryId: salaryId!,
        data: { status: newStatus as any },
      }).unwrap();
      toast.success('Status Updated', {
        description: 'Salary status has been updated successfully.',
      });
    } catch (error: any) {
      toast.error('Failed to update status', {
        description: error.data?.message || 'An error occurred.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading salary details...</p>
        </div>
      </div>
    );
  }

  if (!salary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Salary record not found</p>
            <Button
              onClick={() => navigate('/admin/salaries')}
              className="mt-4 cursor-pointer"
            >
              Back to Salaries
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/salaries')}
            className="cursor-pointer text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-primary">Salary Details</h1>
            <p className="text-muted-foreground text-sm">
              {monthNames[salary.month - 1]} {salary.year}
            </p>
          </div>
          <StatusBadge status={salary.status} />
        </div>
      </header>

      <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
        {/* Employee Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Employee Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{salary.userId?.displayName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-medium">{salary.userId?.employeeId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{salary.userId?.email || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary Period & Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Period & Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Period</p>
                <p className="font-medium">
                  {monthNames[salary.month - 1]} {salary.year}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Select
                  value={salary.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {salary.creditDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Credit Date</p>
                  <p className="font-medium">{formatDate(salary.creditDate)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Details */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Working Days</p>
                <p className="text-2xl font-bold">{salary.workingDays}</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Present Days</p>
                <p className="text-2xl font-bold">{salary.presentDays}</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Leave Days</p>
                <p className="text-2xl font-bold">{salary.leaveDays || 0}</p>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Absent Days</p>
                <p className="text-2xl font-bold">{salary.absentDays || 0}</p>
              </div>
            </div>
            {salary.isProrated && (
              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                  ⚠️ This is a prorated salary based on attendance
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Earnings</CardTitle>
              <CardDescription>Salary components breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Basic Salary:</span>
                <span className="font-medium">₹{salary.structure.basic.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>HRA:</span>
                <span className="font-medium">₹{salary.structure.hra.toLocaleString()}</span>
              </div>
              {(salary.structure.medicalAllowance ?? 0) > 0 && (
                <div className="flex justify-between">
                  <span>Medical Allowance:</span>
                  <span className="font-medium">₹{salary.structure.medicalAllowance?.toLocaleString()}</span>
                </div>
              )}
              {(salary.structure.transportAllowance ?? 0) > 0 && (
                <div className="flex justify-between">
                  <span>Transport Allowance:</span>
                  <span className="font-medium">₹{salary.structure.transportAllowance?.toLocaleString()}</span>
                </div>
              )}
              {(salary.structure.otherAllowances ?? 0) > 0 && (
                <div className="flex justify-between">
                  <span>Other Allowances:</span>
                  <span className="font-medium">₹{salary.structure.otherAllowances?.toLocaleString()}</span>
                </div>
              )}
              {(salary.structure.bonus ?? 0) > 0 && (
                <div className="flex justify-between">
                  <span>Bonus:</span>
                  <span className="font-medium">₹{salary.structure.bonus?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-3 border-t text-lg">
                <span>Gross Salary:</span>
                <span className="text-green-600">₹{salary.grossSalary.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Deductions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Deductions</CardTitle>
              <CardDescription>Deductions breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(salary.structure.providentFund ?? 0) > 0 && (
                <div className="flex justify-between">
                  <span>Provident Fund:</span>
                  <span className="font-medium">₹{salary.structure.providentFund?.toLocaleString()}</span>
                </div>
              )}
              {(salary.structure.professionalTax ?? 0) > 0 && (
                <div className="flex justify-between">
                  <span>Professional Tax:</span>
                  <span className="font-medium">₹{salary.structure.professionalTax?.toLocaleString()}</span>
                </div>
              )}
              {(salary.structure.incomeTax ?? 0) > 0 && (
                <div className="flex justify-between">
                  <span>Income Tax:</span>
                  <span className="font-medium">₹{salary.structure.incomeTax?.toLocaleString()}</span>
                </div>
              )}
              {(salary.structure.otherDeductions ?? 0) > 0 && (
                <div className="flex justify-between">
                  <span>Other Deductions:</span>
                  <span className="font-medium">₹{salary.structure.otherDeductions?.toLocaleString()}</span>
                </div>
              )}
              {salary.totalDeductions === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No deductions
                </div>
              )}
              <div className="flex justify-between font-semibold pt-3 border-t text-lg">
                <span>Total Deductions:</span>
                <span className="text-red-600">₹{salary.totalDeductions.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Net Salary */}
        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                <span className="text-xl font-semibold">Net Salary:</span>
              </div>
              <span className="text-3xl font-bold text-green-600">
                ₹{salary.netSalary.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        {salary.status === 'paid' && (salary.paymentMethod || salary.transactionId || salary.actualCreditDate) && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {salary.paymentMethod && (
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium capitalize">{salary.paymentMethod.replace('-', ' ')}</p>
                  </div>
                )}
                {salary.transactionId && (
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                    <p className="font-medium">{salary.transactionId}</p>
                  </div>
                )}
                {salary.actualCreditDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Credited On</p>
                    <p className="font-medium">{formatDate(salary.actualCreditDate)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Remarks */}
        {salary.remarks && (
          <Card>
            <CardHeader>
              <CardTitle>Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{salary.remarks}</p>
            </CardContent>
          </Card>
        )}

        {/* Audit Information */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Created By</p>
                <p className="font-medium">{salary.createdBy?.displayName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created At</p>
                <p className="font-medium">{formatDate(salary.createdAt)}</p>
              </div>
              {salary.processedBy && (
                <>
                  <div>
                    <p className="text-muted-foreground">Processed By</p>
                    <p className="font-medium">{salary.processedBy?.displayName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Processed At</p>
                    <p className="font-medium">{salary.processedAt ? formatDate(salary.processedAt) : 'N/A'}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
