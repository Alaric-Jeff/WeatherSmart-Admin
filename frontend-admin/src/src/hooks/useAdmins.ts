import { useState, useEffect } from 'react';
import { Admin } from '../lib/types';
const MOCK_ADMINS: Admin[] = [{
  adminId: 'admin-123',
  email: 'admin@weathersmart.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'super-admin',
  status: 'active',
  authMethod: 'email',
  createdDate: '2023-01-01T00:00:00Z',
  lastLogin: '2023-06-25T10:30:00Z',
  phoneNumber: '+1 (555) 123-4567',
  address: '123 Tech Blvd, Silicon Valley, CA'
}, {
  adminId: 'admin-456',
  email: 'sarah@weathersmart.com',
  firstName: 'Sarah',
  lastName: 'Connor',
  role: 'admin',
  status: 'active',
  authMethod: 'google',
  createdDate: '2023-03-15T09:00:00Z',
  lastLogin: '2023-06-24T14:15:00Z',
  phoneNumber: '+1 (555) 987-6543'
}, {
  adminId: 'admin-789',
  email: 'mike@weathersmart.com',
  firstName: 'Mike',
  lastName: 'Ross',
  role: 'admin',
  status: 'disabled',
  authMethod: 'email',
  createdDate: '2023-04-20T11:45:00Z',
  lastLogin: '2023-05-30T16:20:00Z'
}];
export function useAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAdmins = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAdmins(MOCK_ADMINS);
      setLoading(false);
    };
    fetchAdmins();
  }, []);
  const createAdmin = async (data: Partial<Admin>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newAdmin: Admin = {
      adminId: `admin-${Date.now()}`,
      email: data.email!,
      firstName: data.firstName!,
      lastName: data.lastName!,
      role: 'admin',
      status: 'active',
      authMethod: 'email',
      createdDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      ...data
    } as Admin;
    setAdmins(prev => [...prev, newAdmin]);
    return newAdmin;
  };
  const toggleAdminStatus = async (adminId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setAdmins(prev => prev.map(a => {
      if (a.adminId === adminId) {
        return {
          ...a,
          status: a.status === 'active' ? 'disabled' : 'active'
        };
      }
      return a;
    }));
  };
  return {
    admins,
    loading,
    createAdmin,
    toggleAdminStatus
  };
}