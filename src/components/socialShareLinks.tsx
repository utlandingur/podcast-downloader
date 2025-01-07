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
      <FacebookShareButton url={url} aria-label="Share on Facebook Button">
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton
        url={url}
        title={title}
        hashtags={["downloadPodcasts", "podcasts", "mp3"]}
        aria-label="Share on Twitter Button"
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <WhatsappShareButton
        url={url}
        title={title}
        separator=" - "
        aria-label="Share on Whatsapp Button"
      >
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      <RedditShareButton
        url={url}
        title={title}
        aria-label="Share on Reddit Button"
      >
        <RedditIcon size={32} round />
      </RedditShareButton>
    </div>
  </div>
);
