import { PodcastEpisode as BasePodcastEpisode } from "@/types/podcasts";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DownloadPodcastButton, DownloadState } from "../downloadPodcastButton";

interface PodcastEpisode extends BasePodcastEpisode {
  downloadState?: DownloadState;
}

export const columns: ColumnDef<PodcastEpisode>[] = [
  {
    accessorKey: "trackName",
    header: "Episode",
    cell: ({ getValue }) => {
      const trackName = getValue<string>();
      const maxLength = 40;
      const truncatedTrackName =
        trackName.length > maxLength
          ? trackName.slice(0, maxLength).trim() + "..."
          : trackName;

      return truncatedTrackName;
    },
  },

  {
    accessorKey: "releaseDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const value = getValue<string>();
      const date = new Date(value);
      const year = date.getFullYear();
      const month = date.getMonth();
      return (
        <div className="text-center">
          {month}/{year}
        </div>
      );
    },
  },
  {
    accessorKey: "episodeUrl",
    header: "Download",
    cell: ({ getValue, row }) => {
      const url = getValue<string>();
      const filename = `${row.original.collectionName}-episode-${row.original.trackName}.mp3`;

      const updateLocalState = (state: DownloadState) => {
        row.original.downloadState = state;
      };
      return (
        <DownloadPodcastButton
          updateLocalState={updateLocalState}
          url={url}
          fileName={filename}
          existingState={row.original.downloadState ?? "readyToDownload"}
        />
      );
    },
  },
];
