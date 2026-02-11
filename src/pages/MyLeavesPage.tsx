import { useState } from 'react';
import {
  useGetMyLeavesQuery,
  useGetMyLeaveBalanceQuery,
  useCancelLeaveMutation,
} from '@/store/api/leaveApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar, Plus, X, Clock, Check, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/helper/formatDate';

export function MyLeavesPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const year = new Date().getFullYear();

  const { data: leavesData, isLoading: leavesLoading } = useGetMyLeavesQuery({
    status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
    page,
    limit: 10,
  });

  const { data: balanceData, isLoading: balanceLoading } = useGetMyLeaveBalanceQuery({ year });
  const [cancelLeave] = useCancelLeaveMutation();

  const handleCancelLeave = async (leaveId: string) => {
    if (!confirm('Are you sure you want to cancel this leave request?')) return;

    try {
      const result = await cancelLeave(leaveId).unwrap();
      toast.success('Leave Cancelled', {
        description: result.message || 'Your leave request has been cancelled.',
      });
    } catch (error: any) {
      toast.error('Failed to cancel leave', {
        description: error.data?.message || 'An error occurred while cancelling the leave.',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700' },
      approved: { icon: Check, color: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700' },
      rejected: { icon: X, color: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700' },
      cancelled: { icon: Ban, color: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600' },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getLeaveTypeBadge = (type: string) => {
    const colors = {
      casual: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      sick: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      unpaid: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      maternity: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      paternity: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors[type as keyof typeof colors]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  if (leavesLoading || balanceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const balance = balanceData?.data;
  const leaves = leavesData?.data?.leaves || [];
  const pagination = leavesData?.data?.pagination;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">My Leaves</h1>
            <p className="text-muted-foreground text-sm">Manage your leave requests and balance</p>
          </div>
          <Button onClick={() => navigate('/leaves/apply')} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Apply for Leave
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">

        {/* Leave Balance Cards */}
        {balance && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Casual Leave</p>
                  <p className="text-3xl font-bold text-blue-600">{balance.casual.remaining}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    of {balance.casual.total} remaining
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Sick Leave</p>
                  <p className="text-3xl font-bold text-purple-600">{balance.sick.remaining}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    of {balance.sick.total} remaining
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Paid Leave</p>
                  <p className="text-3xl font-bold text-green-600">{balance.paid.remaining}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    of {balance.paid.total} remaining
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Unpaid Leave</p>
                  <p className="text-3xl font-bold text-gray-600">{balance.unpaid.used}</p>
                  <p className="text-xs text-muted-foreground mt-1">days used</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Label htmlFor="statusFilter" className="text-sm font-medium">
                Filter by Status:
              </Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent position="item-aligned" className="dark">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leaves List */}
        <Card>
          <CardHeader>
            <CardTitle>Leave History</CardTitle>
            <CardDescription>Your leave requests and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {leaves.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No leave requests found</p>
                <Button className="mt-4 cursor-pointer" onClick={() => navigate('/leaves/apply')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Apply for Leave
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {leaves.map((leave) => (
                  <div
                    key={leave._id}
                    className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getLeaveTypeBadge(leave.leaveType)}
                          {getStatusBadge(leave.status)}
                          {leave.isHalfDay && (
                            <span className="px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                              Half Day ({leave.halfDayPeriod?.replace('-', ' ')})
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Start Date</p>
                            <p className="font-medium">{formatDate(leave.startDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">End Date</p>
                            <p className="font-medium">{formatDate(leave.endDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total Days</p>
                            <p className="font-medium">{leave.totalDays} day(s)</p>
                          </div>
                        </div>
                        <div className="mb-2">
                          <p className="text-xs text-muted-foreground">Reason</p>
                          <p className="text-sm">{leave.reason}</p>
                        </div>
                        {leave.reviewRemarks && (
                          <div className="mb-2">
                            <p className="text-xs text-muted-foreground">Review Remarks</p>
                            <p className="text-sm italic">{leave.reviewRemarks}</p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Applied on {formatDate(leave.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {(leave.status === 'pending' || leave.status === 'approved') && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelLeave(leave._id)}
                            className="cursor-pointer"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        )}
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
    </div>
  );
}

function Label({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium leading-none ${className || ''}`}>
      {children}
    </label>
  );
}
