import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

/**
 * FullscreenTestLayout - Layout for test pages without navbar/sidebar
 * Creates a clean, full-screen environment focused on the test
 */
export const FullscreenTestLayout: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden flex flex-col">
      <Toaster />
      <Sonner />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
