import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  LogOut,
  Calendar,
  DollarSign,
  Clock,
  UserCheck,
  Users,
  Menu,
  X,
} from 'lucide-react';
import { useState, } from 'react';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.success('Logged out successfully', {
      description: 'You have been logged out of your account.',
    });
    navigate('/login');
  };

  // Check if user has admin/hr/manager roles
  const isAdmin = user?.roles?.includes('admin');
  const isHR = user?.roles?.includes('hr');
  const isManager = user?.roles?.includes('manager');
  const hasManagementAccess = isAdmin || isHR || isManager;

  const navigationItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', show: true },
    { name: 'My Leaves', icon: Calendar, path: '/leaves/my-leaves', show: true },
    { name: 'My Salary', icon: DollarSign, path: '/salaries', show: true },
    { name: 'Leave Requests', icon: Clock, path: '/leaves/manage', show: hasManagementAccess },
    { name: 'Manage Salaries', icon: DollarSign, path: '/admin/salaries', show: isAdmin || isHR },
    { name: 'Pending Users', icon: UserCheck, path: '/admin/pending-users', show: isAdmin || isHR },
    { name: 'Manage Users', icon: Users, path: '/admin/users', show: isAdmin || isHR },
  ];

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar Navigation */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-card border-r border-border transition-all duration-300 flex flex-col overflow-y-auto`}
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
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.filter(item => item.show).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-border">
          <div 
            className={`flex items-center gap-3 cursor-pointer hover:bg-accent rounded-lg p-2 transition-colors ${isSidebarOpen ? '' : 'justify-center'}`}
            onClick={() => navigate('/profile')}
          >
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-semibold shrink-0">
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
          {isSidebarOpen && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 text-primary"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
