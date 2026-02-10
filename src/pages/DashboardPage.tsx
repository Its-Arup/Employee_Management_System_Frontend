

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
import { 
  LayoutDashboard, 
  LogOut, 
  User, 
  Users, 
  Settings, 
  FileText,
  Menu,
  X
} from 'lucide-react';
import { formatDate } from '@/helper/formatDate';
import { useState } from 'react';

const DashboardPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.success('Logged out successfully', {
      description: 'You have been logged out of your account.',
    });
    navigate('/login');
  };

  const navigationItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', active: true },
    { name: 'Employees', icon: Users, path: '/employees', active: false },
    { name: 'Reports', icon: FileText, path: '/reports', active: false },
    { name: 'Settings', icon: Settings, path: '/settings', active: false },
  ];

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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {isSidebarOpen && (
            <h2 className="text-xl font-bold text-foreground">EMS</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-border">
          <div className={`flex items-center gap-3 ${isSidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
              {user?.displayName?.charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.displayName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
              <p className="text-muted-foreground text-sm">Welcome back, {user?.displayName}!</p>
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
      </main>
    </div>
  );
};

export { DashboardPage };