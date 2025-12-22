'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      containerStyle={{
        top: 80, // Header'ın altında görünsün
      }}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: '#1e293b',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
          fontSize: '14px',
          maxWidth: '400px',
        },
        // Success toast
        success: {
          duration: 3000,
          style: {
            background: '#059669',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#059669',
          },
        },
        // Error toast
        error: {
          duration: 5000,
          style: {
            background: '#dc2626',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#dc2626',
          },
        },
        // Loading toast
        loading: {
          style: {
            background: '#1e293b',
          },
        },
      }}
    />
  );
}
