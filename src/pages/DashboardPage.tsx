import { useAuth } from '@/hooks/useAuth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RoleBadge } from '@/components/RoleBadge';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  User,
  Calendar,
  DollarSign,
  Clock,
  UserCheck,
} from 'lucide-react';
import { formatDate } from '@/helper/formatDate';

const DashboardPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check if user has admin/hr/manager roles
  const isAdmin = user?.roles?.includes('admin');
  const isHR = user?.roles?.includes('hr');
  const isManager = user?.roles?.includes('manager');
  const hasManagementAccess = isAdmin || isHR || isManager;

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
      {/* Top Bar */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back, {user?.displayName}!</p>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-6 space-y-6">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>User Information</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Display Name</p>
                  <p className="font-medium">{user?.displayName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">@{user?.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2">
                    {user?.status?.toLowerCase() === 'active' && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    )}
                    <p className="font-medium capitalize">{user?.status}</p>
                  </div>
                </div>
                {user?.phoneNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium">{user.phoneNumber}</p>
                  </div>
                )}
                {user?.dateOfBirth && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{formatDate(user.dateOfBirth)}</p>
                  </div>
                )}
              </div>
              {user?.address && (
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{user.address}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Roles</p>
                <div className="flex gap-2 mt-1">
                  {user?.roles?.map((role) => (
                    <RoleBadge key={role} role={role} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/leaves/apply')}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Apply for</p>
                    <h3 className="text-2xl font-bold mt-1">Leave</h3>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/leaves/my-leaves')}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">View My</p>
                    <h3 className="text-2xl font-bold mt-1">Leaves</h3>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/salaries')}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">View My</p>
                    <h3 className="text-2xl font-bold mt-1">Salary</h3>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/profile')}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Edit</p>
                    <h3 className="text-2xl font-bold mt-1">Profile</h3>
                  </div>
                  <User className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Quick Actions */}
          {hasManagementAccess && (
            <Card>
              <CardHeader>
                <CardTitle>Management Actions</CardTitle>
                <CardDescription>Quick access to management features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2 cursor-pointer"
                    onClick={() => navigate('/leaves/manage')}
                  >
                    <Clock className="w-6 h-6" />
                    <span>Leave Requests</span>
                  </Button>
                  {(isAdmin || isHR) && (
                    <>
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2 cursor-pointer"
                        onClick={() => navigate('/admin/pending-users')}
                      >
                        <UserCheck className="w-6 h-6" />
                        <span>Pending Users</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2 cursor-pointer"
                        onClick={() => navigate('/admin/salaries')}
                      >
                        <DollarSign className="w-6 h-6" />
                        <span>Manage Salaries</span>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Account Status</p>
                  <p className="text-xl font-bold capitalize">{user?.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Roles</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {user?.roles?.map((role) => (
                      <RoleBadge key={role} role={role} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Verified</p>
                  <p className={`text-lg font-semibold ${user?.isEmailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {user?.isEmailVerified ? '✓ Yes' : '⚠ No'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export { DashboardPage };