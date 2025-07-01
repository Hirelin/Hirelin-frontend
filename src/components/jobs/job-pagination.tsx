import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
} from "~/components/ui/pagination";

type PaginationItemType = number | "ellipsis-start" | "ellipsis-end";

interface JobPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Handles job results pagination
 */
export function JobPagination({
  currentPage,
  totalPages,
  onPageChange,
}: JobPaginationProps) {
  // Calculate which pagination items to show
  const getPaginationItems = (): PaginationItemType[] => {
    const items: PaginationItemType[] = [];

    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // For more than 5 pages, use a more robust approach
      if (currentPage <= 3) {
        // When near the start, show 1, 2, 3, 4, ..., totalPages
        for (let i = 1; i <= 4; i++) {
          if (i <= totalPages) items.push(i);
        }
        if (totalPages > 5) {
          items.push("ellipsis-end");
          items.push(totalPages);
        } else if (totalPages === 5) {
          items.push(5);
        }
      } else if (currentPage >= totalPages - 2) {
        // When near the end
        items.push(1);
        items.push("ellipsis-start");

        // Show last 4 pages
        for (let i = totalPages - 3; i <= totalPages; i++) {
          if (i > 1) items.push(i);
        }
      } else {
        // When in the middle
        items.push(1);
        items.push("ellipsis-start");
        items.push(currentPage - 1, currentPage, currentPage + 1);
        items.push("ellipsis-end");
        items.push(totalPages);
      }
    }

    return items;
  };

  return (
    <Pagination>
      <PaginationContent className="flex-wrap">
        <PaginationItem className="mr-1">
          <PaginationPrevious
            onClick={
              currentPage === 1
                ? undefined
                : () => onPageChange(Math.max(currentPage - 1, 1))
            }
            aria-disabled={currentPage === 1}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          >
            Previous
          </PaginationPrevious>
        </PaginationItem>

        {getPaginationItems().map((item, index) => {
          if (item === "ellipsis-start" || item === "ellipsis-end") {
            return <PaginationEllipsis key={`ellipsis-${index}`} />;
          }

          return (
            <PaginationItem key={`page-${item}`}>
              <PaginationLink
                isActive={currentPage === item}
                onClick={() => onPageChange(item)}
                className="min-w-[40px] flex justify-center"
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem className="ml-1">
          <PaginationNext
            onClick={
              currentPage === totalPages
                ? undefined
                : () => onPageChange(Math.min(currentPage + 1, totalPages))
            }
            aria-disabled={currentPage === totalPages}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          >
            Next
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
