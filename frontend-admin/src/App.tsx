import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LoginPage } from './src/pages/LoginPage';
import { DashboardPage } from './src/pages/DashboardPage';
import { UsersPage } from './src/pages/UsersPage';
import { UserDetailPage } from './src/pages/UserDetailPage';
import { DevicesPage } from './src/pages/DevicesPage';
import { TicketsPage } from './src/pages/TicketsPage';
import { AdminsPage } from './src/pages/AdminsPage';
import { AdminDetailPage } from './src/pages/AdminDetailPage';
import { AuditLogsPage } from './src/pages/AuditLogsPage';
import { EmailTemplatesPage } from './src/pages/EmailTemplatesPage';
import { AccountSettingsPage } from './src/pages/AccountSettingsPage';
import { useAuth } from './src/hooks/useAuth';
// Protected Route Wrapper
const ProtectedRoute = ({
  children,
  requireSuperAdmin = false
}: {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}) => {
  const {
    isAuthenticated,
    isSuperAdmin,
    loading
  } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};
export function App() {
  return <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>} />

        <Route path="/users" element={<ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>} />

        <Route path="/users/:id" element={<ProtectedRoute>
              <UserDetailPage />
            </ProtectedRoute>} />

        <Route path="/devices" element={<ProtectedRoute>
              <DevicesPage />
            </ProtectedRoute>} />

        <Route path="/tickets" element={<ProtectedRoute>
              <TicketsPage />
            </ProtectedRoute>} />

        <Route path="/emails" element={<ProtectedRoute>
              <EmailTemplatesPage />
            </ProtectedRoute>} />

        <Route path="/settings" element={<ProtectedRoute>
              <AccountSettingsPage />
            </ProtectedRoute>} />

        {/* Super Admin Routes */}
        <Route path="/admins" element={<ProtectedRoute requireSuperAdmin>
              <AdminsPage />
            </ProtectedRoute>} />

        <Route path="/admins/:id" element={<ProtectedRoute requireSuperAdmin>
              <AdminDetailPage />
            </ProtectedRoute>} />

        <Route path="/audit-logs" element={<ProtectedRoute requireSuperAdmin>
              <AuditLogsPage />
            </ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>;
}