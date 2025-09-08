'use client';

import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TopBar() {
  const handleNotificationClick = () => {
    alert('알림 기능이 곧 추가될 예정입니다!');
  };

  const handleProfileClick = () => {
    alert('프로필 기능이 곧 추가될 예정입니다!');
  };

  return (
    <header className="bg-white border-b px-6 py-4 md:ml-64">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 ml-12 md:ml-0">
          대시보드
        </h1>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleNotificationClick}>
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleProfileClick}>
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}