import { useState, useEffect } from 'react';
import { Admin } from '../lib/types';
import { frontendSignIn } from '../../api/shared/get-signin-cred';
import { adminSignIn } from '../../api/shared/admin-sign-in';

export function useAuth() {
  const [user, setUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load stored session from localStorage and keep subscribers in sync
  useEffect(() => {
    const syncUserFromStorage = () => {
      setLoading(true);
      try {
        const stored = localStorage.getItem('ws_admin_user');
        setUser(stored ? JSON.parse(stored) : null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    syncUserFromStorage();
    const handleAuthChange = () => syncUserFromStorage();

    // Listen for auth changes triggered by login/logout (custom) and cross-tab storage updates
    window.addEventListener('ws-auth-changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('ws-auth-changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Sign in with Firebase Auth
      const idToken = await frontendSignIn(email, password);

      // 2️⃣ Store the ID token in localStorage
      localStorage.setItem('idToken', idToken);

      // 3️⃣ Verify admin role with backend
      const backendData = await adminSignIn(idToken);
      console.log('Raw backend response:', backendData);

      // Extract the actual user object
      const userData = backendData.data;
      console.log('Mapped backend data:', userData);

      // 4️⃣ Map backendData to match Admin type
      const mappedAdmin: Admin = {
        adminId: userData.uid ?? '', // uid from backend
        email: userData.email ?? '',
        firstName: userData.firstName,
        lastName: userData.lastName,
        middleName: userData.middleName ? userData.middleName : "",
        role: userData.role,
        status: 'active',
        authMethod: 'email',
        createdDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      console.log('Mapped admin object:', mappedAdmin);

      // 5️⃣ Store in state & localStorage
      setUser(mappedAdmin);
      localStorage.setItem('ws_admin_user', JSON.stringify(mappedAdmin));

      // Notify other hook instances to refresh state without reload
      window.dispatchEvent(new Event('ws-auth-changed'));

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
    localStorage.removeItem('idToken'); // Remove the token on logout

    // Broadcast the change so ProtectedRoute re-renders immediately
    window.dispatchEvent(new Event('ws-auth-changed'));
  };

  const updateProfile = async (data: Partial<Admin>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('ws_admin_user', JSON.stringify(updatedUser));
  };

  // Helper function to get the current ID token
  const getIdToken = () => {
    return localStorage.getItem('idToken');
  };

  return {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    logout,
    updateProfile,
    getIdToken, // Export this so other components can access the token
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === 'super-admin',
  };
}