import { cn } from '@/lib/utils';
import Link from 'next/link';
import { LoginOutDialog } from './LoginOutDialog';
import { auth } from '../../auth';
import { HandHelping, Headphones, User } from 'lucide-react';
import { Button } from './ui/button';

const Spacer = () => <div className="font-thin text-muted-foreground">|</div>;

export const Header = async () => {
  const session = await auth();

  return (
    <div
      className={cn(
        'p-3 flex w-full font-semibold justify-between items-center border-b-2 border-b-text-foreground',
      )}
    >
      <Link href={'/'} className="flex gap-2 items-center">
        <Headphones className="h-4 w-4" />
        PodcastToMP3
      </Link>
      <div className="flex gap-2 items-center">
        {session ? (
          <>
            <Link href={'https://buymeacoffee.com/utlandingur'} target="_blank">
              <Button variant="ghost" className="rounded-full" size="icon">
                <HandHelping className="fill-yellow-300" />
              </Button>
            </Link>
            <Spacer />
            <Link href={'/profile'}>
              <Button variant="ghost" className="rounded-full" size="icon">
                <User />
              </Button>
            </Link>
            <Spacer />
            <LoginOutDialog showLogin={!!session} />
          </>
        ) : (
          <LoginOutDialog showLogin={!!session} />
        )}
      </div>
    </div>
  );
};
