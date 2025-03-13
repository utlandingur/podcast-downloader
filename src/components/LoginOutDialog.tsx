'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { LogIn, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { signIn, signOut } from 'next-auth/react';

import { GoogleIcon } from './ui/icons/googleIcon';

type LoginOutDialogProps = {
  showLogin: boolean;
};

export const LoginOutDialog = ({ showLogin }: LoginOutDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSignIn = async () => {
    try {
      signIn('google');
    } catch (error) {
      console.error('error', error);
    } finally {
      setOpen(false);
    }
  };

  if (!showLogin) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="invert">
            <LogIn className={cn('h-4 w-4')} />
            <div>Login</div>
          </Button>
        </DialogTrigger>
        <DialogContent className=" sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login or Signup</DialogTitle>
            <DialogDescription>
              Log in or sign up to save your podcast downloads and sync across
              devices.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-center items-center w-full">
            <DialogClose asChild>
              <Button onClick={handleSignIn} variant="outline" size="lg">
                <GoogleIcon size={80} />
                <div>Continue with Google</div>
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Button
        variant="ghost"
        className="rounded-full"
        size="icon"
        onClick={() => signOut()}
      >
        <LogOut className={cn('h-4 w-4')} />
      </Button>
    );
  }
};
