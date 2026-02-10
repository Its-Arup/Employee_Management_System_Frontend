import { useState } from 'react';
import {
  useGetPendingLeavesQuery,
  useApproveLeaveMutation,
  useRejectLeaveMutation,
} from '@/store/api/leaveApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Check, X,Clock, Calendar } from 'lucide-react';
import { formatDate } from '@/helper/formatDate';

export function LeaveManagementPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetPendingLeavesQuery({ page, limit: 10 });
  const [approveLeave] = useApproveLeaveMutation();
  const [rejectLeave] = useRejectLeaveMutation();

  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [showModal, setShowModal] = useState<'approve' | 'reject' | null>(null);
  const [remarks, setRemarks] = useState('');

  const leaves = data?.data?.leaves || [];
  const pagination = data?.data?.pagination;

  const handleApprove = async () => {
    if (!selectedLeave) return;

    try {
      await approveLeave({
        leaveId: selectedLeave._id,
        data: { remarks: remarks || undefined },
      }).unwrap();

      toast.success('Leave Approved', {
        description: `Leave request for ${selectedLeave.userId.displayName} has been approved.`,
      });

      setShowModal(null);
      setSelectedLeave(null);
      setRemarks('');
    } catch (error: any) {
      toast.error('Failed to approve leave', {
        description: error.data?.message || 'An error occurred.',
      });
    }
  };

  const handleReject = async () => {
    if (!selectedLeave || !remarks) return;

    try {
      await rejectLeave({
        leaveId: selectedLeave._id,
        data: { remarks },
      }).unwrap();

      toast.success('Leave Rejected', {
        description: `Leave request for ${selectedLeave.userId.displayName} has been rejected.`,
      });

      setShowModal(null);
      setSelectedLeave(null);
      setRemarks('');
    } catch (error: any) {
      toast.error('Failed to reject leave', {
        description: error.data?.message || 'An error occurred.',
      });
    }
  };

  const getLeaveTypeBadge = (type: string) => {
    const colors = {
      casual: 'bg-blue-100 text-blue-800',
      sick: 'bg-purple-100 text-purple-800',
      paid: 'bg-green-100 text-green-800',
      unpaid: 'bg-gray-100 text-gray-800',
      maternity: 'bg-pink-100 text-pink-800',
      paternity: 'bg-indigo-100 text-indigo-800',
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors[type as keyof typeof colors]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-primary">Leave Management</h1>
          <p className="text-muted-foreground text-sm">
            Review and manage pending leave requests ({leaves.length} pending)
          </p>
        </div>
      </header>

      <div className="p-6 space-y-6">

        {/* Pending Leaves List */}
        {leaves.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pending leave requests</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {leaves.map((leave: any) => (
              <Card key={leave._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-lg font-semibold">{leave.userId.displayName}</h3>
                        {getLeaveTypeBadge(leave.leaveType)}
                        {leave.isHalfDay && (
                          <span className="px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
                            Half Day ({leave.halfDayPeriod?.replace('-', ' ')})
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Employee</p>
                          <p className="font-medium">{leave.userId.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {leave.userId.employeeId && `ID: ${leave.userId.employeeId}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Date Range</p>
                          <p className="font-medium">
                            {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                          </p>
                          <p className="text-xs text-muted-foreground">{leave.totalDays} day(s)</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Department</p>
                          <p className="font-medium">{leave.userId.department || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{leave.userId.designation || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="mb-2">
                        <p className="text-xs text-muted-foreground">Reason</p>
                        <p className="text-sm">{leave.reason}</p>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Applied on {formatDate(leave.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedLeave(leave);
                          setShowModal('approve');
                        }}
                        className="cursor-pointer"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedLeave(leave);
                          setShowModal('reject');
                        }}
                        className="cursor-pointer"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
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
                disabled={page === pagination.pages}
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Approve/Reject Modal */}
        {showModal && selectedLeave && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>
                  {showModal === 'approve' ? 'Approve Leave' : 'Reject Leave'}
                </CardTitle>
                <CardDescription>
                  {showModal === 'approve'
                    ? 'Add optional remarks and approve this leave request'
                    : 'Provide a reason for rejecting this leave request'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-accent rounded-lg">
                  <p className="text-sm font-medium">{selectedLeave.userId.displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(selectedLeave.startDate)} - {formatDate(selectedLeave.endDate)} ({selectedLeave.totalDays} days)
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Remarks {showModal === 'reject' && '*'}
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[100px] mt-2"
                    placeholder={
                      showModal === 'approve'
                        ? 'Add optional remarks...'
                        : 'Please provide the reason for rejection...'
                    }
                    required={showModal === 'reject'}
                    minLength={showModal === 'reject' ? 10 : 0}
                  />
                  {showModal === 'reject' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {remarks.length}/minimum 10 characters
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={showModal === 'approve' ? handleApprove : handleReject}
                    disabled={showModal === 'reject' && remarks.length < 10}
                    variant={showModal === 'approve' ? 'default' : 'destructive'}
                    className="flex-1 cursor-pointer"
                  >
                    {showModal === 'approve' ? 'Approve' : 'Reject'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowModal(null);
                      setSelectedLeave(null);
                      setRemarks('');
                    }}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
