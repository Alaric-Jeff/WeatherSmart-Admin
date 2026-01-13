import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useUsers } from '../../hooks/useUsers';
interface AssignDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (userId: string, userName: string) => Promise<void>;
  currentUserIds: string[];
}
export function AssignDeviceModal({
  isOpen,
  onClose,
  onAssign,
  currentUserIds
}: AssignDeviceModalProps) {
  const {
    users
  } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Filter out users already assigned to this device
  const availableUsers = users.filter(u => !currentUserIds.includes(u.userId) && u.status === 'active');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    setIsSubmitting(true);
    try {
      const user = users.find(u => u.userId === selectedUserId);
      if (user) {
        await onAssign(selectedUserId, user.name);
        setSelectedUserId('');
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return <Modal isOpen={isOpen} onClose={onClose} title="Assign Device to User">
      <form onSubmit={handleSubmit} className="space-y-4">
        {availableUsers.length === 0 ? <div className="text-center py-4 text-gray-500">
            <p>
              No available users to assign. All active users are already
              assigned to this device.
            </p>
          </div> : <>
            <Select label="Select User" options={[{
          value: '',
          label: 'Choose a user...'
        }, ...availableUsers.map(u => ({
          value: u.userId,
          label: `${u.name} (${u.email})`
        }))]} value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} required />

            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
              <strong>Note:</strong> This device can be assigned to multiple
              users. Each user will have independent access.
            </div>
          </>}

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          {availableUsers.length > 0 && <Button type="submit" isLoading={isSubmitting} disabled={!selectedUserId}>
              Assign Device
            </Button>}
        </div>
      </form>
    </Modal>;
}