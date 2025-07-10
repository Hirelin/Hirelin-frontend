import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { type JobOpening } from "~/server/recruiter";
import Image from "next/image";
import { AlertCircle, CheckCircle, Clock, Mail, User, X } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { getJobStatusColor, JobStatus } from "~/lib/recruiter";

export default function QuickStats({ job }: { job: JobOpening }) {
  return (
    <div className="space-y-6">
      {/* Recruiter Info */}
      {job.recruiter && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recruiter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              {job.recruiter.user?.image ? (
                <Image
                  src={job.recruiter.user.image || "/placeholder.svg"}
                  alt={job.recruiter.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium">{job.recruiter.name}</p>
                <p className="text-sm text-muted-foreground">
                  {job.recruiter.position}
                </p>
                <p className="text-sm text-muted-foreground">
                  {job.recruiter.organization}
                </p>
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{job.recruiter.user?.email}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Applications</span>
            <Badge variant="secondary">{job.applications?.length || 0}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge className={getJobStatusColor(job.status as JobStatus)}>
              {getStatusIcon(job.status)}
              <span className="ml-1 capitalize">{job.status}</span>
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="text-sm">
              {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Updated</span>
            <span className="text-sm">
              {new Date(job.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "open":
      return <CheckCircle className="h-3 w-3" />;
    case "closed":
      return <X className="h-3 w-3" />;
    case "upcoming":
      return <Clock className="h-3 w-3" />;
    case "archived":
      return <AlertCircle className="h-3 w-3" />;
    default:
      return <AlertCircle className="h-3 w-3" />;
  }
}
