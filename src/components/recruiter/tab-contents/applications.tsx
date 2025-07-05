"use client";
import {
  Calendar,
  Download,
  FileText,
  User,
  Star,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  getRecruiterApplications,
  type RecruiterApplication,
} from "~/lib/recruiter";

export default function RecruiterApplication() {
  const [applications, setApplications] = useState<RecruiterApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setError(null);
      setLoading(true);

      const applicationsData = await getRecruiterApplications();
      setApplications(applicationsData);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 4) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    if (score >= 4) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreBarBg = (score: number) => {
    if (score >= 8) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 6) return "bg-yellow-100 dark:bg-yellow-900/20";
    if (score >= 4) return "bg-orange-100 dark:bg-orange-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 px-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
          <p className="text-destructive mb-4 font-medium text-sm sm:text-base">
            {error}
          </p>
          <Button
            onClick={fetchApplications}
            variant="outline"
            className="border-destructive/30 text-destructive hover:bg-destructive/5 w-full sm:w-auto"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="bg-muted/50 border rounded-lg p-6 sm:p-8 max-w-md mx-auto">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground mb-4 text-lg">No applications found</p>
          <p className="text-muted-foreground text-sm mb-6">
            Applications will appear here once candidates apply to your job
            postings.
          </p>
          <Button
            onClick={fetchApplications}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-lg border shadow-sm gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl font-bold text-card-foreground">
            Applications
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {applications.length}{" "}
            {applications.length === 1 ? "application" : "applications"}{" "}
            received
          </p>
        </div>
        <Button
          onClick={fetchApplications}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
        >
          Refresh
        </Button>
      </div>

      <div className="grid gap-3">
        {applications.map((application) => (
          <Card
            key={application.id}
            className="hover:shadow-lg transition-all duration-200 border bg-card p-3"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="h-10 w-10 ring-2 ring-border flex-shrink-0">
                  <AvatarImage
                    src={application.user.image ?? "/image/profile-default.jpg"}
                    alt={application.user.name}
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-card-foreground">
                      {application.user.name}
                    </h3>
                    <Badge
                      className={`capitalize text-xs px-2 py-0.5 ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 sm:mb-1">
                    {application.user.email}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span className="truncate">
                        {application.jobOpening.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(application.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-2 md:flex-shrink-0">
                <div className="bg-muted/50 border rounded-lg p-2 w-full sm:w-auto min-w-[160px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Analysis
                    </span>
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  </div>

                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Layout
                        </span>
                        <span
                          className={`text-xs font-bold ${getScoreColor(
                            application.layoutScore
                          )}`}
                        >
                          {application.layoutScore}/10
                        </span>
                      </div>
                      <div
                        className={`h-1 rounded-full ${getScoreBarBg(
                          application.layoutScore
                        )}`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(
                            application.layoutScore
                          )}`}
                          style={{
                            width: `${(application.layoutScore / 10) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Content
                        </span>
                        <span
                          className={`text-xs font-bold ${getScoreColor(
                            application.contentScore
                          )}`}
                        >
                          {application.contentScore}/10
                        </span>
                      </div>
                      <div
                        className={`h-1 rounded-full ${getScoreBarBg(
                          application.contentScore
                        )}`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(
                            application.contentScore
                          )}`}
                          style={{
                            width: `${(application.contentScore / 10) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Overall
                      </span>
                      <span
                        className={`text-xs font-bold ${getScoreColor(
                          Math.round(
                            (application.layoutScore +
                              application.contentScore) /
                              2
                          )
                        )}`}
                      >
                        {(
                          (application.layoutScore + application.contentScore) /
                          2
                        ).toFixed(1)}
                        /10
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(application.resume.url, "_blank")
                    }
                    className="h-8 px-3 flex-1 md:flex-none"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Resume</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                  {application.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 px-3 flex-1 md:flex-none"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 px-3 flex-1 md:flex-none"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
