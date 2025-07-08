import { env } from "~/env";

interface RecruiterJob {
  id: string;
  title: string;
  company: string;
  location?: string;
  type: string;
  postedDate: string;
  description: string;
  status?: JobStatus; // Updated to use enum
  applicantsCount?: number; // We'll keep this for UI purposes
  requirements?: string; // Optional field for job requirements
  deadline?: string; // Optional deadline field - Prisma formatted date (ISO string)
}

interface RecruiterJobsResponse {
  success: boolean;
  message: string;
  jobs: RecruiterJob[];
}

export enum JobStatus {
  UPCOMING = "upcoming",
  OPEN = "open",
  CLOSED = "closed",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export enum ApplicationStatus {
  PENDING = "pending",
  REJECTED = "rejected",
  ACCEPTED = "accepted",
  TRAINING = "training",
  HIRED = "hired",
}

export interface RecruiterApplication {
  id: string;
  status: ApplicationStatus; // Updated to use enum
  jobOpeningId: string;
  userId: string;
  parsedResume: any;
  layoutScore: number;
  contentScore: number;
  skillGap: any;
  resumeId: string;
  createdAt: string;
  updatedAt: string;
  resume: {
    id: string;
    url: string;
  };
  jobOpening: {
    id: string;
    title: string;
    status: JobStatus; // Added job status to application
  };
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface RecruiterApplicationsResponse {
  message: string;
  status: string;
  data: RecruiterApplication[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

interface JobApplication {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: ApplicationStatus;
  jobOpeningId: string;
  parsedResume: string | null;
  layoutScore: number;
  contentScore: number;
  skillGap: string | null;
  resumeId: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string;
  };
  resume: {
    id: string;
    url: string;
  } | null;
}

export async function getRecruiterJobs(): Promise<RecruiterJob[]> {
  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_SERVER_URL}/api/jobs/recruiter/recruiter-jobs`,
      {
        next: { revalidate: 60 }, // Cache for 1 minute
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch recruiter jobs: ${response.status}`);
    }

    const data = (await response.json()) as RecruiterJobsResponse;

    if (data && data.success && Array.isArray(data.jobs)) {
      return data.jobs;
    }

    return [];
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error);
    throw error;
  }
}

export async function getRecruiterApplications(
  applicationStatuses?: ApplicationStatus[],
  jobStatuses?: JobStatus[],
  page = 1,
  limit = 10
): Promise<PaginatedResponse<RecruiterApplication>> {
  try {
    const url = new URL(
      `${env.NEXT_PUBLIC_SERVER_URL}/api/jobs/recruiter/applications`
    );

    if (applicationStatuses && applicationStatuses.length > 0) {
      applicationStatuses.forEach((status) => {
        url.searchParams.append("applicationStatus", status);
      });
    }

    if (jobStatuses && jobStatuses.length > 0) {
      jobStatuses.forEach((status) => {
        url.searchParams.append("jobStatus", status);
      });
    }

    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    const response = await fetch(url.toString(), {
      next: { revalidate: 30 }, // Cache for 30 seconds
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch recruiter applications: ${response.status}`
      );
    }

    const data = (await response.json()) as RecruiterApplicationsResponse;

    if (data && data.status === "success" && Array.isArray(data.data)) {
      return {
        data: data.data,
        total: data.pagination?.total || data.data.length,
        page: data.pagination?.page || page,
        limit: data.pagination?.limit || limit,
        hasMore: data.pagination?.hasMore || false,
      };
    }

    return {
      data: [],
      total: 0,
      page,
      limit,
      hasMore: false,
    };
  } catch (error) {
    console.error("Error fetching recruiter applications:", error);
    throw error;
  }
}

export async function updateJobStatus(
  jobId: string,
  status: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_SERVER_URL}/api/jobs/recruiter/update-job-status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          jobId: jobId,
          status: status,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update job status: ${response.status}`);
    }

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error("Error updating job status:", error);
    throw error;
  }
}

export async function getJobApplications(jobId: string) {
  try {
    const response = await fetch(
      `${
        env.NEXT_PUBLIC_SERVER_URL
      }/api/jobs/recruiter/application-by-id?jobId=${encodeURIComponent(
        jobId
      )}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch job applications: ${response.status}`);
    }

    const data = (await response.json()) as {
      success: boolean;
      message: string;
      data: JobApplication[];
    };

    if (data && data.success && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error);
    throw error;
  }
}

export const getJobStatusColor = (status: JobStatus): string => {
  switch (status) {
    case JobStatus.UPCOMING:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case JobStatus.OPEN:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case JobStatus.CLOSED:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    case JobStatus.CANCELLED:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case JobStatus.COMPLETED:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const getJobStatusLabel = (status: JobStatus): string => {
  switch (status) {
    case JobStatus.UPCOMING:
      return "Upcoming";
    case JobStatus.OPEN:
      return "Open";
    case JobStatus.CLOSED:
      return "Closed";
    case JobStatus.CANCELLED:
      return "Cancelled";
    case JobStatus.COMPLETED:
      return "Completed";
    default:
      return "Unknown";
  }
};

export const getApplicationStatusColor = (
  status: ApplicationStatus
): string => {
  switch (status) {
    case ApplicationStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case ApplicationStatus.ACCEPTED:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case ApplicationStatus.REJECTED:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case ApplicationStatus.TRAINING:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case ApplicationStatus.HIRED:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const getApplicationStatusLabel = (
  status: ApplicationStatus
): string => {
  switch (status) {
    case ApplicationStatus.PENDING:
      return "Pending";
    case ApplicationStatus.ACCEPTED:
      return "Accepted";
    case ApplicationStatus.REJECTED:
      return "Rejected";
    case ApplicationStatus.TRAINING:
      return "Training";
    case ApplicationStatus.HIRED:
      return "Hired";
    default:
      return "Unknown";
  }
};
