'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ToggleProps {
  onToggle: (value: boolean) => void;
  initialValue?: boolean;
  trueIcon?: React.ReactNode;
  falseIcon?: React.ReactNode;
  label: string;
  trueText?: string;
  falseText?: string;
}

export function Toggle({
  onToggle,
  initialValue,
  trueIcon,
  falseIcon,
  label,
  trueText,
  falseText,
}: ToggleProps) {
  const [isTrue, setIsTrue] = useState(initialValue ?? true);

  const handleToggle = () => {
    const newState = !isTrue;
    setIsTrue(newState);
    onToggle(newState);
  };

  return (
    <Button variant="outline" onClick={handleToggle} aria-label={label}>
      {isTrue ? (
        <div className={cn('flex gap-2 items-center')}>
          {trueIcon}
          {trueText && <div>{trueText}</div>}
        </div>
      ) : (
        <div className={cn('flex gap-2 items-center')}>
          {falseIcon}
          {falseText && <div>{falseText}</div>}
        </div>
      )}
    </Button>
  );
}
