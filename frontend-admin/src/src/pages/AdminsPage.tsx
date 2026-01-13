import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useAdmins } from '../hooks/useAdmins';
import { Plus, Eye, Shield, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
export function AdminsPage() {
  const {
    admins,
    loading,
    createAdmin
  } = useAdmins();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [step, setStep] = useState(1); // Multi-step modal: 1 = Form, 2 = Confirmation
  const [newAdmin, setNewAdmin] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const filteredAdmins = admins.filter(admin => admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || admin.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || admin.email.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createAdmin(newAdmin);
      setStep(2); // Move to confirmation step
      toast.success('Admin invitation sent successfully');
    } catch (error) {
      toast.error('Failed to create admin');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setStep(1);
    setNewAdmin({
      firstName: '',
      lastName: '',
      middleName: '',
      email: ''
    });
  };
  return <AdminLayout title="Admin Management">
      <div className="mb-6 bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-indigo-600 mt-0.5" />
          <div className="text-sm text-indigo-900">
            <p className="font-semibold mb-1">Super-Admin Control Panel</p>
            <p className="text-indigo-700">
              Manage administrator accounts, monitor activity, and maintain
              system security.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="w-1/3">
          <SearchInput placeholder="Search admins..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Invite Admin
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    Loading admins...
                  </td>
                </tr> : filteredAdmins.length === 0 ? <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    No admins found
                  </td>
                </tr> : filteredAdmins.map(admin => <tr key={admin.adminId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                          {admin.firstName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {admin.firstName}{' '}
                            {admin.middleName && `${admin.middleName} `}
                            {admin.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={admin.role === 'super-admin' ? 'primary' : 'neutral'}>
                        {admin.role === 'super-admin' ? 'Super Admin' : 'Admin'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={admin.status === 'active' ? 'success' : 'danger'}>
                        {admin.status === 'active' ? 'Active' : 'Disabled'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(admin.lastLogin).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/admins/${admin.adminId}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </Link>
                    </td>
                  </tr>)}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isCreateModalOpen} onClose={handleCloseModal} title={step === 1 ? 'Invite New Admin' : 'Invitation Sent'} maxWidth="lg">
        {step === 1 ? <form onSubmit={handleCreate} className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Admin Creation Flow</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-700">
                    <li>Enter admin details and send invitation</li>
                    <li>Admin receives email to verify ownership</li>
                    <li>Admin completes profile (phone, address, password)</li>
                    <li>Admin can log in with credentials</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" value={newAdmin.firstName} onChange={e => setNewAdmin({
            ...newAdmin,
            firstName: e.target.value
          })} required placeholder="John" />
              <Input label="Last Name" value={newAdmin.lastName} onChange={e => setNewAdmin({
            ...newAdmin,
            lastName: e.target.value
          })} required placeholder="Doe" />
            </div>
            <Input label="Middle Name (Optional)" value={newAdmin.middleName} onChange={e => setNewAdmin({
          ...newAdmin,
          middleName: e.target.value
        })} placeholder="Michael" />
            <Input label="Email Address" type="email" value={newAdmin.email} onChange={e => setNewAdmin({
          ...newAdmin,
          email: e.target.value
        })} required placeholder="admin@weathersmart.com" />

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="ghost" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting} leftIcon={<Mail className="h-4 w-4" />}>
                Send Invitation
              </Button>
            </div>
          </form> : <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Invitation Sent Successfully!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              An email has been sent to <strong>{newAdmin.email}</strong> with
              instructions to verify their account and complete their profile.
            </p>
            <div className="bg-gray-50 p-4 rounded-md text-left text-sm text-gray-700 mb-6">
              <p className="font-semibold mb-2">Next Steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Admin clicks verification link in email</li>
                <li>
                  Admin completes profile setup (phone, address, password)
                </li>
                <li>Admin is redirected to login page</li>
                <li>Admin can access the system with their credentials</li>
              </ol>
            </div>
            <Button onClick={handleCloseModal}>Done</Button>
          </div>}
      </Modal>
    </AdminLayout>;
}