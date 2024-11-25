import { cn } from "@/lib/utils";
import Link from "next/link";

export const Header = () => {
  return (
    <div
      className={cn("p-4 flex w-full font-semibold bg-primary justify-between")}
    >
      <Link href={"/"} className="text-primary-foreground">
        PodcastToMp3.com
      </Link>
      <Link href={"/how-it-works"} className="text-primary-foreground">
        How it works
      </Link>
    </div>
  );
};
