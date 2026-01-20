import React, { useEffect, useState } from 'react';
import { Save, User, Mail, Phone, MapPin, Image } from 'lucide-react';
import { getUserInfo } from '../../api/users/get-user-info';
import { updateUser } from '../../api/users/update-user';

interface AccountSettingsPageProps {
  user?: {
    uid?: string;
    email?: string;
  } | null;
  onNavigate: (page: string) => void;
}

interface FormState {
  displayName: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  address: string;
  photoUrl: string;
  email: string;
}

export function AccountSettingsPage({ user, onNavigate }: AccountSettingsPageProps) {
  const userId = user?.uid || JSON.parse(localStorage.getItem('auth_user') || '{}')?.uid;
  const [form, setForm] = useState<FormState>({
    displayName: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    address: '',
    photoUrl: '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!userId) {
      setError('No user found. Please log in again.');
      setLoading(false);
      onNavigate('login');
      return;
    }

    const load = async () => {
      try {
        const data = await getUserInfo(userId);
        setForm({
          displayName: data.displayName || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          contactNumber: data.contactNumber || '',
          address: data.address || '',
          photoUrl: data.photoUrl || '',
          email: data.email || ''
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load account');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId, onNavigate]);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = { ...form };
      delete (payload as any).email; // email is read-only here
      await updateUser(userId, payload);
      setSuccess('Account updated successfully');
      const storedUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
      localStorage.setItem('auth_user', JSON.stringify({ ...storedUser, ...payload }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-center gap-3 mb-8">
        <User className="text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600">Manage your profile information</p>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading account...</div>
      ) : (
        <form onSubmit={handleSave} className="bg-white shadow-lg rounded-2xl p-6 space-y-5 border border-gray-100">
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-100">{error}</div>}
          {success && <div className="p-3 rounded-lg bg-green-50 text-green-700 border border-green-100">{success}</div>}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-700">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>{form.email || '—'}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
              <input value={form.displayName} onChange={(e) => handleChange('displayName', e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none" placeholder="How your name appears" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Photo URL</label>
              <div className="relative">
                <Image className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={form.photoUrl} onChange={(e) => handleChange('photoUrl', e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none" placeholder="https://..." />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
              <div className="relative">
                <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={form.contactNumber} onChange={(e) => handleChange('contactNumber', e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none" placeholder="+63" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none" placeholder="City, Country" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving || !userId} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}