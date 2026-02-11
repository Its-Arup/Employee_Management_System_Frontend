import { Badge } from '@/components/ui/badge';
import { Clock, Check, X, Ban } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = false }: StatusBadgeProps) {
  const statusLower = status.toLowerCase();

  const variants: Record<string, { color: string; icon?: any }> = {
    // User status
    active: {
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    },
    pending: {
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      icon: Clock,
    },
    suspended: {
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    },
    rejected: {
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      icon: X,
    },
    // Leave status
    approved: {
      color: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
      icon: Check,
    },
    cancelled: {
      color: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
      icon: Ban,
    },
    // Salary status
    processed: {
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    },
    paid: {
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    },
    'on-hold': {
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    },
  };

  const variant = variants[statusLower] || variants.pending;
  const Icon = variant.icon;
  const withBorder = ['approved', 'cancelled', 'pending'].includes(statusLower);

  return (
    <Badge className={`${withBorder ? 'border ' : ''}${variant.color}`}>
      {showIcon && Icon && <Icon className="w-3 h-3" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
