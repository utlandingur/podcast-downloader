import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

import { LoginPortal } from './loginPortal';
import { LogoutButton } from './logoutButton';

type LoginOutDialogProps = {
  showLogin: boolean;
};

const Trigger = () => (
  <Button variant="outline" className="invert">
    <LogIn className={cn('h-4 w-4')} />
    <div>Login</div>
  </Button>
);

export const LoginOutDialog = ({ showLogin }: LoginOutDialogProps) => {
  if (!showLogin) {
    return <LoginPortal trigger={<Trigger />} key={'loginOut'} />;
  } else {
    return <LogoutButton />;
  }
};
