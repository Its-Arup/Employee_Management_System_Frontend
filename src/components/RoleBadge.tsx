import { Badge } from '@/components/ui/badge';

interface RoleBadgeProps {
  role: string;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const roleLower = role.toLowerCase();

  const variants: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    hr: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    manager: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    employee: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  };

  const color = variants[roleLower] || variants.employee;

  return (
    <Badge className={color}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </Badge>
  );
}
