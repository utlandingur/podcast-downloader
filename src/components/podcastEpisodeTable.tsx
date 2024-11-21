"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PodcastEpisode } from "@/types/podcasts";
import { Button } from "./ui/button";
import { Link } from "lucide-react";

type PodcastEpisodeTableProps = {
  podcastEpisodes: PodcastEpisode[];
};

export function PodcastEpisodeTable({
  podcastEpisodes,
}: PodcastEpisodeTableProps) {
  console.log(podcastEpisodes[0]);
  return (
    <Table className="w-auto justify-self-center">
      <TableCaption>All podcast episodes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Episode</TableHead>
          <TableHead className="text-right">Length</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {podcastEpisodes.map((episode, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{episode.trackName}</TableCell>
            <TableCell className="text-right">
              {Math.floor(episode.trackTimeMillis / 1000 / 60)} minutes
            </TableCell>
            <TableCell className="text-right">
              <a href={episode.trackViewUrl} target="_blank">
                <Button size={"icon"} variant={"outline"}>
                  <Link />{" "}
                </Button>
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
