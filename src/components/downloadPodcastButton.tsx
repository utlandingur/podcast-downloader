"use client";
import { Check, Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "./ui/loadingSpinner";
import { Button } from "./ui/button";
import { useCantDownloadStore } from "@/hooks/useCanDownloadStore";

export type DownloadState =
  | "readyToDownload"
  | "downloading"
  | "downloaded"
  | "downloadInNewTab"
  | "error";

type DownloadPodcastButtonProps = {
  existingState: DownloadState | undefined;
  updateLocalState: (id: number, state: DownloadState) => void;
  id: number;
  url: string;
  fileName: string;
  podcastId: string; // Lots of prop drilling to get here. Making it work for now. But will need to refactor.
  canDownload: boolean; // Lots of prop drilling to get here. Making it work for now. But will need to refactor.
};

const downloadIcon = {
  readyToDownload: <Download />,
  downloadInNewTab: <Download />,
  downloading: <LoadingSpinner />,
  downloaded: <Check />,
  error: <X />,
};

const buttonStyle: Record<DownloadState, "default" | "ghost" | "destructive"> =
  {
    readyToDownload: "default",
    downloading: "default",
    downloaded: "ghost",
    downloadInNewTab: "default",
    error: "destructive",
  };

const buttonAriaLabel: Record<DownloadState, string> = {
  readyToDownload: "Download episode",
  downloading: "Downloading episode",
  downloaded: "Downloaded",
  downloadInNewTab: "Download episode in new tab",
  error: "Error downloading episode",
};

export const DownloadPodcastButton = ({
  existingState,
  updateLocalState,
  url,
  id,
  fileName,
  canDownload,
  podcastId,
}: DownloadPodcastButtonProps) => {
  const [downloadState, setDownloadState] = useState<DownloadState>(
    existingState ?? canDownload ? "readyToDownload" : "downloadInNewTab"
  );
  const setCannotDownload = useCantDownloadStore(
    (state) => state.setCannotDownload
  );
  let handleDownload;

  useEffect(() => {
    console.log("Download state changed to: ", downloadState);
  }, [downloadState]);

  useEffect(() => {
    console.log("podcastId in download button is", id);
  }, [id]);

  if (canDownload) {
    handleDownload = async () => {
      setDownloadState("downloading");
      updateLocalState(id, "downloading");
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
        // There's likely a cors error, so we'll ask to open the download in a new tab
        setCannotDownload(podcastId);
        setDownloadState("downloadInNewTab");
        console.log(
          "Failed to download the file so setting to download in new tab"
        );
      } finally {
        // Clean up the anchor element
        anchor.remove();
        setDownloadState("downloaded");
        updateLocalState(id, "downloaded");
      }
    };
  } else {
    handleDownload = () => {
      const newWindow = window.open(url, "_blank");
      if (!newWindow) {
        console.warn("Popup was blocked or failed to open");
        setDownloadState("error");
        return;
      }
      setDownloadState("downloaded");
    };
  }

  const handleOnClick = {
    readyToDownload: handleDownload,
    downloading: undefined,
    downloaded: handleDownload,
    downloadInNewTab: handleDownload,
    error: undefined,
  };

  return (
    <Button
      size={"sm"}
      variant={buttonStyle[downloadState]}
      onClick={handleOnClick[downloadState]}
      aria-disabled={downloadState === "downloading"}
      aria-label={buttonAriaLabel[downloadState]}
    >
      {downloadIcon[downloadState]}
      {downloadState === "readyToDownload" && "Download"}
      {downloadState === "downloaded" && "Downloaded"}
      {downloadState === "downloadInNewTab" && "Download in new tab"}
    </Button>
  );
};
