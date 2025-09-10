'use client';

import { Sidebar } from './sidebar';
import { TopBar } from './topbar';
import { ContentArea } from './content-area';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400 to-blue-400 rounded-full opacity-10 blur-3xl" />
      </div>
      
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10">
        <TopBar />
        <ContentArea>
          {children}
        </ContentArea>
      </div>
    </div>
  );
}