"use client";
import { UserType } from "@/models/user";
import { findOrCreateUser } from "@/serverActions/userActions";
import { useEffect, useState } from "react";

export const useUser = (email: string | null) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!email) return;
      setError(null); // Clear any previous error
      setLoading(true);
      try {
        const user = await findOrCreateUser(email);
        setUser(user);
      } catch (error) {
        setError("Error fetching user.");
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [email]);

  return { user, loading, error };
};
