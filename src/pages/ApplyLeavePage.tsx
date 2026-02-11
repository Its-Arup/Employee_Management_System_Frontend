import { useState } from 'react';
import { useApplyLeaveMutation } from '@/store/api/leaveApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-primary">Apply for Leave</h1>
          <p className="text-muted-foreground text-sm">Submit a new leave request</p>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-3xl mx-auto">
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
                <Select
                  value={formData.leaveType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, leaveType: value as any })
                  }
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent className='dark'>
                    <SelectItem value="casual">Casual Leave</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="paid">Paid Leave</SelectItem>
                    <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    <SelectItem value="maternity">Maternity Leave</SelectItem>
                    <SelectItem value="paternity">Paternity Leave</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Select
                    value={formData.halfDayPeriod}
                    onValueChange={(value) =>
                      setFormData({ ...formData, halfDayPeriod: value as any })
                    }
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-half">First Half</SelectItem>
                      <SelectItem value="second-half">Second Half</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(new Date(formData.startDate), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 dark" align="start">
                      <CalendarComponent
                        mode="single"
                        captionLayout="dropdown"
                        selected={formData.startDate ? new Date(formData.startDate) : undefined}
                        onSelect={(date) => setFormData({ ...formData, startDate: date ? format(date, "yyyy-MM-dd") : '' })}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.endDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(new Date(formData.endDate), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 dark" align="start">
                      <CalendarComponent
                        mode="single"
                        captionLayout="dropdown"
                        selected={formData.endDate ? new Date(formData.endDate) : undefined}
                        onSelect={(date) => setFormData({ ...formData, endDate: date ? format(date, "yyyy-MM-dd") : '' })}
                        disabled={(date) => {
                          const minDate = formData.startDate ? new Date(formData.startDate) : new Date();
                          return date < minDate;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
    </div>
  );
}
