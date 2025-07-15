import { cookies } from "next/headers";
import { env } from "~/env";
import { SESSION_TOKEN_NAME } from "~/zod/constants";

interface Uploads {
  id: string;
  filetype: string;
  name: string;
  url: string;
  _count: {
    applications: number;
    jobOpenings: number;
  };
}

enum ApplicationStatus {
  pending = "pending",
  rejected = "rejected",
  accepted = "accepted",
  training = "training",
  hired = "hired",
}

interface PlanDetails {
  day: number;
  title: string;
  topics: string[];
  resources: {
    type: string;
    title: string;
    estimated_time: string;
  }[];
  learning_objectives: string[];
}

interface LearningPlan {
  id: string;
  planDetails: PlanDetails[] | null;
  completed_plans: number;
  createdAt: Date;
  _count: {
    assesments: number;
  };
  assessments: {
    id: string;
    title: string;
    description: string;
    score: number;
  }[];
}

export interface Applications {
  id: string;
  status: ApplicationStatus;
  layoutScore: number;
  contentScore: number;
  jobOpening: {
    id: string;
    title: string;
    company: string;
  };
  learningPlan: LearningPlan[];
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  uploads: Uploads[];
  applications: Applications[];
}

interface UserProfileResponse {
  status: "authenticated" | "unauthenticated" | "error";
  data: UserProfile | null;
}

export async function getUserProfile(): Promise<UserProfileResponse> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_TOKEN_NAME);

    if (sessionId === undefined || sessionId.value === "") {
      return {
        status: "unauthenticated",
        data: null,
      };
    }

    const response = await fetch(
      `${env.NEXT_PUBLIC_SERVER_URL}/api/jobs/user/profile`,
      {
        credentials: "include",
        method: "GET",
        headers: {
          Cookie: `session_id=${sessionId.value};`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Failed to fetch user profile: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.success) {
      return {
        status: "authenticated",
        data: data.data,
      };
    }

    return {
      status: "error",
      data: null,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return {
      status: "error",
      data: null,
    };
  }
}

export async function getApplicationPlans(applicationId: string): Promise<{
  status: "success" | "unauthenticated" | "error";
  data: Applications | null;
}> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_TOKEN_NAME);

    if (sessionId === undefined || sessionId.value === "") {
      return {
        status: "unauthenticated",
        data: null,
      };
    }

    const response = await fetch(
      `${env.NEXT_PUBLIC_SERVER_URL}/api/jobs/user/get-learning-plans?applicationId=${applicationId}`,
      {
        credentials: "include",
        method: "GET",
        headers: {
          Cookie: `session_id=${sessionId.value};`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Failed to fetch Application plans: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.success) {
      return {
        status: "success",
        data: data.data,
      };
    }

    return {
      status: "error",
      data: null,
    };
  } catch (error) {
    console.error("Error fetching Application Plans:", error);
    return {
      status: "error",
      data: null,
    };
  }
}

interface Questions {
  question: string;
  explanation: string;
  correct_answer: string;
  options: string[];
}

export interface Assessment {
  id: string;
  title: string; // will be a number
  description: string;
  questions: Questions[];
  score: number;
  learningPlanId: string;
  createdAt: string;
  updatedAt: string;
  learningPlan: LearningPlan;
}

export async function getAssessment(assesmentId: string): Promise<{
  status: "success" | "unauthenticated" | "error";
  data: Assessment | null;
}> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_TOKEN_NAME);

    if (sessionId === undefined || sessionId.value === "") {
      return {
        status: "unauthenticated",
        data: null,
      };
    }

    const response = await fetch(
      `${env.NEXT_PUBLIC_SERVER_URL}/api/jobs/user/get-assessment?assessmentId=${assesmentId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Cookie: `session_id=${sessionId.value};`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        status: "error",
        data: null,
      };
    }

    return {
      status: "success",
      data: data.data,
    };
  } catch (error) {
    return {
      status: "error",
      data: null,
    };
  }
}
