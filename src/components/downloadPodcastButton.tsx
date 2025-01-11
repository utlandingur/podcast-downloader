"use client";
import { Check, Download, X } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "./ui/loadingSpinner";
import { Button } from "./ui/button";
import { isDesktop } from "react-device-detect";

export enum DownloadState {
  ReadyToDownload = "readyToDownload",
  Downloading = "downloading",
  Downloaded = "downloaded",
  DownloadOnDesktop = "downloadOnDesktop",
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
    existingState ?? "readyToDownload"
  );

  const handleDownload = async () => {
    setDownloadState(DownloadState.Downloading);
    updateLocalState(id, DownloadState.Downloading);
    const anchor = document.createElement("a");

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      anchor.href = blobUrl;
      anchor.download = fileName;
      await anchor.click();

      // Clean up the blob URL after download
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Open the URL in a new tab if there's an error (likely CORS)
      if (!isDesktop) setDownloadState(DownloadState.DownloadOnDesktop);
      else {
        window.open(url, "_blank");
      }
    } finally {
      // Clean up the anchor element
      anchor.remove();
      setDownloadState(DownloadState.Downloaded);
      updateLocalState(id, DownloadState.Downloaded);
    }
  };

  const downloadIcon = {
    readyToDownload: <Download />,
    downloading: <LoadingSpinner />,
    downloaded: <Check />,
    downloadOnDesktop: <X />,
  };

  const buttonStyle: Record<
    DownloadState,
    "default" | "ghost" | "destructive"
  > = {
    readyToDownload: "default",
    downloading: "default",
    downloaded: "ghost",
    downloadOnDesktop: "destructive",
  };

  const buttonAriaLabel: Record<DownloadState, string> = {
    readyToDownload: "Download episode",
    downloading: "Downloading episode",
    downloaded: "Downloaded",
    downloadOnDesktop: "Please download on desktop browser",
  };

  const handleOnClick = {
    readyToDownload: handleDownload,
    downloading: undefined,
    downloaded: handleDownload,
    downloadOnDesktop: undefined,
  };

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
