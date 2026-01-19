import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Server, Ticket, LogOut, CloudRain, Shield, Mail, FileText, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
interface SidebarProps {
  onClose?: () => void;
  onLogoutRequest?: () => void;
}
export function Sidebar({
  onClose,
  onLogoutRequest
}: SidebarProps) {
  const location = useLocation();
  const {
    isSuperAdmin
  } = useAuth();
  const navItems = [{
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard
  }, {
    name: 'Users',
    path: '/users',
    icon: Users
  }, {
    name: 'Devices',
    path: '/devices',
    icon: Server
  }, {
    name: 'Tickets',
    path: '/tickets',
    icon: Ticket
  }, {
    name: 'Email Notifications',
    path: '/emails',
    icon: Mail
  }];
  const superAdminItems = [{
    name: 'Admin Management',
    path: '/admins',
    icon: Shield
  }, {
    name: 'Audit Logs',
    path: '/audit-logs',
    icon: FileText
  }];
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  const handleNavClick = () => {
    if (onClose) onClose();
  };
  return <div className="flex flex-col w-64 bg-blue-600 text-white h-screen shadow-xl">
      <div className="p-6 flex items-center space-x-3 border-b border-blue-500">
        <CloudRain className="h-8 w-8 text-white flex-shrink-0" />
        <div className="min-w-0">
          <h1 className="text-lg font-bold leading-tight truncate">
            WeatherSmart
          </h1>
          <p className="text-xs text-blue-200 truncate">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">
          Menu
        </p>
        {navItems.map(item => <Link key={item.name} to={item.path} onClick={handleNavClick} className={`
              flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors mb-1
              ${isActive(item.path) ? 'bg-blue-700 text-white shadow-md' : 'text-blue-100 hover:bg-blue-500 hover:text-white'}
            `}>
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            <span className="truncate">{item.name}</span>
          </Link>)}

        {isSuperAdmin && <>
            <p className="px-4 text-xs font-semibold text-blue-200 uppercase tracking-wider mt-6 mb-2">
              Super Admin
            </p>
            {superAdminItems.map(item => <Link key={item.name} to={item.path} onClick={handleNavClick} className={`
                  flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors mb-1
                  ${isActive(item.path) ? 'bg-blue-700 text-white shadow-md' : 'text-blue-100 hover:bg-blue-500 hover:text-white'}
                `}>
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>)}
          </>}

        <p className="px-4 text-xs font-semibold text-blue-200 uppercase tracking-wider mt-6 mb-2">
          Settings
        </p>
        <Link to="/settings" onClick={handleNavClick} className={`
            flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors mb-1
            ${isActive('/settings') ? 'bg-blue-700 text-white shadow-md' : 'text-blue-100 hover:bg-blue-500 hover:text-white'}
          `}>
          <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
          <span className="truncate">Account Settings</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-blue-500">
        <button onClick={() => {
        if (onLogoutRequest) {
          onLogoutRequest();
        }
        if (onClose) onClose();
      }} className="flex items-center w-full px-4 py-2 text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-500 rounded-lg transition-colors">
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          <span className="truncate">Sign Out</span>
        </button>
      </div>
    </div>;
}