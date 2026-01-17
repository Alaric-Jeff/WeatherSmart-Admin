import { useState, useEffect } from 'react';
import { Device } from '../lib/types';

const MOCK_DEVICES: Device[] = [
  {
    deviceId: 'd1',
    macId: 'AA:BB:CC:11:22:33',
    userIds: ['u1', 'u2'],
    userNames: ['John Doe', 'Jane Smith'],
    status: 'active',
    createdDate: '2023-01-20T10:00:00Z',
    assignedDate: '2023-01-25T14:00:00Z'
  },
  {
    deviceId: 'd2',
    macId: 'DD:EE:FF:44:55:66',
    userIds: ['u3'],
    userNames: ['Robert Johnson'],
    status: 'active',
    createdDate: '2023-03-10T09:00:00Z',
    assignedDate: '2023-03-12T11:00:00Z'
  },
  {
    deviceId: 'd3',
    macId: '11:22:33:44:55:66',
    userIds: ['u3'],
    userNames: ['Robert Johnson'],
    status: 'inactive',
    createdDate: '2023-04-05T15:30:00Z',
    assignedDate: '2023-04-10T10:00:00Z'
  },
  {
    deviceId: 'd4',
    macId: '99:88:77:66:55:44',
    userIds: [],
    userNames: [],
    status: 'unassigned',
    createdDate: '2023-06-01T12:00:00Z',
    assignedDate: null
  }
];

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setDevices(MOCK_DEVICES);
      setLoading(false);
    };
    fetchDevices();
  }, []);

  const createDevice = async (macId: string) => {
    const newDevice: Device = {
      deviceId: `d${Date.now()}`,
      macId,
      userIds: [],
      userNames: [],
      status: 'unassigned',
      createdDate: new Date().toISOString(),
      assignedDate: null
    };
    setDevices(prev => [...prev, newDevice]);
    return newDevice;
  };

  const assignDevice = async (deviceId: string, userId: string, userName: string) => {
    setDevices(prev => prev.map(d => {
      if (d.deviceId === deviceId) {
        const newUserIds = [...d.userIds, userId];
        const newUserNames = [...(d.userNames || []), userName];
        return {
          ...d,
          userIds: newUserIds,
          userNames: newUserNames,
          status: 'active',
          assignedDate: d.assignedDate || new Date().toISOString()
        };
      }
      return d;
    }));
  };

  const unassignDevice = async (deviceId: string, userId: string) => {
    setDevices(prev => prev.map(d => {
      if (d.deviceId === deviceId) {
        const userIndex = d.userIds.indexOf(userId);
        const newUserIds = d.userIds.filter(id => id !== userId);
        const newUserNames = (d.userNames || []).filter((_, idx) => idx !== userIndex);
        return {
          ...d,
          userIds: newUserIds,
          userNames: newUserNames,
          status: newUserIds.length === 0 ? 'unassigned' : d.status,
          assignedDate: newUserIds.length === 0 ? null : d.assignedDate
        };
      }
      return d;
    }));
  };

  const updateDevice = async (deviceId: string, macId: string, _reason?: string) => {
    setDevices(prev => prev.map(d => d.deviceId === deviceId ? { ...d, macId } : d));
  };

  const deleteDevice = async (deviceId: string, _reason?: string) => {
    setDevices(prev => prev.filter(d => d.deviceId !== deviceId));
  };

  return {
    devices,
    loading,
    createDevice,
    assignDevice,
    unassignDevice,
    updateDevice,
    deleteDevice
  };
}