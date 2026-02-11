import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useUpdateUserRolesMutation,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
} from '@/store/api/adminApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowLeft, Save, Trash2, Shield, Ban, CheckCircle, Calendar } from 'lucide-react';
import { formatDate } from '@/helper/formatDate';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function EditUserPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useGetUserByIdQuery(userId!);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [updateUserRoles, { isLoading: isUpdatingRoles }] = useUpdateUserRolesMutation();
  const [toggleUserStatus, { isLoading: isTogglingStatus }] = useToggleUserStatusMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const user = data?.data;

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    username: '',
    employeeId: '',
    designation: '',
    department: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    joiningDate: '',
  });

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'suspended'>('active');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        username: user.username || '',
        employeeId: user.employeeId || '',
        designation: user.designation || '',
        department: user.department || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        joiningDate: user.joiningDate ? user.joiningDate.split('T')[0] : '',
      });
      setSelectedRoles(user.roles || []);
      setSelectedStatus(user.status === 'suspended' ? 'suspended' : 'active');
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!userId) return;

    try {
      await updateUser({
        userId,
        data: {
          displayName: formData.displayName,
          employeeId: formData.employeeId || undefined,
          designation: formData.designation || undefined,
          department: formData.department || undefined,
          phoneNumber: formData.phoneNumber || undefined,
          address: formData.address || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          joiningDate: formData.joiningDate || undefined,
        },
      }).unwrap();

      toast.success('User Updated', {
        description: 'User details have been updated successfully.',
      });
    } catch (error: any) {
      toast.error('Failed to update user', {
        description: error.data?.message || 'An error occurred while updating the user.',
      });
    }
  };

  const handleUpdateRoles = async () => {
    if (!userId || selectedRoles.length === 0) {
      toast.error('Validation Error', {
        description: 'Please select at least one role.',
      });
      return;
    }

    try {
      await updateUserRoles({
        userId,
        data: { roles: selectedRoles as ('employee' | 'admin' | 'hr' | 'manager')[] },
      }).unwrap();

      toast.success('Roles Updated', {
        description: 'User roles have been updated successfully.',
      });
    } catch (error: any) {
      toast.error('Failed to update roles', {
        description: error.data?.message || 'An error occurred while updating roles.',
      });
    }
  };

  const handleToggleStatus = async () => {
    if (!userId) return;

    try {
      await toggleUserStatus({
        userId,
        data: { status: selectedStatus },
      }).unwrap();

      toast.success('Status Updated', {
        description: `User has been ${selectedStatus} successfully.`,
      });
    } catch (error: any) {
      toast.error('Failed to update status', {
        description: error.data?.message || 'An error occurred while updating status.',
      });
    }
  };

  const handleDelete = async () => {
    if (!userId) return;

    try {
      await deleteUser(userId).unwrap();

      toast.success('User Deleted', {
        description: 'User has been deleted successfully.',
      });

      setShowDeleteDialog(false);
      navigate('/admin/users');
    } catch (error: any) {
      toast.error('Failed to delete user', {
        description: error.data?.message || 'An error occurred while deleting the user.',
      });
    }
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">User not found</p>
          <Button onClick={() => navigate('/admin/users')} className="mt-4">
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/users')}
              className="cursor-pointer text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Edit User</h1>
              <p className="text-muted-foreground text-sm">Manage user details, roles, and status</p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete User
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Basic user details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email (Read-only)</Label>
                <Input id="email" value={formData.email} disabled />
              </div>
              <div>
                <Label htmlFor="username">Username (Read-only)</Label>
                <Input id="username" value={formData.username} disabled />
              </div>
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth ? format(new Date(formData.dateOfBirth), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 dark" align="start">
                    <CalendarComponent
                      mode="single"
                      captionLayout="dropdown"
                      selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                      onSelect={(date) => setFormData({ ...formData, dateOfBirth: date ? format(date, "yyyy-MM-dd") : '' })}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.joiningDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.joiningDate ? format(new Date(formData.joiningDate), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 dark" align="start">
                    <CalendarComponent
                      mode="single"
                      captionLayout="dropdown"
                      selected={formData.joiningDate ? new Date(formData.joiningDate) : undefined}
                      onSelect={(date) => setFormData({ ...formData, joiningDate: date ? format(date, "yyyy-MM-dd") : '' })}
                      disabled={(date) =>
                        date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleUpdate} disabled={isUpdating} className="cursor-pointer">
                <Save className="w-4 h-4 mr-2" />
                {isUpdating ? 'Updating...' : 'Update Details'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Roles Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
            <CardDescription>Assign roles to control user permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {['employee', 'manager', 'hr', 'admin'].map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={role}
                    checked={selectedRoles.includes(role)}
                    onChange={() => toggleRole(role)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label
                    htmlFor={role}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleUpdateRoles}
                disabled={isUpdatingRoles}
                className="cursor-pointer"
              >
                <Shield className="w-4 h-4 mr-2" />
                {isUpdatingRoles ? 'Updating...' : 'Update Roles'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Status</CardTitle>
            <CardDescription>Activate or suspend user account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="status">Account Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value: 'active' | 'suspended') => setSelectedStatus(value)}
              >
                <SelectTrigger className="w-full md:w-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='dark'>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleToggleStatus}
                disabled={isTogglingStatus}
                variant={selectedStatus === 'suspended' ? 'destructive' : 'default'}
                className="cursor-pointer"
              >
                {selectedStatus === 'suspended' ? (
                  <>
                    <Ban className="w-4 h-4 mr-2" />
                    {isTogglingStatus ? 'Suspending...' : 'Suspend User'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isTogglingStatus ? 'Activating...' : 'Activate User'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Additional account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Created At</p>
                <p className="font-medium">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Updated At</p>
                <p className="font-medium">{formatDate(user.updatedAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email Verified</p>
                <p className="font-medium">{user.isEmailVerified ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current Status</p>
                <p className="font-medium capitalize">{user.status}</p>
              </div>
              {user.approvedBy && (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground">Approved By</p>
                    <p className="font-medium">{user.approvedBy.displayName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Approved At</p>
                    <p className="font-medium">{formatDate(user.approvedAt!)}</p>
                  </div>
                </>
              )}
              {user.rejectionReason && (
                <div className="md:col-span-2">
                  <p className="text-xs text-muted-foreground">Rejection Reason</p>
                  <p className="font-medium text-red-600 dark:text-red-400">{user.rejectionReason}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="dark">
          <DialogHeader>
            <DialogTitle className='text-primary'>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{user.displayName}</strong>? This action cannot be undone.
              All user data, including leave records and salary information, will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
              className="cursor-pointer text-primary"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
