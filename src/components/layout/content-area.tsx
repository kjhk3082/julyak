'use client';

import { cn } from '@/lib/utils';

interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
}

export function ContentArea({ children, className }: ContentAreaProps) {
  return (
    <main className={cn(
      "flex-1 p-6 min-h-screen",
      className
    )}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  );
}