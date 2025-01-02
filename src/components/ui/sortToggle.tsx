"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpNarrowWide, ArrowDownNarrowWide } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortToggleProps {
  onToggle: (isAscending: boolean) => void;
  initialValue?: boolean;
}

export function SortToggle({ onToggle, initialValue }: SortToggleProps) {
  const [isAscending, setIsAscending] = useState(initialValue ?? true);

  const handleToggle = () => {
    const newOrder = !isAscending;
    setIsAscending(newOrder);
    onToggle(newOrder);
  };

  return (
    <Button
      variant="outline"
      size="default"
      onClick={handleToggle}
      aria-label={isAscending ? "Sort Ascending" : "Sort Descending"}
    >
      {isAscending ? (
        <div className={cn("flex gap-2")}>
          <ArrowUpNarrowWide className="h-4 w-4" />
          <div>Ascending</div>
        </div>
      ) : (
        <div className={cn("flex gap-2")}>
          <ArrowDownNarrowWide className="h-4 w-4" />
          <div>Descending</div>
        </div>
      )}
    </Button>
  );
}
