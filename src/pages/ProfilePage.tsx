import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { formatDate } from '@/helper/formatDate';


export function ProfilePage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.success('Logged out successfully', {
      description: 'You have been logged out of your account.',
    });
    navigate('/login');
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">Profile</h1>
              <p className="text-muted-foreground">Welcome back!</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2 text-primary cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
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
                {user?.roles.map((role) => (
                  <span
                    key={role}
                    className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary font-medium"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Type</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold capitalize">{user?.status}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Member Since</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2026</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User ID</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-mono break-all">{user?._id}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
