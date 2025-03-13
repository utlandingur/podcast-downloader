import { Heart } from 'lucide-react';
import { Toggle } from '../toggle';
import { OptionsWrapper } from './optionsWraper';
import { Button } from '../ui/button';
import { Lock } from 'lucide-react';
import { useToggleFavourite } from '@/hooks/useToggleFavourite';

type Props = {
  isLoggedIn: boolean;
  podcastId: string;
};

export const ToggleFavourite = ({ podcastId, isLoggedIn }: Props) => {
  const { favourited, toggleFavourite } = useToggleFavourite(podcastId);
  if (isLoggedIn) {
    return (
      <OptionsWrapper title="Favourite">
        <Toggle
          key={favourited ? 'favourited' : 'not-favourited'}
          onToggle={toggleFavourite}
          initialValue={favourited}
          label={'Sort Ascending'}
          trueIcon={<Heart className="h-4 w-4 fill-foreground" />}
          falseIcon={<Heart className="h-4 w-4" />}
        />
      </OptionsWrapper>
    );
  }

  return (
    <OptionsWrapper title="Favourite">
      <Button variant="outline">
        <div className={'flex gap-2 items-center'}>
          <Lock className="h-4 w-4" />
        </div>
        You must be logged in to use this feature
      </Button>
    </OptionsWrapper>
  );
};
