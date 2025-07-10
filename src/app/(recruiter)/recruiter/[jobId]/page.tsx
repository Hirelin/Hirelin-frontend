import React from "react";
import EditableComponent from "~/components/recruiter/jobdetails/editable";
import RefreshButton from "~/components/recruiter/jobdetails/refresh";
import QuickStats from "~/components/recruiter/jobdetails/stats";
import { getJobDetailsById } from "~/server/recruiter";

export default async function page({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const jobId = (await params).jobId;
  const jobDetails = await getJobDetailsById(jobId);

  if (jobDetails === null) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center">
        <div className="shadow-md rounded-lg p-8 flex flex-col items-center">
          <svg
            className="w-12 h-12 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 9l6 6m0-6l-6 6"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2">
            Failed to Fetch Job Details
          </h2>
          <p className="text-muted-foreground mb-4 text-center">
            We couldn't retrieve the job details. Please check your connection
            or try again later.
          </p>
          <RefreshButton />
        </div>
      </section>
    );
  }
  return (
    <section className="w-screen min-h-screen py-32">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <EditableComponent job={jobDetails} />
          <QuickStats job={jobDetails} />
        </div>
      </div>
    </section>
  );
}
