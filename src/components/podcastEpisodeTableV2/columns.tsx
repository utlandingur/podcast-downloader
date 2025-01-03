import type { EnrichedEpisodeV2 } from "@/types/podcasts";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DownloadPodcastButton, DownloadState } from "../downloadPodcastButton";

export const columns: ColumnDef<EnrichedEpisodeV2>[] = [
  {
    accessorKey: "title",
    header: "Episode",
    cell: ({ getValue }) => {
      const title = getValue<string>();
      const maxLength = 40;
      const truncatedTitle =
        title?.length > maxLength
          ? title.slice(0, maxLength).trim() + "..."
          : title;

      return truncatedTitle;
    },
  },

  {
    accessorKey: "datePublished",
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
      const date = getValue<Date>();
      const day = date?.getDate();
      const year = date?.getFullYear();
      const month = date?.getMonth() + 1;
      return (
        <div className="text-center">
          {day}-{month}-{year}
        </div>
      );
    },
  },
  {
    accessorKey: "episodeUrl",
    header: "Download",
    cell: ({ getValue, row }) => {
      const url = getValue<string>();
      const filename = `${row.original.podcastName}-episode-${row.original.title}.mp3`;

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
