import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { Users, Server, Ticket, Activity, Shield, TrendingUp } from 'lucide-react';
import { getDashboardData } from '../../api/shared/get-dashboard-data';

interface DashboardCounts {
  users: number;
  devices: number;
  tickets: number;
}

export function DashboardPage() {
  const { user, isSuperAdmin, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardCounts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardData();
        console.log('Fetched dashboard data:', result);
        setDashboardData(result); 
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (authLoading || loading) return <div className="p-4">Loading...</div>;
  if (!user) return <div className="p-4">Please login to view the dashboard.</div>;

  console.log('Current logged-in role:', user.role);
  console.log(`Current admin: ${user.adminId}`);

  const usersCount = dashboardData?.users ?? 0;
  const devicesCount = dashboardData?.devices ?? 0;
  const ticketsCount = dashboardData?.tickets ?? 0;

  const baseStats = [
    {
      name: 'Total Users',
      value: usersCount,
      subtext: `${usersCount} Active`,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Devices',
      value: devicesCount,
      subtext: `${devicesCount} Assigned`,
      icon: Server,
      color: 'bg-green-500'
    },
    {
      name: 'Open Tickets',
      value: ticketsCount,
      subtext: `${ticketsCount} Total`,
      icon: Ticket,
      color: 'bg-yellow-500'
    },
    {
      name: 'System Status',
      value: '99.9%',
      subtext: 'Uptime',
      icon: Activity,
      color: 'bg-purple-500'
    }
  ];

  const superAdminStats = [
    ...baseStats,
    {
      name: 'Admin Access Level',
      value: user.role,
      subtext: `Logged in as ${user.firstName} ${user.lastName}`,
      icon: Shield,
      color: 'bg-indigo-500'
    },
    {
      name: 'System Activity',
      value: usersCount + devicesCount + ticketsCount,
      subtext: 'Total tracked actions',
      icon: TrendingUp,
      color: 'bg-pink-500'
    }
  ];

  const stats = isSuperAdmin ? superAdminStats : baseStats;

  // Sample Recent Activity and System Health (replace with dynamic backend data if needed)
  const recentActivity = [
    { action: 'New device registered', entity: 'Rack-Sensor-01', time: '1h ago' },
    { action: 'User account created', entity: 'john@example.com', time: '2h ago' },
    { action: 'Ticket resolved', entity: '#T-1234', time: '3h ago' }
  ];

  const systemHealth = [
    { name: 'Server Load', value: '24%', color: 'bg-blue-600', width: '24%' },
    { name: 'Database Usage', value: '45%', color: 'bg-green-500', width: '45%' },
    { name: 'API Latency', value: '120ms', color: 'bg-yellow-500', width: '15%' }
  ];

  return (
    <AdminLayout title={isSuperAdmin ? 'Super-Admin Dashboard' : 'Admin Dashboard'}>
      {isSuperAdmin && (
        <div className="mb-4 sm:mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 sm:p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <Shield className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm sm:text-base">Super-Admin Access</h3>
              <p className="text-xs sm:text-sm text-indigo-100">
                You have full system control and monitoring capabilities
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {stats.map(item => (
          <Card key={item.name} className="overflow-hidden">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-2 sm:p-3 ${item.color}`}>
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1 min-w-0">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                  <dd>
                    <div className="text-lg sm:text-xl font-medium text-gray-900">{item.value}</div>
                  </dd>
                  <dd className="text-xs text-gray-400 truncate">{item.subtext}</dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity & System Health */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <Card title="Recent Activity" className="min-h-[300px]">
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivity.map((item, idx) => (
                <li key={idx}>
                  <div className="relative pb-8">
                    {idx !== recentActivity.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                    )}
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
                            <span className="font-medium text-gray-900">{item.entity}</span>
                          </p>
                        </div>
                        <div className="text-left sm:text-right text-sm whitespace-nowrap text-gray-500 flex-shrink-0">
                          <time>{item.time}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card title="System Health" className="min-h-[300px]">
          <div className="space-y-4">
            {systemHealth.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className={`${item.color} h-2.5 rounded-full transition-all duration-500`} style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
