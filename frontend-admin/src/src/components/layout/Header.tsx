import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Bell, User } from 'lucide-react';
interface HeaderProps {
  title: string;
}
export function Header({
  title
}: HeaderProps) {
  const {
    user
  } = useAuth();
  return <header className="bg-blue-50 border-b border-blue-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20 hidden md:flex">
      <h1 className="text-xl sm:text-2xl font-bold text-blue-900 truncate">
        {title}
      </h1>

      <div className="flex items-center space-x-3 sm:space-x-4">
        <button className="p-2 text-blue-400 hover:text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 pl-3 sm:pl-4 border-l border-blue-200">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-medium text-blue-900 truncate max-w-[150px]">
              {user?.firstName || 'Admin'}
            </p>
            <p className="text-xs text-blue-600 truncate max-w-[150px]">
              {user?.email}
            </p>
          </div>
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>;
}