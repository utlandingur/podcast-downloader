import { cn } from "@/lib/utils";
import Link from "next/link";
import { LoginOutDialog } from "./LoginOutDialog";
import { auth } from "../../auth";

export const Header = async () => {
  const session = await auth();

  return (
    <div
      className={cn(
        "p-3 flex w-full font-semibold bg-primary justify-between items-center"
      )}
    >
      <Link href={"/"} className="text-primary-foreground">
        PodcastToMp3.com
      </Link>
      <LoginOutDialog showLogin={!!session} />
    </div>
  );
};
