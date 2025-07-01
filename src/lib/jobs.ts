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
  {
    id: "2",
    title: "Backend Engineer",
    company: "DataSystems Inc.",
    location: "Remote",
    type: "fullTime",
    salary: "$120,000 - $150,000",
    postedDate: "2023-06-10",
    skills: ["Node.js", "Express", "MongoDB", "AWS"],
    matchScore: 85,
    description: "Backend engineer role focused on building scalable APIs...",
  },
  {
    id: "3",
    title: "Product Manager",
    company: "InnovateX",
    location: "New York, NY",
    type: "fullTime",
    salary: "$130,000 - $160,000",
    postedDate: "2023-06-05",
    skills: ["Product Strategy", "Agile", "User Research", "Roadmapping"],
    matchScore: 78,
    description: "Lead our product team to develop innovative solutions...",
  },
  {
    id: "4",
    title: "UX Designer",
    company: "Creative Solutions",
    location: "Austin, TX",
    type: "contract",
    salary: "$90 - $110 / hour",
    postedDate: "2023-06-02",
    skills: ["Figma", "User Testing", "Wireframing", "Prototyping"],
    matchScore: 88,
    description: "Design user experiences for our flagship product...",
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Seattle, WA",
    type: "fullTime",
    salary: "$125,000 - $155,000",
    postedDate: "2023-06-01",
    skills: ["Kubernetes", "Docker", "CI/CD", "Terraform"],
    matchScore: 90,
    description: "Manage our cloud infrastructure and deployment pipelines...",
  },
  {
    id: "6",
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Remote",
    type: "fullTime",
    salary: "$110,000 - $140,000",
    postedDate: "2023-05-28",
    skills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
    matchScore: 82,
    description: "Analyze large datasets to derive actionable insights...",
  },
  {
    id: "7",
    title: "Mobile Developer",
    company: "AppWorks",
    location: "Chicago, IL",
    type: "fullTime",
    salary: "$105,000 - $135,000",
    postedDate: "2023-05-25",
    skills: ["React Native", "iOS", "Android", "Firebase"],
    matchScore: 87,
    description: "Develop cross-platform mobile applications...",
  },
  {
    id: "8",
    title: "Technical Writer",
    company: "DocSystems",
    location: "Remote",
    type: "partTime",
    salary: "$40 - $60 / hour",
    postedDate: "2023-05-22",
    skills: [
      "Technical Documentation",
      "Markdown",
      "API Documentation",
      "Content Strategy",
    ],
    matchScore: 79,
    description: "Create clear documentation for our technical products...",
  },
  {
    id: "9",
    title: "QA Engineer",
    company: "QualitySoft",
    location: "Boston, MA",
    type: "fullTime",
    salary: "$90,000 - $120,000",
    postedDate: "2023-05-20",
    skills: ["Automated Testing", "Selenium", "JIRA", "Test Planning"],
    matchScore: 84,
    description: "Ensure software quality through comprehensive testing...",
  },
  {
    id: "10",
    title: "Project Manager",
    company: "Delivery Pro",
    location: "Denver, CO",
    type: "fullTime",
    salary: "$115,000 - $140,000",
    postedDate: "2023-05-18",
    skills: ["Agile", "Scrum", "Project Planning", "Team Leadership"],
    matchScore: 86,
    description: "Lead projects from conception to completion...",
  },
  {
    id: "11",
    title: "Security Engineer",
    company: "SecureTech",
    location: "Washington, DC",
    type: "fullTime",
    salary: "$130,000 - $160,000",
    postedDate: "2023-05-15",
    skills: [
      "Network Security",
      "Penetration Testing",
      "Security Audits",
      "Encryption",
    ],
    matchScore: 91,
    description: "Protect company infrastructure and data from threats...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
  },
  {
    id: "12",
    title: "Content Strategist",
    company: "ContentLabs",
    location: "Remote",
    type: "contract",
    salary: "$80 - $100 / hour",
    postedDate: "2023-05-12",
    skills: ["Content Planning", "SEO", "Analytics", "Copywriting"],
    matchScore: 83,
    description: "Develop content strategies to drive engagement...",
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
