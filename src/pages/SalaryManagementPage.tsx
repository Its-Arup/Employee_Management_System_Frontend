import { useState } from 'react';
import {
  useGetAllSalariesQuery,
  useUpdateSalaryStatusMutation,
  useGenerateBulkSalariesMutation,
  useGetSalaryStatisticsQuery,
} from '@/store/api/salaryApi';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { DollarSign, Search, Plus, TrendingUp, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/helper/formatDate';

export function SalaryManagementPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<number>(new Date().getFullYear());
  const [monthFilter, setMonthFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkMonth, setBulkMonth] = useState(new Date().getMonth() + 1);
  const [bulkYear, setBulkYear] = useState(new Date().getFullYear());

  const { data, isLoading } = useGetAllSalariesQuery({
    status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
    year: yearFilter,
    month: monthFilter && monthFilter !== 'all' ? parseInt(monthFilter) : undefined,
    page,
    limit: 10,
  });

  const { data: statistics } = useGetSalaryStatisticsQuery({ year: yearFilter });
  const [updateSalaryStatus] = useUpdateSalaryStatusMutation();
  const [generateBulkSalaries, { isLoading: isGenerating }] = useGenerateBulkSalariesMutation();

  const salaries = data?.data?.salaries || [];
  const pagination = data?.data?.pagination;
  const stats = statistics?.data;

  const handleStatusChange = async (salaryId: string, newStatus: string) => {
    try {
      await updateSalaryStatus({
        salaryId,
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

  const handleBulkGenerate = async () => {
    try {
      const result = await generateBulkSalaries({
        month: bulkMonth,
        year: bulkYear,
      }).unwrap();

      toast.success('Bulk Generation Complete', {
        description: `Success: ${result.data.success.length}, Failed: ${result.data.failed.length}`,
      });
      setShowBulkDialog(false);
    } catch (error: any) {
      toast.error('Failed to generate salaries', {
        description: error.data?.message || 'An error occurred.',
      });
    }
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading salaries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Salary Management</h1>
            <p className="text-muted-foreground text-sm">Manage employee salaries and payments</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowBulkDialog(true)} className="cursor-pointer">
              <Calendar className="w-4 h-4 mr-2" />
              Bulk Generate
            </Button>
            <Button onClick={() => navigate('/admin/salaries/create')} className="cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Create Salary
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Salaries</p>
                    <h3 className="text-2xl font-bold">
                      {Object.values(stats.byStatus).reduce((sum, s) => sum + s.count, 0)}
                    </h3>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <h3 className="text-2xl font-bold">
                      ₹{Object.values(stats.byStatus).reduce((sum, s) => sum + s.totalAmount, 0).toLocaleString()}
                    </h3>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <h3 className="text-2xl font-bold">{stats.byStatus.pending.count}</h3>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Paid</p>
                    <h3 className="text-2xl font-bold">{stats.byStatus.paid.count}</h3>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by employee name or ID..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select
                value={yearFilter.toString()}
                onValueChange={(value) => {
                  setYearFilter(parseInt(value));
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="dark">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={monthFilter}
                onValueChange={(value) => {
                  setMonthFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent className="dark">
                  <SelectItem value="all">All Months</SelectItem>
                  {monthNames.map((month, index) => (
                    <SelectItem key={month} value={(index + 1).toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="dark">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Salaries List */}
        <Card>
          <CardHeader>
            <CardTitle>All Salaries</CardTitle>
            <CardDescription>
              {pagination ? `Showing ${salaries.length} of ${pagination.total} salaries` : 'Loading...'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {salaries.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No salaries found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {salaries.map((salary: any) => (
                  <div
                    key={salary._id}
                    className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{salary.userId.displayName}</h3>
                          <StatusBadge status={salary.status} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Period</p>
                            <p className="font-medium">
                              {monthNames[salary.month - 1]} {salary.year}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Employee ID</p>
                            <p className="font-medium">{salary.userId.employeeId || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Net Salary</p>
                            <p className="font-medium text-green-600">₹{salary.netSalary.toLocaleString()}</p>
                          </div>
                          {salary.creditDate && (
                            <div>
                              <p className="text-xs text-muted-foreground">Credit Date</p>
                              <p className="font-medium">{formatDate(salary.creditDate)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Select
                          value={salary.status}
                          onValueChange={(value) => handleStatusChange(salary._id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="dark">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processed">Processed</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/salaries/${salary._id}`)}
                          className="cursor-pointer"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="cursor-pointer"
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    className="cursor-pointer"
                    disabled={page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bulk Generate Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent className="dark">
          <DialogHeader>
            <DialogTitle className='text-primary'>Bulk Generate Salaries</DialogTitle>
            <DialogDescription>
              Generate salary records for all active employees for the selected month
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bulkMonth" className="text-primary">Month</Label>
              <Select
                value={bulkMonth.toString()}
                onValueChange={(value) => setBulkMonth(parseInt(value))}
              >
                <SelectTrigger id="bulkMonth" className="text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark text-primary">
                  {monthNames.map((month, index) => (
                    <SelectItem key={month} value={(index + 1).toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulkYear" className="text-primary">Year</Label>
              <Select
                value={bulkYear.toString()}
                onValueChange={(value) => setBulkYear(parseInt(value))}
              >
                <SelectTrigger id="bulkYear" className='text-primary'>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkDialog(false)} className="cursor-pointer text-primary">
              Cancel
            </Button>
            <Button onClick={handleBulkGenerate} disabled={isGenerating} className="cursor-pointer">
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
