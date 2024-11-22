import { PodcastEpisode } from "@/types/podcasts";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";

export const columns: ColumnDef<PodcastEpisode>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "trackName",
    header: "Episode",
  },

  {
    accessorKey: "releaseDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label="Sort by release date"
        >
          Release Date
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
    accessorKey: "trackTimeMillis",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label="Sort by episode length"
        >
          Length
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const millis = getValue<number>();
      const minutes = Math.floor(millis / 6000 / 10); // Convert milliseconds to minutes
      return <div className="text-center">{minutes} min</div>;
    },
  },
  {
    accessorKey: "trackViewUrl",
    header: "View in iTunes",
    cell: ({ getValue, row }) => {
      const url = getValue<string>();
      return (
        <div className="flex justify-center">
          <a href={url} target="_blank">
            <Button
              size={"icon"}
              variant={"outline"}
              aria-label={`View track in iTunes: ${row.original.trackName}`}
            >
              <Link />
            </Button>
          </a>
        </div>
      );
    },
  },
];
