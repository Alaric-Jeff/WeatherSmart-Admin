import React, { useMemo, useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TicketStatusBadge } from '../components/tickets/TicketStatusBadge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useTickets } from '../hooks/useTickets';
import { useAuth } from '../hooks/useAuth';
import { Trash2, CheckCircle, AlertCircle, Shield, Calendar, ArrowUpDown, Mail, User } from 'lucide-react';
import { TicketStatus } from '../lib/types';
import { toast } from 'sonner';
export function TicketsPage() {
  const {
    tickets,
    loading,
    error,
    updateStatus,
    deleteTicket
  } = useTickets();
  const {
    isSuperAdmin
  } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [statusChangeAction, setStatusChangeAction] = useState<{
    ticketId: string;
    status: TicketStatus;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    switch (dateFilter) {
      case 'today':
        return {
          start: today,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        };
      case 'week':
        {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 7);
          return {
            start: weekStart,
            end: weekEnd
          };
        }
      case 'month':
        {
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          return {
            start: monthStart,
            end: monthEnd
          };
        }
      case 'custom':
        if (customStartDate && customEndDate) {
          return {
            start: new Date(customStartDate),
            end: new Date(new Date(customEndDate).getTime() + 24 * 60 * 60 * 1000)
          };
        }
        return null;
      default:
        return null;
    }
  };
  const filteredAndSortedTickets = useMemo(() => {
    let filtered = tickets.filter(ticket => {
      // Status filter
      if (statusFilter !== 'all' && ticket.status !== statusFilter) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          ticket.description.toLowerCase().includes(query) ||
          ticket.userName.toLowerCase().includes(query) ||
          ticket.userEmail.toLowerCase().includes(query) ||
          ticket.issueType.toLowerCase().includes(query) ||
          ticket.ticketId.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      return true;
    });

    const dateRange = getDateRange();
    if (dateRange) {
      filtered = filtered.filter(ticket => {
        const ticketDate = new Date(ticket.createdDate);
        return ticketDate >= dateRange.start && ticketDate < dateRange.end;
      });
    }

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdDate).getTime();
      const dateB = new Date(b.createdDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return sorted;
  }, [tickets, statusFilter, dateFilter, customStartDate, customEndDate, sortOrder, searchQuery]);
  const handleStatusUpdate = async () => {
    if (!statusChangeAction) return;
    setIsProcessing(true);
    try {
      await updateStatus(statusChangeAction.ticketId, statusChangeAction.status);
      toast.success(`Ticket marked as ${statusChangeAction.status}`);
      setStatusChangeAction(null);
    } catch (error) {
      toast.error('Failed to update ticket status');
    } finally {
      setIsProcessing(false);
    }
  };
  const handleDelete = async () => {
    if (!ticketToDelete) return;
    setIsProcessing(true);
    try {
      await deleteTicket(ticketToDelete);
      toast.success('Ticket deleted successfully');
      setTicketToDelete(null);
    } catch (error) {
      toast.error('Failed to delete ticket');
    } finally {
      setIsProcessing(false);
    }
  };
  return <AdminLayout title="Support Tickets">
      {isSuperAdmin && <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 p-3 sm:p-4 rounded-lg">
          <div className="flex items-start gap-2 sm:gap-3">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs sm:text-sm text-red-900 min-w-0">
              <p className="font-semibold mb-1">Super-Admin Privilege</p>
              <p className="text-red-700">
                You can delete tickets regardless of their status. Regular
                admins can only view and update ticket statuses.
              </p>
            </div>
          </div>
        </div>}

      <Card className="mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <Input 
            label="Search" 
            placeholder="Search by name, email, description..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-0"
          />
          
          <Select label="Status" options={[{
          value: 'all',
          label: 'All Tickets'
        }, {
          value: 'unresolved',
          label: 'Open'
        }, {
          value: 'resolving',
          label: 'In Progress'
        }, {
          value: 'resolved',
          label: 'Resolved'
        }]} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="mb-0" />

          <Select label="Date Range" options={[{
          value: 'all',
          label: 'All Time'
        }, {
          value: 'today',
          label: 'Today'
        }, {
          value: 'week',
          label: 'This Week'
        }, {
          value: 'month',
          label: 'This Month'
        }, {
          value: 'custom',
          label: 'Custom Range'
        }]} value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="mb-0" />

          {dateFilter === 'custom' && <>
              <Input label="Start Date" type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="mb-0" />
              <Input label="End Date" type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="mb-0" />
            </>}

          <div className="flex items-end">
            <Button variant="outline" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="w-full" leftIcon={<ArrowUpDown className="h-4 w-4" />}>
              <span className="hidden sm:inline">
                {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
              </span>
              <span className="sm:hidden">
                {sortOrder === 'asc' ? 'Oldest' : 'Newest'}
              </span>
            </Button>
          </div>
        </div>
      </Card>

      <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
        Showing {filteredAndSortedTickets.length} of {tickets.length} tickets
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-800 text-sm">
            <strong>Error:</strong> {error}
          </p>
          <p className="text-red-700 text-xs mt-2">Please check your authentication and try again.</p>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {loading ? <div className="text-center py-10">Loading tickets...</div> : error ? (
          <div className="text-center py-10 text-gray-500">
            <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-red-400 mb-3" />
            <p className="text-sm sm:text-base">
              Unable to load tickets. {error}
            </p>
          </div>
        ) : filteredAndSortedTickets.length === 0 ? <div className="text-center py-10 text-gray-500">
            <Calendar className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-sm sm:text-base">
              No tickets found matching your filters.
            </p>
          </div> : filteredAndSortedTickets.map(ticket => <Card key={ticket.ticketId} className="hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-gray-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <TicketStatusBadge status={ticket.status} />
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold bg-gray-100 px-2 py-1 rounded">
                      {ticket.issueType || 'N/A'}
                    </span>
                    {ticket.ticketId && (
                      <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                        #{ticket.ticketId.slice(0, 12)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {ticket.createdDate ? new Date(ticket.createdDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                {/* Body */}
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 break-words">
                    {ticket.description || 'No description'}
                  </h3>

                  {/* Reporter Info */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3 space-y-2">
                    {ticket.userName && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{ticket.userName}</span>
                      </div>
                    )}
                    {ticket.userEmail && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 break-all">
                        <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span>{ticket.userEmail}</span>
                      </div>
                    )}
                    {!ticket.userName && !ticket.userEmail && (
                      <p className="text-sm text-gray-600">No reporter information available</p>
                    )}
                  </div>

                  {/* Notes */}
                  {ticket.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg text-xs sm:text-sm text-gray-700 border border-gray-100 break-words mb-3">
                      <strong className="text-gray-900">Notes:</strong>
                      <p className="mt-1">{ticket.notes}</p>
                    </div>
                  )}

                  {/* Timestamp */}
                  {ticket.resolvedDate && ticket.resolvedDate !== ticket.createdDate && (
                    <div className="text-xs text-gray-500">
                      <span>Last updated: {new Date(ticket.resolvedDate).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                  {ticket.status !== 'resolved' && <>
                      {ticket.status === 'unresolved' && <Button size="sm" variant="secondary" onClick={() => setStatusChangeAction({
                ticketId: ticket.ticketId,
                status: 'resolving'
              })} className="flex-1 sm:flex-none justify-center" leftIcon={<AlertCircle className="h-4 w-4" />}>
                          Start Work
                        </Button>}
                      <Button size="sm" variant="primary" onClick={() => setStatusChangeAction({
                ticketId: ticket.ticketId,
                status: 'resolved'
              })} className="flex-1 sm:flex-none justify-center" leftIcon={<CheckCircle className="h-4 w-4" />}>
                        Resolve
                      </Button>
                    </>}
                  {isSuperAdmin && <Button size="sm" variant="danger" onClick={() => setTicketToDelete(ticket.ticketId)} className="flex-1 sm:flex-none justify-center" leftIcon={<Trash2 className="h-4 w-4" />} title="Super-Admin only: Delete ticket">
                      Delete
                    </Button>}
                </div>
              </div>
            </Card>)}
      </div>

      <ConfirmDialog isOpen={!!statusChangeAction} onClose={() => setStatusChangeAction(null)} onConfirm={handleStatusUpdate} title="Update Ticket Status" message={`Are you sure you want to mark this ticket as "${statusChangeAction?.status}"? This action will be logged in the audit trail.`} confirmText="Update Status" variant="primary" isLoading={isProcessing} />

      <ConfirmDialog isOpen={!!ticketToDelete} onClose={() => setTicketToDelete(null)} onConfirm={handleDelete} title="Delete Ticket (Super-Admin)" message="Are you sure you want to permanently delete this ticket? This action cannot be undone and will be logged in the audit trail." confirmText="Delete Ticket" variant="danger" isLoading={isProcessing} />
    </AdminLayout>;
}