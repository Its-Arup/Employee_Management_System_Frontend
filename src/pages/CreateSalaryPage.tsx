import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateSalaryMutation } from '@/store/api/salaryApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Save, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useGetAllUsersQuery } from '@/store/api/adminApi';

export function CreateSalaryPage() {
  const navigate = useNavigate();
  const [createSalary, { isLoading }] = useCreateSalaryMutation();
  const { data: usersData } = useGetAllUsersQuery({ status: 'active', limit: 1000 });

  const users = usersData?.data?.users || [];
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    userId: '',
    month: currentMonth,
    year: currentYear,
    basic: 0,
    hra: 0,
    transportAllowance: 0,
    medicalAllowance: 0,
    otherAllowances: 0,
    providentFund: 0,
    professionalTax: 0,
    incomeTax: 0,
    otherDeductions: 0,
    workingDays: 26,
    presentDays: 26,
    leaveDays: 0,
    absentDays: 0,
    isProrated: false,
    creditDate: undefined as Date | undefined,
    remarks: '',
  });

  const calculateNetSalary = () => {
    const { basic, hra, transportAllowance, medicalAllowance, otherAllowances, providentFund, professionalTax, incomeTax, otherDeductions } = formData;
    
    const totalEarnings = basic + hra + transportAllowance + medicalAllowance + otherAllowances;
    const totalDeductions = providentFund + professionalTax + incomeTax + otherDeductions;
    
    return totalEarnings - totalDeductions;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId) {
      toast.error('Please select an employee');
      return;
    }

    if (formData.basic <= 0) {
      toast.error('Basic salary must be greater than 0');
      return;
    }

    if (formData.presentDays + formData.absentDays > formData.workingDays) {
      toast.error('Present days + absent days cannot exceed working days');
      return;
    }

    try {
      // Calculate required fields
      const grossSalary = formData.basic + formData.hra + formData.transportAllowance + formData.medicalAllowance + formData.otherAllowances;
      const totalDeductions = formData.providentFund + formData.professionalTax + formData.incomeTax + formData.otherDeductions;
      const netSalary = grossSalary - totalDeductions;

      await createSalary({
        userId: formData.userId,
        month: formData.month,
        year: formData.year,
        structure: {
          basic: formData.basic,
          hra: formData.hra,
          transportAllowance: formData.transportAllowance,
          medicalAllowance: formData.medicalAllowance,
          otherAllowances: formData.otherAllowances,
          providentFund: formData.providentFund,
          professionalTax: formData.professionalTax,
          incomeTax: formData.incomeTax,
          otherDeductions: formData.otherDeductions,
        },
        grossSalary,
        totalDeductions,
        netSalary,
        workingDays: formData.workingDays,
        presentDays: formData.presentDays,
        leaveDays: formData.leaveDays,
        absentDays: formData.absentDays,
        isProrated: formData.isProrated,
        creditDate: formData.creditDate ? formData.creditDate.toISOString() : undefined,
        remarks: formData.remarks || undefined,
      }).unwrap();

      toast.success('Salary Created', {
        description: 'Salary record has been created successfully.',
      });
      navigate('/admin/salaries');
    } catch (error: any) {
      toast.error('Failed to create salary', {
        description: error.data?.message || 'An error occurred.',
      });
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentYearValue = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYearValue - 2 + i);

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
          <div>
            <h1 className="text-2xl font-bold text-primary">Create Salary Record</h1>
            <p className="text-muted-foreground text-sm">Add a new salary record for an employee</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          {/* Employee Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
              <CardDescription>Select the employee and salary period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="userId">Employee *</Label>
                  <Select
                    value={formData.userId}
                    onValueChange={(value) => setFormData({ ...formData, userId: value })}
                  >
                    <SelectTrigger id="userId">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent className="dark">
                      {users.map((user: any) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.displayName} ({user.employeeId || user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="month">Month *</Label>
                  <Select
                    value={formData.month.toString()}
                    onValueChange={(value) => setFormData({ ...formData, month: parseInt(value) })}
                  >
                    <SelectTrigger id="month">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark">
                      {monthNames.map((month, index) => (
                        <SelectItem key={month} value={(index + 1).toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Select
                    value={formData.year.toString()}
                    onValueChange={(value) => setFormData({ ...formData, year: parseInt(value) })}
                  >
                    <SelectTrigger id="year">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark">
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditDate">Credit Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="creditDate"
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !formData.creditDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.creditDate ? format(formData.creditDate, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 dark" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.creditDate}
                        onSelect={(date) => setFormData({ ...formData, creditDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Structure - Earnings */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings</CardTitle>
              <CardDescription>Enter salary components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basic">Basic Salary *</Label>
                  <Input
                    id="basic"
                    type="number"
                    value={formData.basic || ''}
                    onChange={(e) => setFormData({ ...formData, basic: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hra">HRA</Label>
                  <Input
                    id="hra"
                    type="number"
                    value={formData.hra || ''}
                    onChange={(e) => setFormData({ ...formData, hra: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transportAllowance">Transport Allowance</Label>
                  <Input
                    id="transportAllowance"
                    type="number"
                    value={formData.transportAllowance || ''}
                    onChange={(e) => setFormData({ ...formData, transportAllowance: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalAllowance">Medical Allowance</Label>
                  <Input
                    id="medicalAllowance"
                    type="number"
                    value={formData.medicalAllowance || ''}
                    onChange={(e) => setFormData({ ...formData, medicalAllowance: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherAllowances">Other Allowances</Label>
                  <Input
                    id="otherAllowances"
                    type="number"
                    value={formData.otherAllowances || ''}
                    onChange={(e) => setFormData({ ...formData, otherAllowances: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deductions */}
          <Card>
            <CardHeader>
              <CardTitle>Deductions</CardTitle>
              <CardDescription>Enter deduction components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="providentFund">Provident Fund</Label>
                  <Input
                    id="providentFund"
                    type="number"
                    value={formData.providentFund || ''}
                    onChange={(e) => setFormData({ ...formData, providentFund: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professionalTax">Professional Tax</Label>
                  <Input
                    id="professionalTax"
                    type="number"
                    value={formData.professionalTax || ''}
                    onChange={(e) => setFormData({ ...formData, professionalTax: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incomeTax">Income Tax</Label>
                  <Input
                    id="incomeTax"
                    type="number"
                    value={formData.incomeTax || ''}
                    onChange={(e) => setFormData({ ...formData, incomeTax: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherDeductions">Other Deductions</Label>
                  <Input
                    id="otherDeductions"
                    type="number"
                    value={formData.otherDeductions || ''}
                    onChange={(e) => setFormData({ ...formData, otherDeductions: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Details</CardTitle>
              <CardDescription>Enter attendance information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workingDays">Working Days *</Label>
                  <Input
                    id="workingDays"
                    type="number"
                    value={formData.workingDays || ''}
                    onChange={(e) => setFormData({ ...formData, workingDays: parseInt(e.target.value) || 0 })}
                    placeholder="26"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presentDays">Present Days *</Label>
                  <Input
                    id="presentDays"
                    type="number"
                    value={formData.presentDays || ''}
                    onChange={(e) => setFormData({ ...formData, presentDays: parseInt(e.target.value) || 0 })}
                    placeholder="26"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leaveDays">Leave Days</Label>
                  <Input
                    id="leaveDays"
                    type="number"
                    value={formData.leaveDays || ''}
                    onChange={(e) => setFormData({ ...formData, leaveDays: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="absentDays">Absent Days</Label>
                  <Input
                    id="absentDays"
                    type="number"
                    value={formData.absentDays || ''}
                    onChange={(e) => setFormData({ ...formData, absentDays: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isProrated"
                  checked={formData.isProrated}
                  onChange={(e) => setFormData({ ...formData, isProrated: e.target.checked })}
                  className="cursor-pointer"
                />
                <Label htmlFor="isProrated" className="cursor-pointer">Prorated Salary</Label>
              </div>
            </CardContent>
          </Card>

          {/* Remarks */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Net Salary Summary */}
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">Net Salary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">₹{calculateNetSalary().toLocaleString()}</p>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/salaries')}
              className="cursor-pointer text-primary"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="cursor-pointer">
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Creating...' : 'Create Salary'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
