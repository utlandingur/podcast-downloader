import { useEffect } from "react";
import { useUserStore } from "@/hooks/useUser";
import { Session } from "next-auth";

/**
 *
 * Uses session to sync local user with the dbuser.
 *
 */
export const useSyncUser = (session: Session | null) => {
  const { syncUser } = useUserStore((state) => state);

  useEffect(() => {
    const fetchUser = async () => {
      await syncUser(session?.user?.email || null);
    };
    if (session?.user?.email) fetchUser();
  }, [session, syncUser]);
  return null;
};
