'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { LoginOutDialog } from './LoginOutDialog';
import { Coffee, Headphones, User } from 'lucide-react';
import { Button } from './ui/button';
import { SessionContextValue, useSession } from 'next-auth/react';
import { useEffect } from 'react';

const Spacer = () => <div className="font-thin text-muted-foreground">|</div>;

export const Header = () => {
  const { data: session, status} = useSession();

  return (
    <div
      className={cn(
        'p-3 flex w-full font-semibold justify-between items-center border-b-2 border-b-text-foreground h-16',
      )}
    >
      <Link href={'/'} className="flex gap-2 items-center">
        <Headphones className="h-4 w-4" />
        PodcastToMP3
      </Link>
      <div className="flex gap-2 items-center">
        <ButtonsToRender status={status} loggedIn={!!session?.user} />
      </div>
    </div>
  );
};

const ButtonsToRender = ({status, loggedIn}: {status: SessionContextValue["status"], loggedIn:boolean}) => {
  if (status === "loading") {
    return null; // or a loading spinner
  }

  if (loggedIn) {
    return (
       <>
            <Link href={'https://buymeacoffee.com/utlandingur'} target="_blank">
              <Button variant="ghost" className="rounded-full" size="icon">
                <Coffee className="fill-yellow-300" />
              </Button>
            </Link>
            <Spacer />
            <Link href={'/profile'}>
              <Button variant="ghost" className="rounded-full" size="icon">
                <User />
              </Button>
            </Link>
            <Spacer />
            <LoginOutDialog mode="logout" />
      </>);
  } else {
    return <LoginOutDialog mode="login" />;
  }
};