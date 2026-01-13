import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { RefreshCw } from 'lucide-react';
interface CreateDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (macId: string) => Promise<void>;
}
export function CreateDeviceModal({
  isOpen,
  onClose,
  onCreate
}: CreateDeviceModalProps) {
  const [macId, setMacId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const generateMac = () => {
    // Generate random MAC address
    const hex = '0123456789ABCDEF';
    let mac = '';
    for (let i = 0; i < 6; i++) {
      mac += hex.charAt(Math.floor(Math.random() * 16));
      mac += hex.charAt(Math.floor(Math.random() * 16));
      if (i < 5) mac += ':';
    }
    setMacId(mac);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!macId) return;
    setIsSubmitting(true);
    try {
      await onCreate(macId);
      setMacId('');
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return <Modal isOpen={isOpen} onClose={onClose} title="Register New Device">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input label="MAC Address" value={macId} onChange={e => setMacId(e.target.value)} placeholder="AA:BB:CC:11:22:33" required pattern="^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$" error={macId && !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(macId) ? 'Invalid MAC format' : undefined} />
          </div>
          <Button type="button" variant="secondary" onClick={generateMac} className="mb-4" title="Auto-generate MAC">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
          <strong>Note:</strong> The MAC ID is immutable once created. Please
          ensure it is correct.
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={!macId}>
            Create Device
          </Button>
        </div>
      </form>
    </Modal>;
}