"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";

const PageLoadContext = createContext<{ startLoading: () => void } | undefined>(
  undefined
);

// To check if a new page is loading
export const PageLoadProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  const startLoading = () => {
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="w-dvw h-dvh justify-center items-center flex">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <PageLoadContext.Provider value={{ startLoading }}>
      {children}
    </PageLoadContext.Provider>
  );
};

// Custom hook to use the PageLoadContext
export const usePageLoad = () => {
  const context = useContext(PageLoadContext);
  if (context === undefined) {
    throw new Error("usePageLoad must be used within a PageLoadProvider");
  }
  return context;
};
