import React from 'react';
import { Badge } from '../ui/Badge';
interface UserStatusBadgeProps {
  status: 'active' | 'disabled';
}
export function UserStatusBadge({
  status
}: UserStatusBadgeProps) {
  return <Badge variant={status === 'active' ? 'success' : 'danger'}>
      {status === 'active' ? 'Active' : 'Disabled'}
    </Badge>;
}