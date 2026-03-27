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
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
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
          isSidebarOpen ? 'w-72' : 'w-20'
        } bg-gradient-to-b from-[oklch(0.18_0.03_260)] to-[oklch(0.12_0.02_270)] border-r border-border/50 transition-all duration-300 flex flex-col overflow-y-auto`}
      >
        {/* Sidebar Header */}
        <div className="p-5 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground tracking-tight">EMS</h2>
                <p className="text-[10px] text-muted-foreground -mt-0.5">Employee Management</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {isSidebarOpen && (
            <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider px-4 mb-3">
              Menu
            </p>
          )}
          {navigationItems.filter(item => item.show).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-indigo-400 shadow-sm shadow-indigo-500/5'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-indigo-500/20' : 'group-hover:bg-white/5'
                }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                {isSidebarOpen && (
                  <span className="font-medium text-sm flex-1 text-left">{item.name}</span>
                )}
                {isSidebarOpen && isActive && (
                  <ChevronRight className="w-4 h-4 text-indigo-400/60" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 mx-3 mb-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div
            className={`flex items-center gap-3 cursor-pointer group ${isSidebarOpen ? '' : 'justify-center'}`}
            onClick={() => navigate('/profile')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shrink-0 shadow-lg shadow-indigo-500/20 text-sm">
              {user?.displayName?.charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate group-hover:text-indigo-400 transition-colors">
                  {user?.displayName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg h-9"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
};
