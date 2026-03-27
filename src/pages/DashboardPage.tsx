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
  Users,
  Mail,
  Phone,
  MapPin,
  Cake,
  Shield,
  ArrowRight,
  Sparkles,
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Quick action cards data
  const quickActions = [
    {
      title: 'Apply Leave',
      description: 'Request time off',
      icon: Calendar,
      path: '/leaves/apply',
      gradient: 'from-blue-500 to-cyan-400',
      shadow: 'shadow-blue-500/20',
      bgGlow: 'bg-blue-500/10',
    },
    {
      title: 'My Leaves',
      description: 'View leave history',
      icon: Clock,
      path: '/leaves/my-leaves',
      gradient: 'from-purple-500 to-pink-400',
      shadow: 'shadow-purple-500/20',
      bgGlow: 'bg-purple-500/10',
    },
    {
      title: 'My Salary',
      description: 'View salary details',
      icon: DollarSign,
      path: '/salaries',
      gradient: 'from-emerald-500 to-teal-400',
      shadow: 'shadow-emerald-500/20',
      bgGlow: 'bg-emerald-500/10',
    },
    {
      title: 'My Profile',
      description: 'Edit your profile',
      icon: User,
      path: '/profile',
      gradient: 'from-orange-500 to-amber-400',
      shadow: 'shadow-orange-500/20',
      bgGlow: 'bg-orange-500/10',
    },
  ];

  // Management action cards data
  const managementActions = [
    {
      title: 'Leave Requests',
      description: 'Review & approve leave applications',
      icon: Clock,
      path: '/leaves/manage',
      show: hasManagementAccess,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      hoverBg: 'hover:bg-blue-500/15',
    },
    {
      title: 'Pending Users',
      description: 'Approve or reject new registrations',
      icon: UserCheck,
      path: '/admin/pending-users',
      show: isAdmin || isHR,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      hoverBg: 'hover:bg-amber-500/15',
    },
    {
      title: 'Manage Salaries',
      description: 'Create and manage payroll',
      icon: DollarSign,
      path: '/admin/salaries',
      show: isAdmin || isHR,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      hoverBg: 'hover:bg-emerald-500/15',
    },
    {
      title: 'Manage Users',
      description: 'View and edit employee records',
      icon: Users,
      path: '/admin/users',
      show: isAdmin || isHR,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      hoverBg: 'hover:bg-purple-500/15',
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header with gradient accent */}
      <header className="relative overflow-hidden border-b border-border/50 px-8 py-6">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.07] via-purple-500/[0.05] to-transparent" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <p className="text-sm font-medium text-indigo-400">Welcome back</p>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {user?.displayName}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Here's what's happening with your account today.
            </p>
          </div>
          {/* User avatar on the right */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">@{user?.username}</p>
              <div className="flex items-center gap-1.5 justify-end mt-0.5">
                {user?.status?.toLowerCase() === 'active' && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
                <span className="text-xs text-emerald-400 font-medium capitalize">{user?.status}</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/25">
              {user?.displayName?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-8 space-y-8 overflow-auto flex-1">
        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.title}
                  className={`group cursor-pointer border-border/50 hover:border-border transition-all duration-300 hover:shadow-xl ${action.shadow} hover:-translate-y-1`}
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="pt-6 pb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-lg ${action.shadow} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{action.description}</p>
                    <div className="flex items-center gap-1 mt-3 text-xs font-medium text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Go to {action.title.toLowerCase()}</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* User Info + Account Info Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Information Card - Takes 2 cols */}
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10">
                  <User className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                  <CardDescription>Your account details and contact info</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/[0.03] mt-0.5">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Display Name</p>
                    <p className="font-medium mt-0.5">{user?.displayName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/[0.03] mt-0.5">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email</p>
                    <p className="font-medium mt-0.5">{user?.email}</p>
                  </div>
                </div>
                {user?.phoneNumber && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white/[0.03] mt-0.5">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Phone</p>
                      <p className="font-medium mt-0.5">{user?.phoneNumber}</p>
                    </div>
                  </div>
                )}
                {user?.dateOfBirth && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white/[0.03] mt-0.5">
                      <Cake className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Date of Birth</p>
                      <p className="font-medium mt-0.5">{formatDate(user.dateOfBirth)}</p>
                    </div>
                  </div>
                )}
                {user?.address && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <div className="p-2 rounded-lg bg-white/[0.03] mt-0.5">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Address</p>
                      <p className="font-medium mt-0.5">{user.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Info Card - 1 col */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Account</CardTitle>
                  <CardDescription>Status & permissions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Status</p>
                <div className="flex items-center gap-2">
                  {user?.status?.toLowerCase() === 'active' && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  )}
                  <p className="font-semibold capitalize text-emerald-400">{user?.status}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Roles</p>
                <div className="flex gap-2 flex-wrap">
                  {user?.roles?.map((role) => (
                    <RoleBadge key={role} role={role} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Email Verified</p>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                  user?.isEmailVerified
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${user?.isEmailVerified ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  {user?.isEmailVerified ? 'Verified' : 'Not Verified'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Actions */}
        {hasManagementAccess && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Management</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {managementActions.filter(a => a.show).map((action) => {
                const Icon = action.icon;
                return (
                  <Card
                    key={action.title}
                    className={`group cursor-pointer border-border/50 hover:border-border transition-all duration-200`}
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl ${action.bg} shrink-0`}>
                          <Icon className={`w-5 h-5 ${action.color}`} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-foreground">{action.title}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{action.description}</p>
                        </div>
                      </div>
                      <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${action.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { DashboardPage };
