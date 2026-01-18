import { cn } from '@/lib/utils';

export const OptionsWrapper = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <div
    className={cn(
      'grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center',
    )}
  >
    <div className={cn('text-sm font-medium text-foreground/90')}>{title}</div>
    <div className="min-w-0">{children}</div>
  </div>
);
