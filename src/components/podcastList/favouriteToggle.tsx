'use client';

import { useToggleFavourite } from '@/hooks/useToggleFavourite';
import { Toggle } from '@/components/toggle';
import { Heart } from 'lucide-react';

type Props = {
  id: number;
};

export const FavouriteToggle = ({ id }: Props) => {
  const { favourited, toggleFavourite } = useToggleFavourite(id.toString());

  return (
    <Toggle
      key={favourited ? 'favourited' : 'not-favourited'}
      onToggle={toggleFavourite}
      initialValue={favourited}
      label={'Sort Ascending'}
      trueIcon={<Heart className="h-4 w-4 fill-foreground" />}
      falseIcon={<Heart className="h-4 w-4" />}
    />
  );
};
