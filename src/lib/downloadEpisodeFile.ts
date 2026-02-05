'use client';
import {
  createDownloadEpisodeFile,
  type DownloadEpisodeOptions,
  type DownloadHandlerResult,
} from '@/lib/downloadEpisodeFile.base';

const webDownloadHandler = async (
  options: DownloadEpisodeOptions,
): Promise<DownloadHandlerResult> => {
  const { url, filename, signal } = options;
  const anchor = document.createElement('a');

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error('Failed to fetch the file');
    const blob = await response.blob();
    if (!blob || blob.size === 0) throw new Error('Received empty blob.');

    const blobUrl = window.URL.createObjectURL(blob);
    anchor.href = blobUrl;
    anchor.download = filename;
    anchor.click();

    window.URL.revokeObjectURL(blobUrl);
    anchor.remove();
    return { success: true };
  } catch (error) {
    anchor.remove();
    if (signal?.aborted || (error as Error).name === 'AbortError') {
      return { success: false, aborted: true };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const downloadEpisodeFile = createDownloadEpisodeFile(webDownloadHandler);
