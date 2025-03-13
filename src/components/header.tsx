import { cn } from '@/lib/utils';
import Link from 'next/link';
import { LoginOutDialog } from './LoginOutDialog';
import { auth } from '../../auth';
import { Headphones, User } from 'lucide-react';
import { Button } from './ui/button';

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
        PodcastToMp3.com
      </Link>
      <div className="flex gap-4 items-center">
        {session ? (
          <>
            <Link href={'/profile'}>
              <Button variant="ghost" className="rounded-full" size="icon">
                <User className="" />
              </Button>
            </Link>
            <div className="font-thin">|</div>
            <LoginOutDialog showLogin={!!session} />
          </>
        ) : (
          <LoginOutDialog showLogin={!!session} />
        )}
      </div>
    </div>
  );
};
