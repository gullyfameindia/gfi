'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock } from 'lucide-react';
import { loginAdmin } from '@/lib/authApi';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'sponsor'>('admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginAdmin(email, password, role.toUpperCase() as 'ADMIN' | 'SPONSOR');

      if (!result.success) {
        console.warn('Login failed:', result.message || result.error);
        setError(result.message || 'Login failed. Please check your credentials.');
        return;
      }

      
      if (role === 'sponsor' && result.data?.token) {
        try {
          const { getCurrentAdmin } = await import('@/lib/authApi');
          const adminResult = await getCurrentAdmin();
          if (adminResult.success && adminResult.data) {
            
            if (process.env.NODE_ENV === 'development') {
              console.log('[Login] Sponsor details fetched:', {
                id: adminResult.data.id || adminResult.data._id,
                sponsorCode: adminResult.data.sponsorCode,
                email: adminResult.data.email,
              });
            }
          }
        } catch (err) {
          console.warn('Failed to fetch sponsor details after login:', err);
          
        }
      }

      router.replace('/');
    } catch (err: any) {
      console.error('Unexpected login error:', err?.message || err);
      setError('Unexpected error during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Gully Fame</h1>
          <p className="mt-2 text-gray-600">Admin Panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 rounded-lg px-4 py-2 font-medium transition-colors ${
                  role === 'admin'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole('sponsor')}
                className={`flex-1 rounded-lg px-4 py-2 font-medium transition-colors ${
                  role === 'sponsor'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sponsor
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <LogIn className="h-5 w-5" />
            <span>{isLoading ? 'Logging in...' : 'Login'}</span>
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Quick Demo Fill</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@gullyfame.com');
                  setPassword('admin123');
                  setRole('admin');
                }}
                className="flex-1 rounded-md bg-white border border-gray-300 py-1.5 px-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
              >
                Fill Admin Demo
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('sponsor@gullyfame.com');
                  setPassword('sponsor123');
                  setRole('sponsor');
                }}
                className="flex-1 rounded-md bg-white border border-gray-300 py-1.5 px-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
              >
                Fill Sponsor Demo
              </button>
            </div>
          </div>

          {role === 'admin' ? (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm font-semibold text-blue-900 mb-1">Admin Login</p>
            <div className="space-y-1 text-xs text-blue-800">
              <p>Use your admin credentials or click above for demo access.</p>
            </div>
          </div>
          ) : (
            <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
              <p className="text-sm font-semibold text-purple-900 mb-1">Sponsor Login</p>
              <div className="space-y-1 text-xs text-purple-800">
                <p>Use your assigned sponsor credentials or click above for demo access.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

