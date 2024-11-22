"use client";
import { Check, Download, X } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "./ui/loadingSpinner";
import { Button } from "./ui/button";

type DownloadPodcastButtonProps = {
  existingState: "readyToDownload" | "downloading" | "downloaded" | "error";
  updateLocalState: (
    state: "readyToDownload" | "downloading" | "downloaded" | "error"
  ) => void;
  url: string;
  fileName: string;
};

export const DownloadPodcastButton = ({
  existingState,
  updateLocalState,
  url,
  fileName,
}: DownloadPodcastButtonProps) => {
  const [downloadState, setDownloadState] = useState<
    "readyToDownload" | "downloading" | "downloaded" | "error"
  >(existingState ?? "readyToDownload");
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
      anchor.click();

      // Clean up the blob URL after download
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      setDownloadState("error");
      updateLocalState("error");
    } finally {
      // Clean up the anchor element
      anchor.remove();
      if (existingState !== "error") {
        setDownloadState("downloaded");
        updateLocalState("downloaded");
      }
    }
  };

  const downloadIcon = {
    readyToDownload: <Download />,
    downloading: <LoadingSpinner />,
    downloaded: <Check />,
    error: <X />,
  };

  const buttonStyle: Record<
    "readyToDownload" | "downloading" | "downloaded" | "error",
    "default" | "ghost" | "destructive"
  > = {
    readyToDownload: "default",
    downloading: "default",
    downloaded: "ghost",
    error: "destructive",
  };

  const buttonAriaLabel: Record<
    "readyToDownload" | "downloading" | "downloaded" | "error",
    string
  > = {
    readyToDownload: "Download episode",
    downloading: "Downloading episode",
    downloaded: "Downloaded",
    error: "Error downloading episode",
  };

  return (
    <div className="flex justify-center">
      <Button
        size={"icon"}
        variant={buttonStyle[downloadState]}
        onClick={
          downloadState === "readyToDownload" || downloadState === "error"
            ? handleDownload
            : undefined
        }
        aria-disabled={downloadState !== "readyToDownload"}
        aria-label={buttonAriaLabel[downloadState]}
      >
        {downloadIcon[downloadState]}
      </Button>
    </div>
  );
};
