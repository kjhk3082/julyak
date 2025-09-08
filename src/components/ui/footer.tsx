'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-100 px-6 py-8 mt-auto">
      <div className="max-w-7xl mx-auto text-center text-sm text-gray-700">
        <div className="flex items-center justify-center space-x-6 mb-4">
          <Link href="/terms" className="hover:text-primary">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:text-primary">
            개인정보처리방침
          </Link>
        </div>
        <p>&copy; 2024 절약가 정신. All rights reserved.</p>
      </div>
    </footer>
  );
}