/**
 * Filter parameters for job searches
 */
export type JobFiltersType = {
  search?: string;
  location?: string;
  jobTypes?: string[];
  experienceLevels?: string[];
  skills?: string[];
  page?: number;
};

/**
 * Job type definitions matching Prisma schema
 */
export enum JobType {
  FULL_TIME = "fullTime",
  PART_TIME = "partTime",
  CONTRACT = "contract",
  INTERNSHIP = "internship",
  FREELANCE = "freelance",
  TEMPORARY = "temporary",
  VOLUNTEER = "volunteer",
  REMOTE = "remote",
  ON_SITE = "onSite",
  HYBRID = "hybrid",
}

/**
 * Type for a job card data
 */
export interface JobCardData {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string; // Salary remains as string
  postedDate: string;
  skills: string[];
  matchScore?: number;
  description?: string;
}

/**
 * Response type for job search results
 */
export interface JobsResponse {
  jobs: JobCardData[];
  totalJobs: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Job type display mapping
 */
export const JOB_TYPE_LABELS: Record<string, string> = {
  fullTime: "Full-time",
  partTime: "Part-time",
  contract: "Contract",
  internship: "Internship",
  freelance: "Freelance",
  temporary: "Temporary",
  volunteer: "Volunteer",
  remote: "Remote",
  onSite: "On-site",
  hybrid: "Hybrid",
};

/**
 * Available experience levels for filtering
 */
export const EXPERIENCE_LEVELS = [
  "Entry Level",
  "Mid Level",
  "Senior",
  "Lead",
  "Executive",
];

/**
 * Popular skills for filtering
 */
export const POPULAR_SKILLS = [
  "JavaScript",
  "React",
  "Python",
  "Java",
  "SQL",
  "AWS",
  "Product Management",
  "UX Design",
];
