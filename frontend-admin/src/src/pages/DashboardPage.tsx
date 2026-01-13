import React from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { useUsers } from '../hooks/useUsers';
import { useDevices } from '../hooks/useDevices';
import { useTickets } from '../hooks/useTickets';
import { useAdmins } from '../hooks/useAdmins';
import { useAuth } from '../hooks/useAuth';
import { Users, Server, Ticket, Activity, Shield, TrendingUp } from 'lucide-react';
export function DashboardPage() {
  const {
    users
  } = useUsers();
  const {
    devices
  } = useDevices();
  const {
    tickets
  } = useTickets();
  const {
    admins
  } = useAdmins();
  const {
    isSuperAdmin
  } = useAuth();
  const activeUsers = users.filter(u => u.status === 'active').length;
  const assignedDevices = devices.filter(d => d.status === 'active').length;
  const openTickets = tickets.filter(t => t.status !== 'resolved').length;
  const activeAdmins = admins.filter(a => a.status === 'active').length;
  const baseStats = [{
    name: 'Total Users',
    value: users.length,
    subtext: `${activeUsers} Active`,
    icon: Users,
    color: 'bg-blue-500'
  }, {
    name: 'Total Devices',
    value: devices.length,
    subtext: `${assignedDevices} Assigned`,
    icon: Server,
    color: 'bg-green-500'
  }, {
    name: 'Open Tickets',
    value: openTickets,
    subtext: `${tickets.length} Total`,
    icon: Ticket,
    color: 'bg-yellow-500'
  }, {
    name: 'System Status',
    value: '99.9%',
    subtext: 'Uptime',
    icon: Activity,
    color: 'bg-purple-500'
  }];
  const superAdminStats = [...baseStats, {
    name: 'Total Admins',
    value: admins.length,
    subtext: `${activeAdmins} Active`,
    icon: Shield,
    color: 'bg-indigo-500'
  }, {
    name: 'System Activity',
    value: '247',
    subtext: 'Actions Today',
    icon: TrendingUp,
    color: 'bg-pink-500'
  }];
  const stats = isSuperAdmin ? superAdminStats : baseStats;
  return <AdminLayout title={isSuperAdmin ? 'Super-Admin Dashboard' : 'Admin Dashboard'}>
      {isSuperAdmin && <div className="mb-4 sm:mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 sm:p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm sm:text-base">
                Super-Admin Access
              </h3>
              <p className="text-xs sm:text-sm text-indigo-100">
                You have full system control and monitoring capabilities
              </p>
            </div>
          </div>
        </div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {stats.map(item => <Card key={item.name} className="overflow-hidden">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-2 sm:p-3 ${item.color}`}>
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1 min-w-0">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    {item.name}
                  </dt>
                  <dd>
                    <div className="text-lg sm:text-xl font-medium text-gray-900">
                      {item.value}
                    </div>
                  </dd>
                  <dd className="text-xs text-gray-400 truncate">
                    {item.subtext}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>)}
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <Card title="Recent Activity" className="min-h-[300px]">
          <div className="flow-root">
            <ul className="-mb-8">
              {[{
              action: 'New device registered',
              entity: 'Rack-Sensor-01',
              time: '1h ago'
            }, {
              action: 'User account created',
              entity: 'john@example.com',
              time: '2h ago'
            }, {
              action: 'Ticket resolved',
              entity: '#T-1234',
              time: '3h ago'
            }].map((item, itemIdx) => <li key={itemIdx}>
                  <div className="relative pb-8">
                    {itemIdx !== 2 ? <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" /> : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white flex-shrink-0">
                          <Activity className="h-4 w-4 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0 sm:space-x-4">
                        <div className="min-w-0">
                          <p className="text-sm text-gray-500 break-words">
                            {item.action}{' '}
                            <span className="font-medium text-gray-900">
                              {item.entity}
                            </span>
                          </p>
                        </div>
                        <div className="text-left sm:text-right text-sm whitespace-nowrap text-gray-500 flex-shrink-0">
                          <time>{item.time}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>)}
            </ul>
          </div>
        </Card>

        <Card title="System Health" className="min-h-[300px]">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Server Load</span>
                <span>24%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{
                width: '24%'
              }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Database Usage</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{
                width: '45%'
              }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>API Latency</span>
                <span>120ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500" style={{
                width: '15%'
              }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {isSuperAdmin && <div className="mt-6 sm:mt-8">
          <Card title="Admin Activity Summary">
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                Recent administrative actions across the system:
              </p>
              <ul className="space-y-2">
                <li className="flex justify-between py-2 border-b border-gray-100">
                  <span>Device registrations today</span>
                  <span className="font-semibold text-gray-900">12</span>
                </li>
                <li className="flex justify-between py-2 border-b border-gray-100">
                  <span>User account modifications</span>
                  <span className="font-semibold text-gray-900">8</span>
                </li>
                <li className="flex justify-between py-2 border-b border-gray-100">
                  <span>Tickets resolved</span>
                  <span className="font-semibold text-gray-900">15</span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Emails sent</span>
                  <span className="font-semibold text-gray-900">23</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>}
    </AdminLayout>;
}