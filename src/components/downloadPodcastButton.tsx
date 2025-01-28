"use client";
import { Check, Download, X } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "./ui/loadingSpinner";
import { Button } from "./ui/button";
import { isDesktop } from "react-device-detect";
import Link from "next/link";

export enum DownloadState {
  ReadyToDownload = "readyToDownload",
  Downloading = "downloading",
  Downloaded = "downloaded",
  DownloadOnDesktop = "downloadOnDesktop",
  downloadedInNewTab = "downloadedInNewTab",
}

type DownloadPodcastButtonProps = {
  existingState: DownloadState;
  updateLocalState: (id: number, state: DownloadState) => void;
  id: number;
  url: string;
  fileName: string;
};

export const DownloadPodcastButton = ({
  existingState,
  updateLocalState,
  url,
  id,
  fileName,
}: DownloadPodcastButtonProps) => {
  const [downloadState, setDownloadState] = useState<DownloadState>(
    existingState
      ? existingState === DownloadState.DownloadOnDesktop && isDesktop
        ? DownloadState.ReadyToDownload
        : existingState
      : DownloadState.ReadyToDownload
  );

  const handleDownload = async () => {
    setDownloadState(DownloadState.Downloading);
    const anchor = document.createElement("a");

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }
      const blob = await response.blob();
      if (!blob || blob.size === 0) {
        throw new Error("Received empty blob.");
      }
      const blobUrl = window.URL.createObjectURL(blob);

      anchor.href = blobUrl;
      anchor.download = fileName;
      await anchor.click();

      // Clean up the blob URL after download
      window.URL.revokeObjectURL(blobUrl);
      anchor.remove();
      setDownloadState(DownloadState.Downloaded);
      updateLocalState(id, DownloadState.Downloaded);
    } catch {
      // Open the URL in a new tab if there's an error (likely CORS)
      if (!isDesktop) {
        anchor.remove();
        setDownloadState(DownloadState.DownloadOnDesktop);
        updateLocalState(id, DownloadState.DownloadOnDesktop);
      } else {
        window.open(url, "_blank");
        anchor.remove();
        setDownloadState(DownloadState.downloadedInNewTab);
        updateLocalState(id, DownloadState.downloadedInNewTab);
      }
    }
  };

  const downloadIcon: Record<DownloadState, React.ReactElement> = {
    readyToDownload: <Download />,
    downloading: <LoadingSpinner />,
    downloaded: <Check />,
    downloadOnDesktop: <X />,
    downloadedInNewTab: <Check />,
  };

  const buttonStyle: Record<
    DownloadState,
    "default" | "ghost" | "destructive"
  > = {
    readyToDownload: "default",
    downloading: "default",
    downloaded: "ghost",
    downloadOnDesktop: "destructive",
    downloadedInNewTab: "default",
  };

  const buttonAriaLabel: Record<DownloadState, string> = {
    readyToDownload: "Download episode",
    downloading: "Downloading episode",
    downloaded: "Downloaded",
    downloadOnDesktop: "Please download on desktop browser",
    downloadedInNewTab: "Download in new tab",
  };

  const handleOnClick: Record<
    DownloadState,
    (() => Promise<void>) | undefined
  > = {
    readyToDownload: handleDownload,
    downloading: undefined,
    downloaded: handleDownload,
    downloadOnDesktop: undefined,
    downloadedInNewTab: undefined,
  };

  if (downloadState === DownloadState.downloadedInNewTab) {
    return (
      <div className="flex gap-8 align-center justify-center text-center">
        <Link href={url}>
          <Button
            size={"sm"}
            variant={"default"}
            disabled
            aria-disabled
            aria-label={buttonAriaLabel[downloadState]}
          >
            {downloadIcon[downloadState]}
            Downloaded in new tab - click to retry
          </Button>
        </Link>
        <div className="text-[0.7rem] text-center self-center text-muted-foreground">
          Click three dots and press download.
        </div>
      </div>
    );
  }

  return (
    <Button
      size={"sm"}
      variant={buttonStyle[downloadState]}
      onClick={handleOnClick[downloadState]}
      disabled={
        downloadState === DownloadState.Downloading ||
        downloadState === DownloadState.DownloadOnDesktop
      }
      aria-disabled={
        downloadState === DownloadState.Downloading ||
        downloadState === DownloadState.DownloadOnDesktop
      }
      aria-label={buttonAriaLabel[downloadState]}
    >
      {downloadIcon[downloadState]}
      {downloadState === DownloadState.ReadyToDownload && "Download"}
      {downloadState === DownloadState.Downloaded && "Downloaded"}
      {downloadState === DownloadState.DownloadOnDesktop &&
        "Error: download on desktop"}
    </Button>
  );
};
