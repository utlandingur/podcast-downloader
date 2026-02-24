'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { LoginOutDialog } from './LoginOutDialog';
import { Coffee, Podcast, User } from 'lucide-react';
import { Button } from './ui/button';
import { SessionContextValue, useSession } from '@/lib/authClient';

const Spacer = () => <div className="font-thin text-muted-foreground">|</div>;

export const Header = () => {
  const { data: session, status } = useSession();

  return (
    <div
      className={cn(
        'p-3 flex w-full font-semibold justify-between items-center border-b-2 border-b-text-foreground h-16',
      )}
    >
      <Link
        href={'/'}
        className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-foreground shadow-sm"
      >
        <Podcast className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold tracking-tight sm:text-base">
          PodcastToMP3
        </span>
      </Link>
      <div className="flex gap-2 items-center">
        <ButtonsToRender status={status} loggedIn={!!session?.user} />
      </div>
    </div>
  );
};

const ButtonsToRender = ({ status, loggedIn }: { status: SessionContextValue["status"]; loggedIn:boolean }) => {
  if (status === "loading") {
    return null; // or a loading spinner
  }

  if (loggedIn) {
    return (
       <>
            <Link href={'/download'} className="hidden sm:block">
              <Button variant="outline" className="rounded-full px-3">
                <span>Download App</span>
              </Button>
            </Link>
            <Spacer />
            <Link href={'https://buymeacoffee.com/utlandingur'} target="_blank">
              <Button variant="ghost" className="rounded-full px-3">
                <Coffee className="fill-yellow-300" />
                <span>Support</span>
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
    return (
      <>
        <Link href={'/download'} className="hidden sm:block">
          <Button variant="outline" className="rounded-full px-3">
            <span>Download App</span>
          </Button>
        </Link>
        <Spacer />
        <LoginOutDialog mode="login" />
      </>
    );
  }
};
