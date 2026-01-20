// components/providers/AuthProvider.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Toaster } from 'react-hot-toast';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Check authentication status on mount
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#03122b',
            border: '1px solid #e4e8f0',
            boxShadow: '0 4px 12px rgba(4, 86, 148, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#045694',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      {children}
    </>
  );
}
