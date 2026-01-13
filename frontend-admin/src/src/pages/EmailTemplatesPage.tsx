import React, { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useEmails } from '../hooks/useEmails';
import { Mail, Send, History } from 'lucide-react';
import { toast } from 'sonner';
export function EmailTemplatesPage() {
  const {
    templates,
    logs,
    loading,
    sendEmail
  } = useEmails();
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isSending, setIsSending] = useState(false);
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await sendEmail(recipient, selectedTemplate);
      toast.success('Email sent successfully');
      setIsSendModalOpen(false);
      setRecipient('');
      setSelectedTemplate('');
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setIsSending(false);
    }
  };
  return <AdminLayout title="Email Notifications">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Message Templates
            </h2>
            <Button onClick={() => setIsSendModalOpen(true)} leftIcon={<Send className="h-4 w-4" />}>
              Compose Email
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading ? <div>Loading templates...</div> : templates.map(template => <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <h3 className="font-medium text-gray-900">
                          {template.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        Subject: {template.subject}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {template.category}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => {
                setSelectedTemplate(template.id);
                setIsSendModalOpen(true);
              }}>
                      Use
                    </Button>
                  </div>
                </Card>)}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card title="Recent Email Logs">
            <div className="space-y-4">
              {loading ? <div>Loading logs...</div> : logs.length === 0 ? <div className="text-center text-gray-500 py-4">
                  No emails sent yet
                </div> : logs.slice(0, 5).map(log => <div key={log.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <History className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {log.templateName}
                      </p>
                      <p className="text-xs text-gray-500">
                        To: {log.recipient}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(log.sentDate).toLocaleString()}
                      </p>
                    </div>
                  </div>)}
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={isSendModalOpen} onClose={() => setIsSendModalOpen(false)} title="Send Notification">
        <form onSubmit={handleSend} className="space-y-4">
          <Input label="Recipient Email" type="email" value={recipient} onChange={e => setRecipient(e.target.value)} required placeholder="user@example.com" />
          <Select label="Select Template" options={templates.map(t => ({
          value: t.id,
          label: t.name
        }))} value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} required />
          {selectedTemplate && <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm text-gray-600">
              <strong>Preview:</strong>
              <br />
              {templates.find(t => t.id === selectedTemplate)?.content}
            </div>}
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsSendModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSending} leftIcon={<Send className="h-4 w-4" />}>
              Send Email
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>;
}