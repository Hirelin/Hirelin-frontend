"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JobFilters } from "./job-filters";
import { JobList } from "./job-list";
import { JobPagination } from "./job-pagination";
import { JobCardData, JobFiltersType } from "~/types/jobs";

interface JobExplorerProps {
  initialJobs: JobCardData[];
  totalJobs: number;
  totalPages: number;
  currentPage: number;
  initialFilters: JobFiltersType;
}

/**
 * Main job exploration component that manages the overall state
 */
export function JobExplorer({
  initialJobs,
  totalJobs,
  totalPages,
  currentPage: initialPage,
  initialFilters,
}: JobExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Use state from server but allow client-side updates
  const [jobs] = useState<JobCardData[]>(initialJobs);
  const [filters, setFilters] = useState<JobFiltersType>(initialFilters);

  // Ensure we keep our filter state in sync with URL parameters
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Apply filters by updating the URL
  const applyFilters = () => {
    startTransition(() => {
      // Create new search params
      const params = new URLSearchParams();

      if (filters.search) params.set("search", filters.search);
      if (filters.location) params.set("location", filters.location);

      // Handle job types
      if (filters.jobTypes?.length) {
        params.set("jobTypes", filters.jobTypes.join(","));
      }

      // Also add experience levels and skills to URL params for persistence
      if (filters.experienceLevels?.length) {
        params.set("experienceLevels", filters.experienceLevels.join(","));
      }

      if (filters.skills?.length) {
        params.set("skills", filters.skills.join(","));
      }

      // Navigate to the new URL which will trigger a server-side fetch
      router.push(`/jobs?${params.toString()}`);
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      location: "",
      jobTypes: [],
      experienceLevels: [],
      skills: [],
    });

    // Navigate to the base URL
    startTransition(() => {
      router.push("/jobs");
    });
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    startTransition(() => {
      // Create new search params based on current ones
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());

      // Navigate to the new page
      router.push(`/jobs?${params.toString()}`);

      // Scroll to top of job list for better UX
      document.getElementById("job-list-container")?.scrollIntoView({
        behavior: "smooth",
      });
    });
  };

  return (
    <div className="space-y-6">
      <JobFilters
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
      />

      {/* Fixed height container to prevent layout shifts */}
      <div id="job-list-container" className="min-h-[500px]">
        {!isPending && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{jobs.length}</span> of{" "}
              <span className="font-medium">{totalJobs}</span> results
            </p>
          </div>
        )}

        <JobList jobs={jobs} isLoading={isPending} />
      </div>

      {/* Pagination with conditional display to prevent layout shift */}
      <div
        className={`mt-8 transition-opacity duration-300 ${
          isPending ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        {totalPages > 1 && (
          <JobPagination
            currentPage={initialPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
