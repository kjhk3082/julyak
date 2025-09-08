'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, User, LogOut } from 'lucide-react';
import { Button } from './button';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      window.location.reload();
    } else {
      router.push('/');
    }
  };

  const handleNotificationClick = () => {
    alert('알림 기능이 곧 추가될 예정입니다!');
  };

  const handleProfileClick = () => {
    alert('프로필 기능이 곧 추가될 예정입니다!');
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a 
          href="/" 
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
          onClick={handleLogoClick}
        >
          <Image
            src="/logo.png"
            alt="절약가 정신"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <div className="text-2xl font-bold text-primary">절약가 정신</div>
        </a>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button variant="ghost" size="icon" onClick={handleNotificationClick}>
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleProfileClick}>
                <User className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth/login">
                <Button variant="ghost">로그인</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>회원가입</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}