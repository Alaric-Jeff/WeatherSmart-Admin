import { useState, useEffect } from 'react';
import { AuditLog } from '../lib/types';
const MOCK_LOGS: AuditLog[] = [{
  logId: 'log-1',
  adminId: 'admin-123',
  adminName: 'John Doe (Super-Admin)',
  action: 'User Disabled',
  targetEntity: 'User',
  targetId: 'u3',
  details: 'Disabled user account "Robert Johnson" due to inactivity',
  timestamp: '2023-06-25T14:30:00Z'
}, {
  logId: 'log-2',
  adminId: 'admin-456',
  adminName: 'Sarah Connor (Admin)',
  action: 'Device Created',
  targetEntity: 'Device',
  targetId: 'd5',
  details: 'Registered new device with MAC: AA:BB:CC:DD:EE:FF',
  timestamp: '2023-06-25T13:15:00Z'
}, {
  logId: 'log-3',
  adminId: 'admin-456',
  adminName: 'Sarah Connor (Admin)',
  action: 'Device Assigned',
  targetEntity: 'Device',
  targetId: 'd5',
  details: 'Assigned device AA:BB:CC:DD:EE:FF to user "John Doe"',
  timestamp: '2023-06-25T13:20:00Z'
}, {
  logId: 'log-4',
  adminId: 'admin-123',
  adminName: 'John Doe (Super-Admin)',
  action: 'Ticket Resolved',
  targetEntity: 'Ticket',
  targetId: 't2',
  details: 'Marked ticket #t2 "Connectivity Issue" as resolved',
  timestamp: '2023-06-24T09:45:00Z'
}, {
  logId: 'log-5',
  adminId: 'admin-123',
  adminName: 'John Doe (Super-Admin)',
  action: 'Ticket Deleted',
  targetEntity: 'Ticket',
  targetId: 't1',
  details: 'Permanently deleted resolved ticket #t1 "Sensor Malfunction"',
  timestamp: '2023-06-24T10:00:00Z'
}, {
  logId: 'log-6',
  adminId: 'admin-456',
  adminName: 'Sarah Connor (Admin)',
  action: 'Password Reset',
  targetEntity: 'User',
  targetId: 'u2',
  details: 'Sent password reset email to user "Jane Smith"',
  timestamp: '2023-06-23T16:30:00Z'
}, {
  logId: 'log-7',
  adminId: 'admin-123',
  adminName: 'John Doe (Super-Admin)',
  action: 'Admin Created',
  targetEntity: 'Admin',
  targetId: 'admin-789',
  details: 'Created new admin account for "Mike Ross" with email mike@weathersmart.com',
  timestamp: '2023-06-20T11:00:00Z'
}, {
  logId: 'log-8',
  adminId: 'admin-123',
  adminName: 'John Doe (Super-Admin)',
  action: 'Admin Disabled',
  targetEntity: 'Admin',
  targetId: 'admin-789',
  details: 'Disabled admin account "Mike Ross" due to policy violation',
  timestamp: '2023-06-22T14:15:00Z'
}, {
  logId: 'log-9',
  adminId: 'admin-456',
  adminName: 'Sarah Connor (Admin)',
  action: 'Device Unassigned',
  targetEntity: 'Device',
  targetId: 'd3',
  details: 'Unassigned device 11:22:33:44:55:66 from user "Robert Johnson"',
  timestamp: '2023-06-21T10:30:00Z'
}, {
  logId: 'log-10',
  adminId: 'admin-456',
  adminName: 'Sarah Connor (Admin)',
  action: 'User Enabled',
  targetEntity: 'User',
  targetId: 'u1',
  details: 'Re-enabled user account "John Doe" after verification',
  timestamp: '2023-06-20T09:00:00Z'
}];
export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLogs = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setLogs(MOCK_LOGS);
      setLoading(false);
    };
    fetchLogs();
  }, []);
  const addLog = (log: Omit<AuditLog, 'logId' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      logId: `log-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
  };
  return {
    logs,
    loading,
    addLog
  };
}