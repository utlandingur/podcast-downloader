import { cn } from '@/lib/utils';

export const OptionsWrapper = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <div className={cn('flex gap-4 sm:items-center')}>
    <div className={cn('min-w-16')}>{title}</div>

    {children}
  </div>
);
