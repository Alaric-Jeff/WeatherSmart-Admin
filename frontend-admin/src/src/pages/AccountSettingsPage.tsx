import React, { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { Lock, Save } from 'lucide-react';
import { toast } from 'sonner';
export function AccountSettingsPage() {
  const {
    user,
    updateProfile
  } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || ''
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await updateProfile(profileData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsProfileSaving(false);
    }
  };
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setIsPasswordSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully');
      setPasswords({
        current: '',
        new: '',
        confirm: ''
      });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsPasswordSaving(false);
    }
  };
  return <AdminLayout title="Account Settings">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Profile Information">
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                {user?.firstName?.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" value={profileData.firstName} onChange={e => setProfileData({
              ...profileData,
              firstName: e.target.value
            })} />
              <Input label="Last Name" value={profileData.lastName} onChange={e => setProfileData({
              ...profileData,
              lastName: e.target.value
            })} />
            </div>
            <Input label="Email" value={user?.email} disabled className="bg-gray-50" />
            <p className="text-xs text-gray-500 -mt-2">
              Email cannot be changed for security reasons
            </p>
            <Input label="Phone Number" value={profileData.phoneNumber} onChange={e => setProfileData({
            ...profileData,
            phoneNumber: e.target.value
          })} placeholder="+1 (555) 123-4567" />
            <Input label="Address" value={profileData.address} onChange={e => setProfileData({
            ...profileData,
            address: e.target.value
          })} placeholder="123 Main St, City, State" />
            <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={isProfileSaving} leftIcon={<Save className="h-4 w-4" />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        <Card title="Security">
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md text-sm text-yellow-800 mb-4">
              <strong>Password Requirements:</strong>
              <ul className="list-disc list-inside mt-1 text-xs">
                <li>At least 8 characters long</li>
                <li>Mix of uppercase and lowercase letters recommended</li>
                <li>
                  Include numbers and special characters for stronger security
                </li>
              </ul>
            </div>

            <Input label="Current Password" type="password" value={passwords.current} onChange={e => setPasswords({
            ...passwords,
            current: e.target.value
          })} required placeholder="Enter current password" />
            <Input label="New Password" type="password" value={passwords.new} onChange={e => setPasswords({
            ...passwords,
            new: e.target.value
          })} required placeholder="Enter new password" />
            <Input label="Confirm New Password" type="password" value={passwords.confirm} onChange={e => setPasswords({
            ...passwords,
            confirm: e.target.value
          })} required placeholder="Confirm new password" />
            <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={isPasswordSaving} leftIcon={<Lock className="h-4 w-4" />}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>;
}