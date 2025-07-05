import { env } from "~/env";
import { JobFiltersType, JobsResponse } from "~/types/jobs";

/**
 * Fetches jobs with filtering and pagination
 * This can be used from both client and server components
 */
export async function getJobs(filters: JobFiltersType): Promise<JobsResponse> {
  try {
    const res = await fetchJobsFromAPI(filters);
    return res;
  } catch (error) {
    return {
      jobs: [],
      totalJobs: 0,
      totalPages: 0,
      currentPage: 0,
    } as JobsResponse;
  }
}

/**
 * API function to fetch jobs from backend
 */
export async function fetchJobsFromAPI(
  filters: JobFiltersType
): Promise<JobsResponse> {
  const queryParams = new URLSearchParams();

  if (filters.search) queryParams.append("search", filters.search);
  if (filters.location) queryParams.append("location", filters.location);
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.jobTypes?.length)
    queryParams.append("jobTypes", filters.jobTypes.join(","));

  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER_URL}/api/jobs/list-jobs?${queryParams}`,
    {
      // Disable caching with cache: 'no-store'
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch jobs");
  return response.json();
}
