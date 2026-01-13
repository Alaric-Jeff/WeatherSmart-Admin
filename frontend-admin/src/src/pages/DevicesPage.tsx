import React, { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { Badge } from '../components/ui/Badge';
import { CreateDeviceModal } from '../components/devices/CreateDeviceModal';
import { AssignDeviceModal } from '../components/devices/AssignDeviceModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useDevices } from '../hooks/useDevices';
import { Plus, Link as LinkIcon, Unlink, Users } from 'lucide-react';
import { toast } from 'sonner';
export function DevicesPage() {
  const {
    devices,
    loading,
    createDevice,
    assignDevice,
    unassignDevice
  } = useDevices();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [unassignAction, setUnassignAction] = useState<{
    deviceId: string;
    userId: string;
    userName: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const filteredDevices = devices.filter(device => device.macId.toLowerCase().includes(searchTerm.toLowerCase()) || device.userNames && device.userNames.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())));
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'inactive':
        return <Badge variant="warning">Inactive</Badge>;
      case 'unassigned':
        return <Badge variant="neutral">Unassigned</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  const handleCreate = async (macId: string) => {
    try {
      await createDevice(macId);
      toast.success('Device registered successfully');
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error('Failed to register device');
    }
  };
  const handleAssign = async (userId: string, userName: string) => {
    if (!selectedDevice) return;
    try {
      await assignDevice(selectedDevice, userId, userName);
      toast.success(`Device assigned to ${userName}`);
    } catch (error) {
      toast.error('Failed to assign device');
    }
  };
  const handleUnassign = async () => {
    if (!unassignAction) return;
    setIsProcessing(true);
    try {
      await unassignDevice(unassignAction.deviceId, unassignAction.userId);
      toast.success(`Device unassigned from ${unassignAction.userName}`);
      setUnassignAction(null);
    } catch (error) {
      toast.error('Failed to unassign device');
    } finally {
      setIsProcessing(false);
    }
  };
  const openAssignModal = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setIsAssignModalOpen(true);
  };
  return <AdminLayout title="Device Management">
      <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Many-to-Many Device Assignment</p>
            <p className="text-blue-700">
              Devices can be assigned to multiple users, and users can have
              multiple devices. Each assignment is independent.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="w-1/3">
          <SearchInput placeholder="Search by MAC ID or User..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Register Device
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MAC Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    Loading devices...
                  </td>
                </tr> : filteredDevices.length === 0 ? <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    No devices found
                  </td>
                </tr> : filteredDevices.map(device => <tr key={device.deviceId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">
                      {device.macId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(device.status)}
                    </td>
                    <td className="px-6 py-4">
                      {device.userIds.length === 0 ? <span className="text-gray-400 italic text-sm">
                          No users assigned
                        </span> : <div className="space-y-1">
                          {device.userNames?.map((userName, idx) => <div key={idx} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded text-sm">
                              <span className="text-gray-700">{userName}</span>
                              <button onClick={() => setUnassignAction({
                      deviceId: device.deviceId,
                      userId: device.userIds[idx],
                      userName
                    })} className="text-red-600 hover:text-red-800 ml-2" title="Unassign from this user">
                                <Unlink className="h-3 w-3" />
                              </button>
                            </div>)}
                        </div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(device.createdDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900" onClick={() => openAssignModal(device.deviceId)} title="Assign to User">
                        <LinkIcon className="h-4 w-4 mr-1" /> Assign
                      </Button>
                    </td>
                  </tr>)}
            </tbody>
          </table>
        </div>
      </Card>

      <CreateDeviceModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onCreate={handleCreate} />

      <AssignDeviceModal isOpen={isAssignModalOpen} onClose={() => {
      setIsAssignModalOpen(false);
      setSelectedDevice(null);
    }} onAssign={handleAssign} currentUserIds={selectedDevice ? devices.find(d => d.deviceId === selectedDevice)?.userIds || [] : []} />

      <ConfirmDialog isOpen={!!unassignAction} onClose={() => setUnassignAction(null)} onConfirm={handleUnassign} title="Unassign Device" message={`Are you sure you want to unassign this device from ${unassignAction?.userName}? Other users will still have access to this device.`} confirmText="Unassign" variant="warning" isLoading={isProcessing} />
    </AdminLayout>;
}