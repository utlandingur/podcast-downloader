'use client';
import {
  createDownloadEpisodeFile,
  type DownloadEpisodeOptions,
  type DownloadHandlerResult,
} from '@/lib/downloadEpisodeFile.base';
import { downloadEpisodeViaElectron } from '@/lib/electronBridge.electron';

const electronDownloadHandler = async (
  options: DownloadEpisodeOptions,
): Promise<DownloadHandlerResult> => {
  const { url, filename } = options;
  const result = await downloadEpisodeViaElectron({ url, filename });

  if (!result) {
    return { success: false, error: 'Electron API unavailable.' };
  }
  if (result.success) {
    return { success: true };
  }
  if (result.aborted) {
    return { success: false, aborted: true };
  }
  return { success: false, error: result.error ?? 'Electron download failed.' };
};

export const downloadEpisodeFile = createDownloadEpisodeFile(
  electronDownloadHandler,
);
