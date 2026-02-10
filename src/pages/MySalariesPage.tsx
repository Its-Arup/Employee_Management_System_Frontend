import { useState } from 'react';
import { useGetMySalariesQuery } from '@/store/api/salaryApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Calendar, Download, Eye } from 'lucide-react';
import { formatDate } from '@/helper/formatDate';

export function MySalariesPage() {
  const [page, setPage] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedSalary, setSelectedSalary] = useState<any>(null);

  const { data, isLoading } = useGetMySalariesQuery({ year, page, limit: 12 });

  const salaries = data?.data?.salaries || [];
  const pagination = data?.data?.pagination;

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processed: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      'on-hold': 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading salaries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Salary</h1>
          <p className="text-muted-foreground mt-1">View your salary history and details</p>
        </div>

        {/* Year Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Year:</label>
              <select
                value={year}
                onChange={(e) => {
                  setYear(Number(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Salary Cards */}
        {salaries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No salary records found for {year}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {salaries.map((salary: any) => (
              <Card key={salary._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {monthNames[salary.month - 1]} {salary.year}
                    </CardTitle>
                    {getStatusBadge(salary.status)}
                  </div>
                  <CardDescription>
                    {salary.isProrated ? 'Prorated Salary' : 'Full Salary'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-sm text-muted-foreground">Gross Salary</span>
                      <span className="font-semibold">₹{salary.grossSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Deductions</span>
                      <span className="text-red-600">-₹{salary.totalDeductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="font-medium">Net Salary</span>
                      <span className="text-xl font-bold text-green-600">
                        ₹{salary.netSalary.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-3 space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Working Days:</span>
                        <span>{salary.workingDays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Present Days:</span>
                        <span>{salary.presentDays}</span>
                      </div>
                      {salary.leaveDays > 0 && (
                        <div className="flex justify-between">
                          <span>Leave Days:</span>
                          <span>{salary.leaveDays}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      className="w-full mt-4 cursor-pointer"
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedSalary(salary)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="cursor-pointer"
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.pages}
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Detailed View Modal */}
        {selectedSalary && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Salary Details - {monthNames[selectedSalary.month - 1]} {selectedSalary.year}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSalary(null)} className="cursor-pointer">
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Earnings */}
                <div>
                  <h3 className="font-semibold mb-3">Earnings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Basic Salary:</span><span>₹{selectedSalary.structure.basic.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>HRA:</span><span>₹{selectedSalary.structure.hra.toLocaleString()}</span></div>
                    {selectedSalary.structure.medicalAllowance > 0 && (
                      <div className="flex justify-between"><span>Medical Allowance:</span><span>₹{selectedSalary.structure.medicalAllowance.toLocaleString()}</span></div>
                    )}
                    {selectedSalary.structure.transportAllowance > 0 && (
                      <div className="flex justify-between"><span>Transport Allowance:</span><span>₹{selectedSalary.structure.transportAllowance.toLocaleString()}</span></div>
                    )}
                    {selectedSalary.structure.otherAllowances > 0 && (
                      <div className="flex justify-between"><span>Other Allowances:</span><span>₹{selectedSalary.structure.otherAllowances.toLocaleString()}</span></div>
                    )}
                    {selectedSalary.structure.bonus > 0 && (
                      <div className="flex justify-between"><span>Bonus:</span><span>₹{selectedSalary.structure.bonus.toLocaleString()}</span></div>
                    )}
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Gross Salary:</span><span>₹{selectedSalary.grossSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h3 className="font-semibold mb-3">Deductions</h3>
                  <div className="space-y-2">
                    {selectedSalary.structure.providentFund > 0 && (
                      <div className="flex justify-between"><span>Provident Fund:</span><span>₹{selectedSalary.structure.providentFund.toLocaleString()}</span></div>
                    )}
                    {selectedSalary.structure.professionalTax > 0 && (
                      <div className="flex justify-between"><span>Professional Tax:</span><span>₹{selectedSalary.structure.professionalTax.toLocaleString()}</span></div>
                    )}
                    {selectedSalary.structure.incomeTax > 0 && (
                      <div className="flex justify-between"><span>Income Tax:</span><span>₹{selectedSalary.structure.incomeTax.toLocaleString()}</span></div>
                    )}
                    {selectedSalary.structure.otherDeductions > 0 && (
                      <div className="flex justify-between"><span>Other Deductions:</span><span>₹{selectedSalary.structure.otherDeductions.toLocaleString()}</span></div>
                    )}
                    <div className="flex justify-between font-semibold pt-2 border-t text-red-600">
                      <span>Total Deductions:</span><span>₹{selectedSalary.totalDeductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Net Salary */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Net Salary:</span>
                    <span className="text-2xl font-bold text-green-600">₹{selectedSalary.netSalary.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Info */}
                {selectedSalary.status === 'paid' && (
                  <div>
                    <h3 className="font-semibold mb-3">Payment Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Payment Method:</span>
                        <span className="capitalize">{selectedSalary.paymentMethod?.replace('-', ' ')}</span>
                      </div>
                      {selectedSalary.transactionId && (
                        <div className="flex justify-between">
                          <span>Transaction ID:</span>
                          <span>{selectedSalary.transactionId}</span>
                        </div>
                      )}
                      {selectedSalary.actualCreditDate && (
                        <div className="flex justify-between">
                          <span>Credited On:</span>
                          <span>{formatDate(selectedSalary.actualCreditDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
