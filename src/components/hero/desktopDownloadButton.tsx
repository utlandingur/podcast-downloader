'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DESKTOP_DOWNLOAD_URL =
  'https://github.com/utlandingur/podcast-downloader/releases/latest';

type NavigatorWithUAData = Navigator & {
  userAgentData?: {
    platform?: string;
    mobile?: boolean;
  };
};

const shouldShowDesktopDownload = () => {
  if (typeof window === 'undefined') return false;

  const navigatorWithData = window.navigator as NavigatorWithUAData;
  const osFingerprint = [
    window.navigator.platform,
    navigatorWithData.userAgentData?.platform,
    window.navigator.userAgent,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  const isMac = osFingerprint.includes('mac');
  const isWindows = osFingerprint.includes('win');

  return isMac || isWindows;
};

export const DesktopDownloadButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(shouldShowDesktopDownload());
  }, []);

  if (!isVisible) return null;

  return (
    <Link href={DESKTOP_DOWNLOAD_URL} target="_blank" rel="noreferrer">
      <Button variant="outline" className="rounded-full px-6">
        <Download className="h-4 w-4" />
        Download Desktop App
      </Button>
    </Link>
  );
};
