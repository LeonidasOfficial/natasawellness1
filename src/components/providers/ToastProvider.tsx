'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1A1A1A',
          color: '#D4A574',
          border: '2px solid #D4A574',
        },
        success: {
          iconTheme: {
            primary: '#D4A574',
            secondary: '#1A1A1A',
          },
        },
      }}
    />
  )
}

