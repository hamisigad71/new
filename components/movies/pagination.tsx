"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChangeAction: (page: number) => void;
  loading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChangeAction,
  loading = false,
}: PaginationProps) {
  const [loadingPage, setLoadingPage] = useState<number | null>(null);

  const handlePageChange = async (page: number) => {
    if (loading || page === currentPage) return;

    setLoadingPage(page);
    try {
      await onPageChangeAction(page);
    } finally {
      setLoadingPage(null);
    }
  };

  const getVisiblePages = () => {
    const delta = 1; // Number of pages to show on each side of current page
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    // Always show first page
    rangeWithDots.push(1);

    // Calculate range of pages to show
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add dots before range if needed
    if (range[0] > 2) {
      rangeWithDots.push("...");
    } else if (range[0] === 2) {
      rangeWithDots.push(2);
    }

    // Add range
    rangeWithDots.push(
      ...range.filter((page) => !rangeWithDots.includes(page))
    );

    // Add dots after range if needed
    if (range[range.length - 1] < totalPages - 1) {
      rangeWithDots.push("...");
    } else if (range[range.length - 1] === totalPages - 1) {
      rangeWithDots.push(totalPages - 1);
    }

    // Always show last page
    if (totalPages > 1 && !rangeWithDots.includes(totalPages)) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-12">
      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm mr-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={`bg-white text-blue-700 hover:bg-blue-700 hover:text-white border-none ${
          currentPage === 1 || loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loadingPage === currentPage - 1 ? (
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        ) : (
          <ChevronLeft className="h-4 w-4 mr-1" />
        )}
        Prev
      </Button>

      <div className="flex flex-wrap items-center gap-1">
        {getVisiblePages().map((page, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={typeof page !== "number" || loading}
            className={`min-w-[40px] bg-white text-blue-700 border-none
              hover:bg-blue-700 hover:text-white
              ${page === currentPage ? "bg-blue-700 text-white" : ""}
              ${
                typeof page !== "number" || loading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            `}
          >
            {loadingPage === page ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              page
            )}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className={`bg-white text-blue-700 hover:bg-blue-700 hover:text-white border-none ${
          currentPage === totalPages || loading
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {loadingPage === currentPage + 1 ? (
          <Loader2 className="h-4 w-4 ml-1 animate-spin" />
        ) : (
          <>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </>
        )}
      </Button>
    </div>
  );
}
