'use client';

import { Sidebar } from './sidebar';
import { TopBar } from './topbar';
import { ContentArea } from './content-area';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:ml-64">
        <TopBar />
        <ContentArea>
          {children}
        </ContentArea>
      </div>
    </div>
  );
}