import { useState, useEffect } from 'react';
import { Ticket, TicketStatus } from '../lib/types';
const MOCK_TICKETS: Ticket[] = [{
  ticketId: 't1',
  userId: 'u1',
  userName: 'John Doe',
  userEmail: 'john@example.com',
  issueType: 'sensor',
  description: 'Temperature sensor reading inconsistent values in Rack 4.',
  status: 'unresolved',
  createdDate: '2023-06-20T09:30:00Z',
  resolvedDate: null,
  notes: ''
}, {
  ticketId: 't2',
  userId: 'u2',
  userName: 'Jane Smith',
  userEmail: 'jane@example.com',
  issueType: 'connectivity',
  description: 'Cannot connect to device from mobile app since update.',
  status: 'resolving',
  createdDate: '2023-06-19T14:15:00Z',
  resolvedDate: null,
  notes: 'Investigating API logs.'
}, {
  ticketId: 't3',
  userId: 'u3',
  userName: 'Robert Johnson',
  userEmail: 'robert@example.com',
  issueType: 'hardware',
  description: 'Power unit making strange noise.',
  status: 'resolved',
  createdDate: '2023-06-15T11:00:00Z',
  resolvedDate: '2023-06-16T10:00:00Z',
  notes: 'Replaced fan unit.'
}];
export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTickets = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setTickets(MOCK_TICKETS);
      setLoading(false);
    };
    fetchTickets();
  }, []);
  const updateStatus = async (ticketId: string, status: TicketStatus) => {
    setTickets(prev => prev.map(t => {
      if (t.ticketId === ticketId) {
        return {
          ...t,
          status,
          resolvedDate: status === 'resolved' ? new Date().toISOString() : null
        };
      }
      return t;
    }));
  };
  const deleteTicket = async (ticketId: string) => {
    setTickets(prev => prev.filter(t => t.ticketId !== ticketId));
  };
  return {
    tickets,
    loading,
    updateStatus,
    deleteTicket
  };
}