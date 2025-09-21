'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Check, HelpCircle, RotateCcw, ExternalLink } from 'lucide-react';
import { isMobile } from 'react-device-detect';

interface DownloadFallbackAlertProps {
  fileName: string;
  onConfirmDownload: () => void;
  onReportIssue: () => void;
  onRetry: () => void;
}

export const DownloadFallbackAlert = ({
  fileName,
  onConfirmDownload,
  onReportIssue,
  onRetry,
}: DownloadFallbackAlertProps) => {
  return (
    <Alert className="mt-3 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50">
      <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertTitle className="text-blue-800 dark:text-blue-200">
        Download opened in new tab
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <div className="text-blue-700 dark:text-blue-300">
          <p className="font-medium mb-2">To download &ldquo;{fileName}&rdquo;:</p>
          <div className="text-sm space-y-1">
            {isMobile ? (
              <p>Tap the three dots (⋮) in your browser, then select &ldquo;Download&rdquo;</p>
            ) : (
              <p>Right-click the audio player and select &ldquo;Save audio as...&rdquo; or use your browser&rsquo;s download menu</p>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            onClick={onConfirmDownload}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="h-3 w-3 mr-1" />
            Downloaded Successfully
          </Button>
          
          <Button
            onClick={onReportIssue}
            variant="outline"
            size="sm"
          >
            <HelpCircle className="h-3 w-3 mr-1" />
            Need Help?
          </Button>
          
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Retry Download
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};