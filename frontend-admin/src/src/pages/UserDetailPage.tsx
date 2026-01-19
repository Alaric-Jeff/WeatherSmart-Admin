import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { UserStatusBadge } from '../components/users/UserStatusBadge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useUsers } from '../hooks/useUsers';
import { useDevices } from '../hooks/useDevices';
import { ArrowLeft, Mail, Shield, Smartphone, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { getUserInfo } from '../../api/users/get-user-info';

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleUserStatus, resetPassword } = useUsers();
  const { devices, unassignDevice } = useDevices();

  const [user, setUser] = useState<any | null>(null);
  const [userDevices, setUserDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmAction, setConfirmAction] = useState<{
    type: 'toggleStatus' | 'resetPassword' | 'unassignDevice';
    payload?: any;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch specific user on mount
 useEffect(() => {
  const fetchUser = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const userData = await getUserInfo(id);
      setUser(userData);
    } catch (err) {
      console.error('Error fetching user info:', err);
      toast.error('Failed to fetch user info');
    } finally {
      setLoading(false);
    }
  };
  fetchUser();
}, [id]);

// compute devices assigned to user whenever devices change
useEffect(() => {
  if (!user) return;
  setUserDevices(devices.filter(d => d.userIds.includes(user.uuid)));
}, [devices, user]);


  if (loading) {
    return (
      <AdminLayout title="User Details">
        <div className="text-center py-12 text-gray-500">Loading user info...</div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout title="User Not Found">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">User not found or does not exist.</p>
          <Button onClick={() => navigate('/users')}>Back to Users</Button>
        </div>
      </AdminLayout>
    );
  }

  const handleConfirm = async () => {
    if (!confirmAction) return;
    setIsProcessing(true);
    try {
      if (confirmAction.type === 'toggleStatus') {
        await toggleUserStatus(user.uuid);
        toast.success(`User account ${user.status === 'activated' ? 'disabled' : 'activated'} successfully`);
      } else if (confirmAction.type === 'resetPassword') {
        await resetPassword(user.uuid);
        toast.success('Password reset email sent');
      } else if (confirmAction.type === 'unassignDevice') {
        await unassignDevice(confirmAction.payload.deviceId, user.uuid);
        toast.success('Device unassigned successfully');
      }

      // Refresh user info after actions
      const refreshedUser = await getUserInfo(user.uuid);
      setUser(refreshedUser);

      setConfirmAction(null);
    } catch (err) {
      toast.error('Action failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AdminLayout title="User Details">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/users')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Users
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100 mb-6">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold mb-4">
                {(user.displayName ?? `${user.firstName} ${user.lastName}`)[0]}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.displayName ?? `${user.firstName} ${user.lastName}`}</h2>
              <p className="text-sm text-gray-500 mb-2">{user.email}</p>
              <UserStatusBadge status={user.status} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">User ID</span>
                <span className="font-mono text-gray-900">{user.uuid}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Joined</span>
                <span className="text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Devices</span>
                <span className="text-gray-900 font-semibold">{userDevices.length}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setConfirmAction({ type: 'resetPassword' })}
                leftIcon={<Mail className="h-4 w-4" />}
              >
                Send Password Reset
              </Button>
              <Button
                variant={user.status === 'activated' ? 'danger' : 'primary'}
                className="w-full justify-start"
                onClick={() => setConfirmAction({ type: 'toggleStatus' })}
                leftIcon={user.status === 'activated' ? <Lock className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
              >
                {user.status === 'activated' ? 'Disable Account' : 'Activate Account'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Devices List */}
        <div className="lg:col-span-2">
          <Card title={`Assigned Devices (${userDevices.length})`}>
            {userDevices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Smartphone className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>No devices assigned to this user.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/devices')}>
                  Assign Device
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MAC ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Other Users</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userDevices.map(device => {
                      const otherUsers = device.userNames?.filter((_: string | undefined, idx: number) => device.userIds[idx] !== user.uuid) || [];
                      return (
                        <tr key={device.deviceId}>
                          <td className="px-4 py-3 font-mono text-sm">{device.macId}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${device.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {device.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {otherUsers.length > 0 ? (
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                +{otherUsers.length} other user{otherUsers.length > 1 ? 's' : ''}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">Only this user</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {device.assignedDate ? new Date(device.assignedDate).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => setConfirmAction({ type: 'unassignDevice', payload: { deviceId: device.deviceId } })}
                            >
                              Unassign
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={
          confirmAction?.type === 'toggleStatus'
            ? user.status === 'activated'
              ? 'Disable Account'
              : 'Activate Account'
            : confirmAction?.type === 'resetPassword'
            ? 'Reset Password'
            : 'Unassign Device'
        }
        message={
          confirmAction?.type === 'toggleStatus'
            ? `Are you sure you want to ${user.status === 'activated' ? 'disable' : 'activate'} this user account?`
            : confirmAction?.type === 'resetPassword'
            ? 'Are you sure you want to send a password reset email to this user?'
            : 'Are you sure you want to unassign this device from this user? Other users will still have access to this device.'
        }
        confirmText="Confirm"
        variant={confirmAction?.type === 'toggleStatus' && user.status === 'activated' ? 'danger' : 'primary'}
        isLoading={isProcessing}
      />
    </AdminLayout>
  );
}
