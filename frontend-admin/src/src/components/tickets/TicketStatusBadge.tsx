import React from 'react';
import { Badge } from '../ui/Badge';
import { TicketStatus } from '../../lib/types';
interface TicketStatusBadgeProps {
  status: TicketStatus;
}
export function TicketStatusBadge({
  status
}: TicketStatusBadgeProps) {
  const variants: Record<TicketStatus, 'success' | 'warning' | 'danger'> = {
    resolved: 'success',
    resolving: 'warning',
    unresolved: 'danger'
  };
  const labels: Record<TicketStatus, string> = {
    resolved: 'Resolved',
    resolving: 'In Progress',
    unresolved: 'Open'
  };
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}