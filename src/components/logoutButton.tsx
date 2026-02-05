'use client';
import { LogOut } from 'lucide-react';
import { signOut } from '@/lib/authClient';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export const LogoutButton = () => (
  <Button
    variant="ghost"
    className="rounded-full"
    size="icon"
    onClick={() => signOut()}
  >
    <LogOut className={cn('h-4 w-4')} />
  </Button>
);
