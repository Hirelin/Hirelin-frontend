import React from "react";
import { env } from "~/env";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { MapPin, Building, Clock, FileText } from "lucide-react";
import JobActions from "./job-actions";

type JobData = {
  id: string;
  title: string;
  address: string;
  company: string;
  description: string;
  location: string;
  type: string;
  status: string;
};

export default async function JobDetails({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const jobId = (await params).jobId;
  const jobDetails = await fetch(
    `${env.SERVER_URL}/api/jobs/job-details?id=${jobId}`,
    { method: "GET" }
  );

  if (jobDetails.status === 404) {
    return (
      <section>
        <div className="container">
          <p className="text-center text-gray-500 text-lg">
            Sorry, the job you are looking for was not found.
          </p>
        </div>
      </section>
    );
  } else if (jobDetails.status !== 200) {
    return (
      <section className="min-h-screen flex items-center justify-center w-screen">
        <div className="container">
          <p className="text-center text-red-500 text-lg">
            Sorry, we couldn't load the job details. Please check the job ID or
            try again later.
          </p>
        </div>
      </section>
    );
  }

  const jobData = (await jobDetails.json()).data as JobData;

  return (
    <section className="min-h-screen w-full flex justify-center py-32 px-4">
      <div className="container max-w-4xl">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">{jobData.title}</h1>
            <div className="flex items-center justify-center gap-2">
              <Building className="w-4 h-4" />
              <span className="text-lg">{jobData.company}</span>
            </div>
          </div>

          {/* Main Job Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-xl">Job Details</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {jobData.type}
                  </Badge>
                  <Badge
                    variant={
                      jobData.status === "active" ? "default" : "outline"
                    }
                    className="capitalize"
                  >
                    {jobData.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">Location</span>
                  </div>
                  <p className="pl-6">{jobData.location}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span className="font-medium">Address</span>
                  </div>
                  <p className="pl-6">{jobData.address}</p>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium text-lg">Description</span>
                </div>
                <Card className="">
                  <CardContent className="pt-4">
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {jobData.description}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <JobActions jobId={jobData.id} />
            </CardContent>
          </Card>

          {/* Additional Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm">Job Type</p>
                  <p className="font-medium capitalize">{jobData.type}</p>
                </div>
                <div className="text-center p-4 rounded-lg">
                  <Building className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm">Company</p>
                  <p className="font-medium">{jobData.company}</p>
                </div>
                <div className="text-center p-4 rounded-lg">
                  <MapPin className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm">Status</p>
                  <p className="font-medium capitalize">{jobData.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
