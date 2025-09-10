import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'dark' | 'primary' | 'accent';
  hover?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', hover = false, ...props }, ref) => {
    const variantClasses = {
      default: 'glass',
      subtle: 'glass-subtle',
      dark: 'glass-dark',
      primary: 'glass-primary',
      accent: 'glass-accent',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl p-6',
          variantClasses[variant],
          hover && 'glass-hover cursor-pointer',
          className
        )}
        {...props}
      />
    );
  }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard };