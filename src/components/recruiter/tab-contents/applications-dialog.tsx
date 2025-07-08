"use client";

import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Clock,
  Users,
  Briefcase,
  Eye,
  User,
  Download,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import {
  getJobApplications,
  getApplicationStatusColor,
  getApplicationStatusLabel,
} from "~/lib/recruiter";
import { toast } from "sonner";

interface JobApplication {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: string;
  jobOpeningId: string;
  parsedResume: string | null;
  layoutScore: number;
  contentScore: number;
  skillGap: string | null;
  resumeId: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string;
  };
  resume: {
    id: string;
    url: string;
  } | null;
}

interface ApplicationsDialogProps {
  jobId: string;
  jobTitle: string;
  applicantsCount: number;
  children: React.ReactNode;
}

export function ApplicationsDialog({
  jobId,
  jobTitle,
  applicantsCount,
  children,
}: ApplicationsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedApplications = await getJobApplications(jobId);
      console.log(fetchedApplications);
      setApplications(fetchedApplications);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      setError("Failed to load applications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchApplications();
    }
  };

  const getOverallScore = (layoutScore: number, contentScore: number) => {
    return Math.round((layoutScore + contentScore) / 2);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="mx-4 max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            <span className="truncate">{jobTitle} - Applications</span>
          </DialogTitle>
          <DialogDescription>
            {applications.length} applications for this job posting
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Loading applications...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
              <Button
                variant="outline"
                onClick={fetchApplications}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No applications found for this job</p>
              <p className="text-sm">
                Applications will appear here once candidates apply
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {applications.map((application) => (
                <Card key={application.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {application.user.image ? (
                          <img
                            src={application.user.image}
                            alt={application.user.name || "User"}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-muted-foreground" />
                        )}
                        <div>
                          <span className="font-medium">
                            {application.user.name || "Anonymous User"}
                          </span>
                          <p className="text-sm text-muted-foreground">
                            {application.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(
                              new Date(application.createdAt),
                              { addSuffix: true }
                            )}
                          </span>
                        </div>
                        <span
                          className={getScoreColor(
                            getOverallScore(
                              application.layoutScore,
                              application.contentScore
                            )
                          )}
                        >
                          Score:{" "}
                          {getOverallScore(
                            application.layoutScore,
                            application.contentScore
                          )}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={getApplicationStatusColor(
                          application.status as any
                        )}
                      >
                        {getApplicationStatusLabel(application.status as any)}
                      </Badge>
                      <div className="flex gap-1">
                        {application.resume && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => {
                              window.open(application.resume!.url, "_blank");
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast.info("View details coming soon");
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
