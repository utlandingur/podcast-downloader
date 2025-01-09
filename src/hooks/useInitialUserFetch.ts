import { useEffect, useState } from "react";
import { useUserStore } from "@/hooks/useUser";
import { Session } from "next-auth";

/**
 *
 * Uses session to sync local user with the dbuser.
 *
 */
export const useSyncUser = (session: Session | null) => {
  const { syncUser } = useUserStore((state) => state);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (loading) return;
      setLoading(true);
      await syncUser(session);
      setLoading(false);
    };
    if (!loading) fetchUser();
  }, [session, syncUser, loading]);
};
