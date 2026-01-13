import { useState, useEffect } from 'react';
import { Admin, Role } from '../lib/types';

// Mock user for MVP preview
const MOCK_ADMIN: Admin = {
  adminId: 'admin-123',
  email: 'admin@weathersmart.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'super-admin',
  // Default to super-admin for demo purposes
  status: 'active',
  authMethod: 'email',
  createdDate: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  phoneNumber: '+1 (555) 123-4567',
  address: '123 Tech Blvd, Silicon Valley, CA'
};
export function useAuth() {
  const [user, setUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const stored = localStorage.getItem('ws_admin_user');
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (email === 'admin@demo.com' && password === 'password') {
        const admin = {
          ...MOCK_ADMIN,
          email
        };
        setUser(admin);
        localStorage.setItem('ws_admin_user', JSON.stringify(admin));
        return admin;
      } else if (email === 'user@demo.com' && password === 'password') {
        const admin: Admin = {
          ...MOCK_ADMIN,
          email,
          role: 'admin',
          adminId: 'admin-456'
        };
        setUser(admin);
        localStorage.setItem('ws_admin_user', JSON.stringify(admin));
        return admin;
      } else {
        throw new Error('Invalid credentials. Try admin@demo.com / password');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const admin = {
        ...MOCK_ADMIN,
        authMethod: 'google' as const
      };
      setUser(admin);
      localStorage.setItem('ws_admin_user', JSON.stringify(admin));
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    setUser(null);
    localStorage.removeItem('ws_admin_user');
  };
  const updateProfile = async (data: Partial<Admin>) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      ...data
    };
    setUser(updatedUser);
    localStorage.setItem('ws_admin_user', JSON.stringify(updatedUser));
  };
  return {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'super-admin'
  };
}