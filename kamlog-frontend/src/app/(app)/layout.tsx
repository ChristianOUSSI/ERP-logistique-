'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/layout/AuthProvider';
import { useRouter } from 'next/navigation';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show nothing or a loader while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Chargement...
      </div>
    );
  }

  // If not loading and no user, we are redirecting
  if (!user) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">KAMLOG EM-ERP</h1>
            <button
              onClick={() => logout()}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Déconnexion ({user.fullName || user.email})
            </button>
          </div>
        </div>
      </header>
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
