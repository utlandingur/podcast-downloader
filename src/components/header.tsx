import { cn } from "@/lib/utils";
import Link from "next/link";

export const Header = () => {
  return (
    <div className={cn("p-4 font-semibold bg-primary")}>
      <Link href={"/"} className="text-primary-foreground">
        PodcastToMp3.com
      </Link>
    </div>
  );
};
