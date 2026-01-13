import React, { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { SearchInput } from '../components/ui/SearchInput';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { Download, Shield, Activity, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { AuditLog } from '../lib/types';
export function AuditLogsPage() {
  const {
    logs,
    loading
  } = useAuditLogs();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) || log.details.toLowerCase().includes(searchTerm.toLowerCase()) || log.targetEntity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });
  const handleExport = () => {
    toast.success('Audit logs exported to CSV');
  };
  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };
  const getActionBadgeColor = (action: string) => {
    if (action.includes('Created') || action.includes('Enabled')) return 'success';
    if (action.includes('Disabled') || action.includes('Deleted')) return 'danger';
    if (action.includes('Updated') || action.includes('Assigned')) return 'warning';
    return 'neutral';
  };
  const formatDetails = (details: string) => {
    try {
      const parsed = JSON.parse(details);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return details;
    }
  };
  return <AdminLayout title="System Audit Logs">
      <div className="mb-6 bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-indigo-600 mt-0.5" />
          <div className="text-sm text-indigo-900">
            <p className="font-semibold mb-1">Complete System Monitoring</p>
            <p className="text-indigo-700">
              Track all administrative actions for security and accountability.
              View device creation, assignments, user account changes, and
              ticket updates.
            </p>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:w-1/3">
            <SearchInput placeholder="Search logs by admin, action, or entity..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Select options={[{
            value: 'all',
            label: 'All Actions'
          }, {
            value: 'Device Created',
            label: 'Device Created'
          }, {
            value: 'Device Assigned',
            label: 'Device Assigned'
          }, {
            value: 'Device Unassigned',
            label: 'Device Unassigned'
          }, {
            value: 'User Disabled',
            label: 'User Disabled'
          }, {
            value: 'User Enabled',
            label: 'User Enabled'
          }, {
            value: 'Password Reset',
            label: 'Password Reset'
          }, {
            value: 'Ticket Updated',
            label: 'Ticket Updated'
          }, {
            value: 'Ticket Deleted',
            label: 'Ticket Deleted'
          }, {
            value: 'Admin Created',
            label: 'Admin Created'
          }, {
            value: 'Admin Disabled',
            label: 'Admin Disabled'
          }]} value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="mb-0 w-48" />
            <Button variant="outline" onClick={handleExport} leftIcon={<Download className="h-4 w-4" />}>
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    Loading logs...
                  </td>
                </tr> : filteredLogs.length === 0 ? <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    <Activity className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                    No logs found matching your filters
                  </td>
                </tr> : filteredLogs.map(log => <tr key={log.logId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs mr-2">
                          {log.adminName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {log.adminName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getActionBadgeColor(log.action) as any}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {log.targetEntity} #{log.targetId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleViewDetails(log)} className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition-colors" aria-label="View details">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>)}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Audit Log Coverage
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600">
          <div>
            <p className="font-medium text-gray-900 mb-1">Device Management</p>
            <ul className="space-y-0.5">
              <li>• Device creation</li>
              <li>• Device assignment</li>
              <li>• Device revocation</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">User Accounts</p>
            <ul className="space-y-0.5">
              <li>• Account disabled</li>
              <li>• Account enabled</li>
              <li>• Password reset</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">Ticket Management</p>
            <ul className="space-y-0.5">
              <li>• Status updates</li>
              <li>• Ticket deletion</li>
              <li>• Notes added</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">Admin Management</p>
            <ul className="space-y-0.5">
              <li>• Admin created</li>
              <li>• Admin disabled</li>
              <li>• Admin enabled</li>
            </ul>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Audit Log Details" maxWidth="lg">
        {selectedLog && <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Timestamp
                </p>
                <p className="text-sm text-gray-900">
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Admin User
                </p>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-[10px] mr-2">
                    {selectedLog.adminName.charAt(0)}
                  </div>
                  <p className="text-sm text-gray-900">
                    {selectedLog.adminName}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Action Type
                </p>
                <Badge variant={getActionBadgeColor(selectedLog.action) as any}>
                  {selectedLog.action}
                </Badge>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Target Resource
                </p>
                <p className="text-sm text-gray-900 font-mono">
                  {selectedLog.targetEntity} #{selectedLog.targetId}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">
                Detailed Changes
              </p>
              <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
                <pre className="text-xs text-gray-100 font-mono whitespace-pre-wrap">
                  {formatDetails(selectedLog.details)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </div>
          </div>}
      </Modal>
    </AdminLayout>;
}