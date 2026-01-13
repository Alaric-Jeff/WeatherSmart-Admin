import { useState, useEffect } from 'react';
import { User } from '../lib/types';
const MOCK_USERS: User[] = [{
  userId: 'u1',
  name: 'John Doe',
  email: 'john@example.com',
  status: 'active',
  createdDate: '2023-01-15T10:00:00Z',
  lastLogin: '2023-06-20T14:30:00Z',
  assignedDevices: ['AA:BB:CC:11:22:33'],
  deviceCount: 1
}, {
  userId: 'u2',
  name: 'Jane Smith',
  email: 'jane@example.com',
  status: 'active',
  createdDate: '2023-02-10T09:15:00Z',
  lastLogin: '2023-06-21T08:45:00Z',
  assignedDevices: [],
  deviceCount: 0
}, {
  userId: 'u3',
  name: 'Robert Johnson',
  email: 'robert@example.com',
  status: 'disabled',
  createdDate: '2023-03-05T11:20:00Z',
  lastLogin: '2023-05-15T16:00:00Z',
  assignedDevices: ['DD:EE:FF:44:55:66', '11:22:33:44:55:66'],
  deviceCount: 2
}];
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate fetch
    const fetchUsers = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setUsers(MOCK_USERS);
      setLoading(false);
    };
    fetchUsers();
  }, []);
  const toggleUserStatus = async (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.userId === userId) {
        return {
          ...u,
          status: u.status === 'active' ? 'disabled' : 'active'
        };
      }
      return u;
    }));
  };
  const resetPassword = async (userId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Password reset email sent to user ${userId}`);
    return true;
  };
  return {
    users,
    loading,
    toggleUserStatus,
    resetPassword
  };
}