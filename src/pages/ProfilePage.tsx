import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { User, Edit, Save, X, Calendar as CalendarIcon, Phone, MapPin, } from 'lucide-react';
import { formatDate } from '@/helper/formatDate';
import { useUpdateProfileMutation } from '@/store/api/authApi';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';


export function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    dateOfBirth: user?.dateOfBirth || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
  });

  const handleEdit = () => {
    setFormData({
      displayName: user?.displayName || '',
      dateOfBirth: user?.dateOfBirth || '',
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      displayName: user?.displayName || '',
      dateOfBirth: user?.dateOfBirth || '',
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
    });
  };

  const handleSave = async () => {
    try {
      const updateData: any = {};
      if (formData.displayName !== user?.displayName) updateData.displayName = formData.displayName;
      if (formData.dateOfBirth !== user?.dateOfBirth) updateData.dateOfBirth = formData.dateOfBirth;
      if (formData.phoneNumber !== user?.phoneNumber) updateData.phoneNumber = formData.phoneNumber;
      if (formData.address !== user?.address) updateData.address = formData.address;

      if (Object.keys(updateData).length === 0) {
        toast.info('No changes to save');
        setIsEditing(false);
        return;
      }

      await updateProfile(updateData).unwrap();
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update profile');
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Profile</h1>
            <p className="text-muted-foreground text-sm">View and manage your profile information</p>
          </div>
          {!isEditing ? (
            <Button onClick={handleEdit} className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isUpdating} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isUpdating ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isUpdating} className='text-primary'>
                <X className="w-4 h-4 mr-2 text-primary" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="p-6">
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
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Display Name
                </label>
                {isEditing ? (
                  <Input
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="Enter display name"
                    className="mt-1"
                  />
                ) : (
                  <p className="font-medium mt-1">{user?.displayName}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="font-medium mt-1">@{user?.username}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium mt-1">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {user?.status?.toLowerCase() === 'active' && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                  <p className="font-medium capitalize">{user?.status}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                {isEditing ? (
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="Enter phone number"
                    className="mt-1"
                  />
                ) : (
                  <p className="font-medium mt-1">{user?.phoneNumber || 'Not provided'}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-muted-foreground flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Date of Birth
                </label>
                {isEditing ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !formData.dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dateOfBirth ? format(new Date(formData.dateOfBirth), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 dark" align="start">
                      <Calendar
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
                ) : (
                  <p className="font-medium mt-1">{user?.dateOfBirth ? formatDate(user.dateOfBirth) : 'Not provided'}</p>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </label>
              {isEditing ? (
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <p className="font-medium mt-1">{user?.address || 'Not provided'}</p>
              )}
            </div>
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
