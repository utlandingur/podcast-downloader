"use client";
import { cn } from "@/lib/utils";
import {
  FacebookIcon,
  RedditIcon,
  TwitterIcon,
  WhatsappIcon,
  FacebookShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

type SocialShareLinksProps = {
  url: string;
  title: string;
};

export const SocialShareLinks = ({ url, title }: SocialShareLinksProps) => (
  <div className={cn("flex flex-col gap-4")}>
    <h2>Share on social</h2>
    <div className={cn("flex w-full gap-4 justify-center")}>
      <FacebookShareButton url={url}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton
        url={url}
        title={title}
        hashtags={["downloadPodcasts", "podcasts", "mp3"]}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <WhatsappShareButton url={url} title={title} separator=" - ">
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      <RedditShareButton url={url} title={title}>
        <RedditIcon size={32} round />
      </RedditShareButton>
    </div>
  </div>
);
