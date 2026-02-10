import { useState } from 'react';
import { useApplyLeaveMutation } from '@/store/api/leaveApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ApplyLeavePage() {
  const navigate = useNavigate();
  const [applyLeave, { isLoading }] = useApplyLeaveMutation();

  const [formData, setFormData] = useState({
    leaveType: 'casual' as 'casual' | 'sick' | 'paid' | 'unpaid' | 'maternity' | 'paternity',
    startDate: '',
    endDate: '',
    reason: '',
    isHalfDay: false,
    halfDayPeriod: 'first-half' as 'first-half' | 'second-half',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await applyLeave(formData).unwrap();
      toast.success('Leave Applied', {
        description: result.message || 'Your leave request has been submitted successfully.',
      });
      navigate('/leaves/my-leaves');
    } catch (error: any) {
      toast.error('Failed to apply leave', {
        description: error.data?.message || 'An error occurred while applying for leave.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 cursor-pointer"
          onClick={() => navigate('/leaves/my-leaves')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Leaves
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <CardTitle>Apply for Leave</CardTitle>
                <CardDescription>Submit a new leave request</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Leave Type */}
              <div className="space-y-2">
                <Label htmlFor="leaveType">Leave Type *</Label>
                <select
                  id="leaveType"
                  value={formData.leaveType}
                  onChange={(e) =>
                    setFormData({ ...formData, leaveType: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="paid">Paid Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="paternity">Paternity Leave</option>
                </select>
              </div>

              {/* Half Day Option */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isHalfDay"
                  checked={formData.isHalfDay}
                  onChange={(e) =>
                    setFormData({ ...formData, isHalfDay: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="isHalfDay">Half Day Leave</Label>
              </div>

              {/* Half Day Period (only if half day is checked) */}
              {formData.isHalfDay && (
                <div className="space-y-2">
                  <Label htmlFor="halfDayPeriod">Half Day Period *</Label>
                  <select
                    id="halfDayPeriod"
                    value={formData.halfDayPeriod}
                    onChange={(e) =>
                      setFormData({ ...formData, halfDayPeriod: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    required
                  >
                    <option value="first-half">First Half</option>
                    <option value="second-half">Second Half</option>
                  </select>
                </div>
              )}

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="Enter the reason for your leave..."
                  rows={4}
                  required
                  minLength={10}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.reason.length}/500 characters (minimum 10)
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button type="submit" disabled={isLoading} className="flex-1 cursor-pointer">
                  {isLoading ? 'Submitting...' : 'Submit Leave Request'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/leaves/my-leaves')}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
