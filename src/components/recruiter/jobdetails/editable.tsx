"use client";
import React, { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Card, CardHeader } from "~/components/ui/card";
import { getJobStatusColor, JobStatus } from "~/lib/recruiter";
import { getStatusIcon } from "./stats";
import { JobOpening } from "~/server/recruiter";
import { Building2, Edit3, MapPin, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import DataForm from "./dataForm";

export default function EditableComponent({ job }: { job: JobOpening }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="lg:col-span-2 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{job.title}</h1>
                <Badge className={getJobStatusColor(job.status as JobStatus)}>
                  {getStatusIcon(job.status as string)}
                  <span className="ml-1 capitalize">{job.status}</span>
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span>{job.company}</span>
                </div>
                {job.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                )}
                <Badge variant="outline">
                  {/* {jobTypeOptions.find((opt) => opt.api === job.type)?.label ||
                    job.type} */}
                  {job.type}
                </Badge>
              </div>
            </div>
            <Button
              variant={isEditing ? "destructive" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>
      <DataForm job={job} editing={isEditing} setEditing={setIsEditing} />
    </div>
  );
}
