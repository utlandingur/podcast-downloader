'use client';
import { signOut } from '@/lib/authClient';
import { Button } from './ui/button';

export default function SignOutButton() {
  return <Button onClick={() => signOut()}>Sign Out</Button>;
}
