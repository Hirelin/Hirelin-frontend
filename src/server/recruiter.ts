import { cookies } from "next/headers";
import { env } from "~/env";
import { SESSION_TOKEN_NAME } from "~/zod/constants";

type RecruiterUser = {
  email: string;
  image?: string;
};

type Recruiter = {
  id: string;
  name: string;
  organization?: string;
  position?: string;
  user?: RecruiterUser;
};

type ApplicationUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

type ApplicationResume = {
  id: string;
  url: string;
};

export type Application = {
  id: string;
  status: string;
  createdAt: string;
  user: ApplicationUser;
  resume: ApplicationResume;
  contentScore: number | null;
  layoutScore: number | null;
};

type UploadFile = {
  id: string;
  name: string;
  url: string;
  filetype?: string;
};

export type Training = {
  id: string;
  startDate: string;
  endDate: string;
  topics: string;
};

interface LearningPlan {
  id: string;
  completedPlans: number;
  planDetails: Record<string, any>;
  assessments: Array<{
    id: string;
    title: string;
    score: number;
  }>;
  applicationId: string;
  trainingId: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    assessment: number;
  };
}

export interface JobApplications extends Application {
  learningPlan: Array<LearningPlan>;
}

export type JobOpening = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  contact: string;
  address: string;
  status: string;
  deadline: string;
  startDate?: string | null;
  endDate?: string | null;
  requirementsFileId?: string;
  requirements?: UploadFile | null;
  parsedRequirements?: string;
  layoutTemplateId?: string;
  layoutTemplate?: UploadFile | null;
  trainingId?: string;
  recruiterId: string;
  recruiter?: Recruiter;
  createdAt: string;
  updatedAt: string;
  applications?: JobApplications[];
  training: Training | null;
};

export async function getJobDetailsById(
  jobId: string
): Promise<JobOpening | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_TOKEN_NAME);

    const response = await fetch(
      `${env.SERVER_URL}/api/jobs/recruiter/job-by-id?jobId=${jobId}`,
      {
        headers: {
          Cookie: `session_id=${sessionId?.value ?? ""};`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data.data;
  } catch (error) {
    return null;
  }
}
