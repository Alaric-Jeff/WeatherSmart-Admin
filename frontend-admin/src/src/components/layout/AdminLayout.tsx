import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Menu, X } from 'lucide-react';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useAuth } from '../../hooks/useAuth';
interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}
export function AdminLayout({
  children,
  title
}: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { logout } = useAuth();
  return <div className="min-h-screen bg-blue-50 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setMobileMenuOpen(false)} onLogoutRequest={() => setShowLogoutConfirm(true)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full md:ml-64">
        {/* Mobile Header */}
        <div className="md:hidden bg-blue-600 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-blue-700 rounded-lg transition-colors" aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <span className="font-bold text-lg">WeatherSmart</span>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        <Header title={title} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          logout();
        }}
        title="Sign out"
        message="Are you sure you want to sign out? You'll be returned to the login screen."
        confirmText="Sign out"
        cancelText="Stay logged in"
        variant="warning"
      />
    </div>;
}