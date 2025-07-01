import { JobExplorer } from "~/components/jobs/job-explorer";
import { getJobs } from "~/lib/jobs";
import { JobFiltersType } from "~/types/jobs";

// Default filter state
const defaultFilters: JobFiltersType = {
  search: "",
  location: "",
  jobTypes: [],
  experienceLevels: [],
  skills: [],
  page: 1,
};

// Helper function to parse array params
function parseArrayParam(param: string | string[] | undefined): string[] {
  if (!param) return [];

  return Array.isArray(param) ? param : param.split(",").filter(Boolean);
}

// Server Component with data fetching
export default async function JobsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Parse search params
  const page = searchParams?.page ? parseInt(searchParams.page as string) : 1;
  const search = (searchParams?.search as string) || "";
  const location = (searchParams?.location as string) || "";

  // Parse array parameters
  const jobTypes = parseArrayParam(searchParams?.jobTypes);
  const experienceLevels = parseArrayParam(searchParams?.experienceLevels);
  const skills = parseArrayParam(searchParams?.skills);

  // Create filters from search params
  const filters: JobFiltersType = {
    ...defaultFilters,
    search,
    location,
    jobTypes,
    experienceLevels,
    skills,
    page,
  };

  // Fetch jobs server-side with await - this will use the API in production
  const jobsData = await getJobs(filters);

  return (
    <section className="container mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Explore Jobs</h1>
        <p className="text-muted-foreground">
          Find your next career opportunity from our curated list of positions
        </p>
      </div>

      <JobExplorer
        initialJobs={jobsData.jobs}
        totalJobs={jobsData.totalJobs}
        totalPages={jobsData.totalPages}
        currentPage={jobsData.currentPage}
        initialFilters={filters}
      />
    </section>
  );
}

// Types moved to a dedicated types file
export * from "~/types/jobs";
