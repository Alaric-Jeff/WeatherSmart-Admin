import { useState, useEffect } from 'react';
import { Admin } from '../lib/types';
import { frontendSignIn } from '../../api/shared/get-signin-cred';
import { adminSignIn } from '../../api/shared/admin-sign-in';

export function useAuth() {
  const [user, setUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load stored session from localStorage
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
    // 1️⃣ Sign in with Firebase Auth
    const idToken = await frontendSignIn(email, password);

    // 2️⃣ Verify admin role with backend
    const backendData = await adminSignIn(idToken);
    console.log('Raw backend response:', backendData);

    // Extract the actual user object
    const userData = backendData.data;
    console.log('Mapped backend data:', userData);

    // 3️⃣ Map backendData to match Admin type
    const mappedAdmin: Admin = {
      adminId: userData.uid ?? '', // uid from backend
      email: userData.email ?? '',
      firstName: userData.displayName?.split(' ')[0] ?? '',
      lastName: userData.displayName?.split(' ').slice(1).join(' ') ?? '',
      role: userData.role,
      status: 'active',
      authMethod: 'email',
      createdDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    console.log('Mapped admin object:', mappedAdmin);

    // 4️⃣ Store in state & localStorage
    setUser(mappedAdmin);
    localStorage.setItem('ws_admin_user', JSON.stringify(mappedAdmin));

    return mappedAdmin;
  } catch (err: any) {
    setError(err.message || 'Failed to login');
    throw err;
  } finally {
    setLoading(false);
  }
};




  // Optional: keep Google login for future
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      alert('Google login not implemented yet');
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
    const updatedUser = { ...user, ...data };
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
    isSuperAdmin: user?.role === 'super-admin',
  };
}
