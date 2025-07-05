"use client";
import React, { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { JOB_TYPE_LABELS } from "~/types/jobs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { toast } from "sonner";
import { env } from "~/env";
import ReactMarkdown from "react-markdown";

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
}

interface JobCardProps {
  job: Job;
}

enum JobStatus {
  upcoming = "upcoming",
  open = "open",
  closed = "closed",
  cancelled = "cancelled",
  completed = "completed",
}

export function JobCard({ job }: JobCardProps) {
  const [selected, setSelected] = useState<string>(job.status ?? "upcoming");
  const [open, setOpen] = useState(false);

  return (
    <Card className="hover:bg-accent/5 transition-colors">
      <CardContent className="p-4 pt-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg">{job.title}</h3>
          <Badge
            variant={job.status === "open" ? "default" : "outline"}
            className="ml-2"
          >
            {job.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 mt-2">
          <div>
            <p className="text-sm text-muted-foreground">Company</p>
            <p className="font-medium">{job.company}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="font-medium">
              {JOB_TYPE_LABELS[job.type] || job.type}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">{job.location || "Remote"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Posted Date</p>
            <p className="font-medium">
              {new Date(job.postedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-sm text-muted-foreground mb-1">Description</p>
          <p className="text-sm line-clamp-1">{job.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 justify-end">
          {/* <Button variant="outline" size="sm" className="gap-1">
            View Applicants ({job.applicantsCount || 0})
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            Edit Job
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <ExternalLink className="h-4 w-4" />
            View Listing
          </Button> */}

          {job.requirements && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"outline"}>View requirements</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Requirements</DialogTitle>
                  <DialogDescription>
                    <div className="bg-muted p-4 rounded-md max-h-[50vh] overflow-y-auto border text-sm">
                      <pre className="whitespace-pre-wrap break-words font-mono">
                        {JSON.stringify(job.requirements, null, 2)}
                      </pre>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant={"secondary"}>Change status</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Change application status</DialogHeader>
              <div className="w-full">
                <RadioGroup
                  defaultValue={job.status ?? "upcoming"}
                  onValueChange={(value: string) => setSelected(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={JobStatus.cancelled}
                      id={JobStatus.cancelled}
                    />
                    <Label htmlFor={JobStatus.cancelled}>
                      {JobStatus.cancelled}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={JobStatus.closed}
                      id={JobStatus.closed}
                    />
                    <Label htmlFor={JobStatus.closed}>{JobStatus.closed}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={JobStatus.completed}
                      id={JobStatus.completed}
                    />
                    <Label htmlFor={JobStatus.completed}>
                      {JobStatus.completed}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={JobStatus.open}
                      id={JobStatus.open}
                    />
                    <Label htmlFor={JobStatus.open}>{JobStatus.open}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={JobStatus.upcoming}
                      id={JobStatus.upcoming}
                    />
                    <Label htmlFor={JobStatus.upcoming}>
                      {JobStatus.upcoming}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="w-full flex justify-end">
                <Button
                  onClick={async () => {
                    const res = await fetch(
                      `${env.NEXT_PUBLIC_SERVER_URL}/api/jobs/update-job-status`,
                      {
                        method: "POST",
                        credentials: "include",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          jobId: job.id,
                          status: selected,
                        }),
                      }
                    );

                    if (res.status !== 200) {
                      toast.error("Failed to update Job status");
                      return;
                    }

                    toast.success("Job status updated");
                    setOpen(false);
                  }}
                >
                  save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
