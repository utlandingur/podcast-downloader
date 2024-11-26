"use client";
import { Check, Download, X } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "./ui/loadingSpinner";
import { Button } from "./ui/button";
import { track } from "@vercel/analytics/react";

export type DownloadState = "readyToDownload" | "downloading" | "downloaded";

type DownloadPodcastButtonProps = {
  existingState: DownloadState;
  updateLocalState: (state: DownloadState) => void;
  url: string;
  fileName: string;
};

export const DownloadPodcastButton = ({
  existingState,
  updateLocalState,
  url,
  fileName,
}: DownloadPodcastButtonProps) => {
  const [downloadState, setDownloadState] = useState<DownloadState>(
    existingState ?? "readyToDownload"
  );

  const handleDownload = async () => {
    setDownloadState("downloading");
    updateLocalState("downloading");
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
      track("Downloaded episode");
    } catch {
      // Open the URL in a new tab if there's an error (likely CORS)
      window.open(url, "_blank");
      track("Opened episode in new window");
    } finally {
      // Clean up the anchor element
      anchor.remove();
      setDownloadState("downloaded");
      updateLocalState("downloaded");
    }
  };

  const downloadIcon = {
    readyToDownload: <Download />,
    downloading: <LoadingSpinner />,
    downloaded: <Check />,
    error: <X />,
  };

  const buttonStyle: Record<
    DownloadState,
    "default" | "ghost" | "destructive"
  > = {
    readyToDownload: "default",
    downloading: "default",
    downloaded: "ghost",
  };

  const buttonAriaLabel: Record<DownloadState, string> = {
    readyToDownload: "Download episode",
    downloading: "Downloading episode",
    downloaded: "Downloaded",
  };

  const handleOnClick = {
    readyToDownload: handleDownload,
    downloading: undefined,
    downloaded: undefined,
  };

  return (
    <div className="flex justify-center">
      <Button
        size={"icon"}
        variant={buttonStyle[downloadState]}
        onClick={handleOnClick[downloadState]}
        aria-disabled={downloadState !== "readyToDownload"}
        aria-label={buttonAriaLabel[downloadState]}
      >
        {downloadIcon[downloadState]}
      </Button>
    </div>
  );
};
