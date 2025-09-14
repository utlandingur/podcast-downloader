import Link from 'next/link';
import { Button } from '../ui/button';
import { DownloadButtonStateConfig } from './types';

type NewTabDownloadButtonProps = {
  config: DownloadButtonStateConfig;
  url: string;
};

export const NewTabDownloadButton = ({ config, url }: NewTabDownloadButtonProps) => (
  <div className="flex gap-8 align-center justify-center text-center">
    <Link href={url}>
      <Button
        size={'sm'}
        variant={config.variant}
        disabled={config.disabled}
        aria-disabled={config.disabled}
        aria-label={config.ariaLabel}
        onClick={config.onClick}
      >
        {config.icon}
        {config.text}
      </Button>
    </Link>
    <div className="text-[0.7rem] text-center self-center text-muted-foreground">
      Click three dots and press download.
    </div>
  </div>
);