import { useState, useEffect } from 'react';
import { EmailTemplate, EmailLog } from '../lib/types';
const MOCK_TEMPLATES: EmailTemplate[] = [{
  id: 'tpl-1',
  name: 'Welcome Email',
  subject: 'Welcome to WeatherSmart',
  category: 'User Notification',
  content: 'Dear {name},\n\nWelcome to WeatherSmart! Your account has been created successfully.\n\nBest regards,\nThe Team'
}, {
  id: 'tpl-2',
  name: 'Ticket Resolved',
  subject: 'Your Ticket Has Been Resolved',
  category: 'Status Update',
  content: 'Dear {name},\n\nYour ticket #{ticketId} has been marked as resolved. If you have further questions, please reply to this email.\n\nBest regards,\nSupport Team'
}, {
  id: 'tpl-3',
  name: 'Maintenance Notice',
  subject: 'Scheduled Maintenance',
  category: 'General',
  content: 'Dear User,\n\nWe will be performing scheduled maintenance on {date}. Service may be intermittent.\n\nThank you for your patience.'
}];
const MOCK_EMAIL_LOGS: EmailLog[] = [{
  id: 'el-1',
  sentBy: 'John Doe',
  recipient: 'user@example.com',
  templateName: 'Welcome Email',
  sentDate: '2023-06-20T10:00:00Z',
  status: 'sent'
}];
export function useEmails() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      setTemplates(MOCK_TEMPLATES);
      setLogs(MOCK_EMAIL_LOGS);
      setLoading(false);
    };
    fetchData();
  }, []);
  const sendEmail = async (recipient: string, templateId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const template = templates.find(t => t.id === templateId);
    if (!template) throw new Error('Template not found');
    const newLog: EmailLog = {
      id: `el-${Date.now()}`,
      sentBy: 'Current Admin',
      // In real app, get from auth context
      recipient,
      templateName: template.name,
      sentDate: new Date().toISOString(),
      status: 'sent'
    };
    setLogs(prev => [newLog, ...prev]);
    return true;
  };
  return {
    templates,
    logs,
    loading,
    sendEmail
  };
}