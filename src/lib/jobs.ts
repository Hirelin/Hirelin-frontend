import {
  JobFiltersType,
  JobCardData,
  JobsResponse,
  JobType,
} from "~/types/jobs";

// Mock data aligned with Prisma schema JobOpenings
const mockJobs: JobCardData[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: JobType.FULL_TIME,
    salary: "$100,000 - $130,000",
    postedDate: "2023-06-15",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    matchScore: 92,
    description:
      "We're looking for a skilled frontend developer to join our team...",
  },
];

/**
 * Fetches jobs with filtering and pagination
 * This can be used from both client and server components
 */
export async function getJobs(filters: JobFiltersType): Promise<JobsResponse> {
  // Debug logging for both client and server
  console.log("getJobs called with filters:", filters);

  // Simulate delay only on client
  if (typeof window !== "undefined") {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  try {
    // Apply filters with improved logic
    const filteredJobs = mockJobs.filter((job) => {
      // For debugging
      let keepJob = true;
      const reasons: string[] = [];

      // Search filter
      if (filters.search) {
        const searchTermLower = filters.search.toLowerCase();
        const titleMatch = job.title.toLowerCase().includes(searchTermLower);
        const companyMatch = job.company
          .toLowerCase()
          .includes(searchTermLower);
        const descriptionMatch = job.description
          ? job.description.toLowerCase().includes(searchTermLower)
          : false;

        if (!(titleMatch || companyMatch || descriptionMatch)) {
          keepJob = false;
          reasons.push("Search term not found");
        }
      }

      // Location filter
      if (keepJob && filters.location) {
        if (
          !job.location.toLowerCase().includes(filters.location.toLowerCase())
        ) {
          keepJob = false;
          reasons.push("Location mismatch");
        }
      }

      // Job type filter
      if (keepJob && filters.jobTypes?.length) {
        // Debug job type comparisons
        console.log(
          `Checking job type: ${
            job.type
          } against filters: ${filters.jobTypes.join(", ")}`
        );

        if (!filters.jobTypes.includes(job.type)) {
          keepJob = false;
          reasons.push("Job type mismatch");
        }
      }

      // Experience level filter
      if (keepJob && filters.experienceLevels?.length) {
        // In a real app, job would have experience level field to compare against
        // For mock data, we'll skip this filter
      }

      // Skills filter
      if (keepJob && filters.skills?.length) {
        if (!filters.skills.some((skill) => job.skills.includes(skill))) {
          keepJob = false;
          reasons.push("Skills mismatch");
        }
      }

      if (!keepJob) {
        console.log(
          `Filtered out job ${job.id} (${job.title}). Reasons: ${reasons.join(
            ", "
          )}`
        );
      }

      return keepJob;
    });

    console.log(
      `Filtered ${mockJobs.length} jobs down to ${filteredJobs.length} jobs`
    );

    // Apply pagination - using 12 items per page
    const itemsPerPage = 12;
    const page = filters.page || 1;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Ensure we don't exceed the maximum items per page
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    return {
      jobs: paginatedJobs,
      totalJobs: filteredJobs.length,
      totalPages: Math.ceil(filteredJobs.length / itemsPerPage) || 1,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error processing jobs:", error);
    return {
      jobs: [],
      totalJobs: 0,
      totalPages: 1,
      currentPage: 1,
    };
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
  const response = await fetch(`${API_URL}/jobs?${queryParams}`);

  if (!response.ok) throw new Error("Failed to fetch jobs");
  return response.json();
}
