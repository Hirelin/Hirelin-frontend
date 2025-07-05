interface RecruiterJob {
  id: string;
  title: string;
  company: string;
  location?: string;
  type: string;
  postedDate: string;
  description: string;
  status?: string; // We'll keep this for UI purposes
  applicantsCount?: number; // We'll keep this for UI purposes
  requirements?: string; // Optional field for job requirements
}

interface RecruiterJobsResponse {
  success: boolean;
  message: string;
  jobs: RecruiterJob[];
}

export interface RecruiterApplication {
  id: string;
  status: string;
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
  };
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

interface RecruiterApplicationsResponse {
  message: string;
  status: string;
  data: RecruiterApplication[];
}

export async function getRecruiterJobs(): Promise<RecruiterJob[]> {
  try {
    // Fetch jobs from the API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/jobs/recruiter-jobs`,
      {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch recruiter jobs: ${response.status}`);
    }

    const data = (await response.json()) as RecruiterJobsResponse;

    // Extract jobs from the response
    if (data && data.success && Array.isArray(data.jobs)) {
      return data.jobs;
    }

    return [];
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error);
    throw error; // Re-throw to let the component handle it
  }
}

export async function getRecruiterApplications(): Promise<
  RecruiterApplication[]
> {
  try {
    // Fetch jobs from the API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/jobs/applications`,
      {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch recruiter jobs: ${response.status}`);
    }

    const data = (await response.json()) as RecruiterApplicationsResponse;

    if (data && data.status === "success" && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error);
    throw error; // Re-throw to let the component handle it
  }
}
