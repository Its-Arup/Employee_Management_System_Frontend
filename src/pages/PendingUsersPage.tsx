import { useState } from 'react';
import { useGetPendingUsersQuery, useApproveUserMutation, useRejectUserMutation } from '@/store/api/adminApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { Users, Check, X, Mail, Phone, Calendar } from 'lucide-react';
import { formatDate } from '@/helper/formatDate';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function PendingUsersPage() {
  const { data, isLoading } = useGetPendingUsersQuery();
  const [approveUser] = useApproveUserMutation();
  const [rejectUser] = useRejectUserMutation();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);

  const [approveData, setApproveData] = useState({
    roles: ['employee'] as ('employee' | 'admin' | 'hr' | 'manager')[],
    employeeId: '',
    designation: '',
    department: '',
    joiningDate: '',
  });

  const [rejectReason, setRejectReason] = useState('');

  const pendingUsers = data?.data || [];

  const handleApprove = async () => {
    if (!selectedUser) return;

    try {
      const result = await approveUser({
        userId: selectedUser._id,
        data: {
          ...approveData,
          joiningDate: approveData.joiningDate || undefined,
        },
      }).unwrap();

      toast.success('User Approved', {
        description: `${selectedUser.displayName} has been approved successfully.`,
      });

      setShowApprove(false);
      setSelectedUser(null);
      setApproveData({
        roles: ['employee'],
        employeeId: '',
        designation: '',
        department: '',
        joiningDate: '',
      });
    } catch (error: any) {
      toast.error('Failed to approve user', {
        description: error.data?.message || 'An error occurred.',
      });
    }
  };

  const handleReject = async () => {
    if (!selectedUser || !rejectReason) return;

    try {
      await rejectUser({
        userId: selectedUser._id,
        data: { reason: rejectReason },
      }).unwrap();

      toast.success('User Rejected', {
        description: `${selectedUser.displayName} has been rejected.`,
      });

      setShowReject(false);
      setSelectedUser(null);
      setRejectReason('');
    } catch (error: any) {
      toast.error('Failed to reject user', {
        description: error.data?.message || 'An error occurred.',
      });
    }
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
          <h1 className="text-2xl font-bold text-primary">Pending User Approvals</h1>
          <p className="text-muted-foreground text-sm">
            Review and approve new user registrations ({pendingUsers.length} pending)
          </p>
        </div>
      </header>

      <div className="p-6 space-y-6">

        {/* Pending Users List */}
        {pendingUsers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pending user approvals</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingUsers.map((user: any) => (
              <Card key={user._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{user.displayName}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>@{user.username}</span>
                        </div>
                        {user.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{user.phoneNumber}</span>
                          </div>
                        )}
                        {user.dateOfBirth && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>DOB: {formatDate(user.dateOfBirth)}</span>
                          </div>
                        )}
                      </div>
                      {user.address && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Address: {user.address}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Registered on {formatDate(user.createdAt)}
                      </p>
                      <div className="mt-2">
                        <Badge className={user.isEmailVerified ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}>
                          {user.isEmailVerified ? '✓ Email Verified' : 'Email Not Verified'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setApproveData({
                            ...approveData,
                            designation: user.designation || '',
                            department: user.department || '',
                          });
                          setShowApprove(true);
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
                          setSelectedUser(user);
                          setShowReject(true);
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

        {/* Approve Modal */}
        {showApprove && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Approve User</CardTitle>
                <CardDescription>Set user details and approve registration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input
                    id="employeeId"
                    value={approveData.employeeId}
                    onChange={(e) => setApproveData({ ...approveData, employeeId: e.target.value })}
                    placeholder="e.g., EMP001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={approveData.designation}
                    onChange={(e) => setApproveData({ ...approveData, designation: e.target.value })}
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={approveData.department}
                    onChange={(e) => setApproveData({ ...approveData, department: e.target.value })}
                    placeholder="e.g., IT"
                  />
                </div>
                <div>
                  <Label htmlFor="joiningDate">Joining Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !approveData.joiningDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {approveData.joiningDate ? format(new Date(approveData.joiningDate), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 dark" align="start">
                      <CalendarComponent
                        mode="single"
                        captionLayout="dropdown"
                        selected={approveData.joiningDate ? new Date(approveData.joiningDate) : undefined}
                        onSelect={(date) => setApproveData({ ...approveData, joiningDate: date ? format(date, "yyyy-MM-dd") : '' })}
                        disabled={(date) =>
                          date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="roles">Roles *</Label>
                  <select
                    id="roles"
                    value={approveData.roles[0]}
                    onChange={(e) => setApproveData({ ...approveData, roles: [e.target.value as any] })}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    required
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="hr">HR</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleApprove} className="flex-1 cursor-pointer">Approve User</Button>
                  <Button variant="outline" onClick={() => setShowApprove(false)} className="cursor-pointer">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reject Modal */}
        {showReject && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Reject User</CardTitle>
                <CardDescription>Provide a reason for rejection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reason">Rejection Reason *</Label>
                  <textarea
                    id="reason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-[100px]"
                    placeholder="Please provide the reason for rejecting this user..."
                    required
                    minLength={10}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {rejectReason.length}/minimum 10 characters
                  </p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={rejectReason.length < 10}
                    className="flex-1 cursor-pointer"
                  >
                    Reject User
                  </Button>
                  <Button variant="outline" onClick={() => setShowReject(false)} className="cursor-pointer">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
