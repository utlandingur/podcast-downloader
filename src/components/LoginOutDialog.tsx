import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as React from 'react';

import { LoginPortal } from './loginPortal';
import { LogoutButton } from './logoutButton';

type LoginOutDialogProps = {
  mode: 'login' | 'logout';
};

const LoginButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>((props, ref) => (
  <Button ref={ref} variant="outline" {...props}>
    <LogIn className={cn('h-4 w-4')} />
    <div>Login</div>
  </Button>
));
LoginButton.displayName = 'LoginButton';

export const LoginOutDialog = ({ mode }: LoginOutDialogProps) => {
  if (mode === 'login') {
    return <LoginPortal trigger={<LoginButton />} />;
  } else {
    return <LogoutButton />;
  }
};
