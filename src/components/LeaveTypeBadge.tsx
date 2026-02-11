import { Badge } from '@/components/ui/badge';

interface LeaveTypeBadgeProps {
  type: string;
}

export function LeaveTypeBadge({ type }: LeaveTypeBadgeProps) {
  const typeLower = type.toLowerCase();

  const colors: Record<string, string> = {
    casual: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    sick: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    unpaid: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    maternity: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    paternity: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  };

  const color = colors[typeLower] || colors.casual;

  return (
    <Badge className={color}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
}
