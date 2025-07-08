"use client";
import React, { useState, useEffect } from "react";
import { getRecruiterJobs } from "~/lib/recruiter";
import { Button } from "~/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { JobCard } from "~/components/recruiter/tab-contents/job-card";

interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  type: string;
  postedDate: string;
  description: string;
  status?: string;
  applicantsCount?: number;
  requirements?: JSON | null; // Optional field for job requirements
  deadline?: string; // Add deadline field
}

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get jobs from API
      const jobsData = await getRecruiterJobs();

      // Transform the data to include status and applicants count if not provided
      const enhancedJobs = jobsData.map((job) => ({
        ...job,
        // Provide defaults for fields that might be missing
        status: job.status || "active", // Default to active
        applicantsCount: job.applicantsCount || 0,
        location: job.location || "Remote",
        deadline: job.deadline, // Include deadline from API
        requirements: job.requirements ? JSON.parse(job.requirements) : null, // Parse requirements if it's a JSON string
      }));

      setJobs(enhancedJobs);
    } catch (err) {
      console.error("Failed to fetch recruiter jobs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleRefresh = () => {
    fetchJobs();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <span className="text-muted-foreground">Loading jobs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 border border-dashed border-border rounded-lg bg-muted/20">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-2" />
        <h3 className="text-lg font-medium text-destructive">
          Error loading jobs
        </h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">{error}</p>
        <Button onClick={handleRefresh} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-border rounded-lg bg-muted/20">
        <h3 className="text-lg font-medium">No jobs found</h3>
        <p className="text-muted-foreground mt-2">
          You haven't posted any jobs yet
        </p>
        <Button className="mt-4">Post Your First Job</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">
          Your Job Postings ({jobs.length})
        </h2>
        <Button
          onClick={handleRefresh}
          variant="default"
          size="sm"
          className="gap-2"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Refresh
        </Button>
      </div>

      <div className="grid gap-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
