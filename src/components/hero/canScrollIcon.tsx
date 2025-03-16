'use client';
import { useOnScroll } from '@/hooks/useOnScroll';
import { ArrowDown } from 'lucide-react';

export const CanScrollIcon = () => {
  const isScrolled = useOnScroll();

  return (
    <div
      className={`absolute bottom-2 right-2 text-xs ${
        isScrolled ? 'hidden animate-out' : 'animate-in'
      }`}
    >
      <ArrowDown className="h-6 w-6 sm:h-8 sm:w-8" />
    </div>
  );
};
