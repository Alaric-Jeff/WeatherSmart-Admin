import React from 'react';
import { Badge } from '../ui/Badge';

interface UserStatusBadgeProps {
  status: 'activated' | 'disabled' | string; 
}
export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const isActive = status === 'activated';

  return (
    <Badge variant={isActive ? 'success' : 'danger'}>
      {isActive ? 'Activated' : 'Disabled'}
    </Badge>
  );
}
