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
import { useState } from 'react';
import { signIn } from 'next-auth/react';

import { GoogleIcon } from './ui/icons/googleIcon';

type Props = {
  trigger: React.ReactNode;
};

export const LoginPortal = ({ trigger }: Props) => {
  const [open, setOpen] = useState(false);

  const handleSignIn = async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        // Stubbed login: signs in as Dev User without Google
        // Note: in DEV must manually reload page to see changes
        await signIn('credentials');
      } else {
        // Production: real Google login
        await signIn('google');
      }
    } catch (error) {
      console.error('error', error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-4">
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
              <div>
                {process.env.NODE_ENV === 'development'
                  ? 'Continue as Dev User'
                  : 'Continue with Google'}
              </div>
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
