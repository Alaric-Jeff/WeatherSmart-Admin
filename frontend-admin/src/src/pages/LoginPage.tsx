import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CloudRain, Mail } from 'lucide-react';
export function LoginPage() {
  const navigate = useNavigate();
  const {
    login,
    loginWithGoogle
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      // Role-based redirect: Super-Admin and Admin go to same dashboard
      // The dashboard will show different content based on role
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Google login failed');
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <CloudRain className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          WeatherSmart Rack
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Admin & Super-Admin Portal
        </p>
        <p className="mt-1 text-center text-xs text-gray-500">
          Unified login for all administrators
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@weathersmart.com" />

            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />

            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </div>}

            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-md border border-blue-200">
              <strong>Demo Credentials:</strong>
              <br />
              Super-Admin: admin@demo.com / password
              <br />
              Admin: user@demo.com / password
            </div>

            <div>
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full" onClick={handleGoogleLogin} leftIcon={<Mail className="h-4 w-4" />}>
                Google Workspace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
}