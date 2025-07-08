"use client";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  MapPin,
  Clock,
  Users,
  CalendarClock,
  Briefcase,
  Eye,
  Settings,
  FileText,
} from "lucide-react";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { useState } from "react";
import { updateJobStatus } from "~/lib/recruiter";
import { toast } from "sonner";
import { ApplicationsDialog } from "./applications-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

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
  requirements?: JSON | null;
  deadline?: string;
}

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const [currentStatus, setCurrentStatus] = useState(job.status || "upcoming");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isRequirementsOpen, setIsRequirementsOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "upcoming":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "open":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "closed":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "cancelled":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
      case "completed":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "fulltime":
      case "full-time":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "parttime":
      case "part-time":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "contract":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      case "internship":
        return "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const success = await updateJobStatus(job.id, pendingStatus);

      if (success) {
        setCurrentStatus(pendingStatus);
        setIsStatusDialogOpen(false);
        toast.success(`Job status updated to ${pendingStatus}`);
      } else {
        toast.error("Failed to update job status");
      }
    } catch (error) {
      console.error("Failed to update job status:", error);
      toast.error("Failed to update job status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const isDeadlinePassed = job.deadline
    ? isAfter(new Date(), new Date(job.deadline))
    : false;
  const isDeadlineSoon = job.deadline
    ? isBefore(
        new Date(job.deadline),
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      )
    : false;

  const getOverallScore = (layoutScore: number, contentScore: number) => {
    return Math.round((layoutScore + contentScore) / 2);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg text-foreground">
                {job.title}
              </h3>
              <Badge className={getStatusColor(currentStatus)}>
                {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location || "Remote"}</span>
              </div>
              <Badge variant="outline" className={getTypeColor(job.type)}>
                {job.type.replace(/([A-Z])/g, " $1").trim()}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Dialog
              open={isStatusDialogOpen}
              onOpenChange={setIsStatusDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 flex-1 sm:flex-initial"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Update Status</span>
                  <span className="sm:hidden">Status</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 max-w-md">
                <DialogHeader>
                  <DialogTitle>Update Job Status</DialogTitle>
                  <DialogDescription>
                    Change the status of "{job.title}" job posting
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Current Status
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {currentStatus.charAt(0).toUpperCase() +
                        currentStatus.slice(1)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Status</label>
                    <Select
                      value={pendingStatus}
                      onValueChange={setPendingStatus}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPendingStatus(currentStatus);
                      setIsStatusDialogOpen(false);
                    }}
                    disabled={isUpdating}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating || pendingStatus === currentStatus}
                    className="w-full sm:w-auto"
                  >
                    {isUpdating ? "Updating..." : "Update Status"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Job Description Preview */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>

          {/* Job Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{job.applicantsCount || 0} applicants</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Posted{" "}
                {formatDistanceToNow(new Date(job.postedDate), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          {/* Deadline Section */}
          {job.deadline && (
            <div
              className={`flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded-lg ${
                isDeadlinePassed
                  ? "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
                  : isDeadlineSoon
                  ? "bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                  : "bg-muted/50 border border-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <CalendarClock
                  className={`h-4 w-4 ${
                    isDeadlinePassed
                      ? "text-red-600 dark:text-red-400"
                      : isDeadlineSoon
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isDeadlinePassed
                      ? "text-red-600 dark:text-red-400"
                      : isDeadlineSoon
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {isDeadlinePassed ? "Deadline passed" : "Deadline"}:{" "}
                  {format(new Date(job.deadline), "PPP")}
                </span>
              </div>
              {isDeadlineSoon && !isDeadlinePassed && (
                <Badge
                  variant="outline"
                  className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 self-start sm:self-center"
                >
                  Ends soon
                </Badge>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <ApplicationsDialog
                jobId={job.id}
                jobTitle={job.title}
                applicantsCount={job.applicantsCount || 0}
              >
                <Button
                  variant="outline"
                  className="flex-1 gap-2 w-full sm:w-auto"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    View Applications ({job.applicantsCount || 0})
                  </span>
                  <span className="sm:hidden">
                    Applications ({job.applicantsCount || 0})
                  </span>
                </Button>
              </ApplicationsDialog>

              {job.requirements && (
                <Dialog
                  open={isRequirementsOpen}
                  onOpenChange={setIsRequirementsOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 w-full sm:w-auto"
                    >
                      <FileText className="h-4 w-4" />
                      Requirements
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="mx-4 max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Job Requirements
                      </DialogTitle>
                      <DialogDescription>
                        Detailed requirements for "{job.title}" position
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-muted/50 border rounded-lg p-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-foreground">
                            Requirements Details
                          </h4>
                          <div className="bg-background border rounded p-3 max-h-96 overflow-y-auto">
                            <pre className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                              {JSON.stringify(job.requirements, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
