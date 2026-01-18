import { Coffee } from 'lucide-react';
import { CoffeeButton } from './coffeeButton';
import { Card, CardContent } from './ui/card';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Props = HTMLAttributes<HTMLDivElement>;

export const Donate = ({ className, ...props }: Props) => (
  <Card className={cn('mx-auto w-full max-w-3xl', className)} {...props}>
    <CardContent className="flex flex-col items-center space-y-6 p-6 text-center">
      <div className="rounded-full bg-primary/10 p-3">
        <Coffee className="h-6 w-6 text-primary" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">Donate</h3>
        <p>
          This site is built and maintained by just one person, me! As more
          people use it, the costs grow. If you find it helpful, please consider
          buying me a coffee or subscribing to help cover the bills and keep the
          project alive.
        </p>
      </div>
      <CoffeeButton />
    </CardContent>
  </Card>
);
