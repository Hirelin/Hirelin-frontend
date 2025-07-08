"use client";
import {
  Calendar,
  Download,
  FileText,
  User,
  Star,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  ChevronDown,
} from "lucide-react";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  getRecruiterApplications,
  type RecruiterApplication,
  JobStatus,
  ApplicationStatus,
  getJobStatusColor,
  getJobStatusLabel,
  getApplicationStatusColor,
  getApplicationStatusLabel,
} from "~/lib/recruiter";

interface ApplicationWithScore extends RecruiterApplication {
  overallScore: number;
}

export default function RecruiterApplication() {
  const [applications, setApplications] = useState<RecruiterApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "date">("score");
  const [filterApplicationStatus, setFilterApplicationStatus] = useState<
    ApplicationStatus[]
  >([]);
  const [filterJobStatus, setFilterJobStatus] = useState<JobStatus[]>([]);

  const PAGE_SIZE = 10;

  const fetchApplications = useCallback(
    async (page = 1, append = false) => {
      try {
        setError(null);
        if (!append) setLoading(true);

        const response = await getRecruiterApplications(
          filterApplicationStatus.length > 0
            ? filterApplicationStatus
            : undefined,
          filterJobStatus.length > 0 ? filterJobStatus : undefined,
          page,
          PAGE_SIZE
        );

        if (append) {
          setApplications((prev) => [...prev, ...response.data]);
        } else {
          setApplications(response.data);
        }

        setCurrentPage(page);
        setTotalPages(Math.ceil(response.total / PAGE_SIZE));
        setHasMore(response.hasMore);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch applications"
        );
      } finally {
        setLoading(false);
      }
    },
    [filterApplicationStatus, filterJobStatus]
  );

  // Memoize expensive calculations
  const processedApplications = useMemo(() => {
    const withScores: ApplicationWithScore[] = applications.map((app) => ({
      ...app,
      overallScore: (app.layoutScore + app.contentScore) / 2,
    }));

    // Sort applications
    return withScores.sort((a, b) => {
      if (sortBy === "score") {
        return b.overallScore - a.overallScore;
      } else {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    });
  }, [applications, sortBy]);

  // Memoize score calculations
  const getScoreColor = useCallback((score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 4) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  }, []);

  const getScoreBarColor = useCallback((score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    if (score >= 4) return "bg-orange-500";
    return "bg-red-500";
  }, []);

  const getScoreBarBg = useCallback((score: number) => {
    if (score >= 8) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 6) return "bg-yellow-100 dark:bg-yellow-900/20";
    if (score >= 4) return "bg-orange-100 dark:bg-orange-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  }, []);

  const getStatusColor = useCallback((status: ApplicationStatus) => {
    return getApplicationStatusColor(status);
  }, []);

  const handleJobStatusToggle = useCallback((status: JobStatus) => {
    setFilterJobStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  }, []);

  const handleApplicationStatusToggle = useCallback(
    (status: ApplicationStatus) => {
      setFilterApplicationStatus((prev) =>
        prev.includes(status)
          ? prev.filter((s) => s !== status)
          : [...prev, status]
      );
    },
    []
  );

  const clearAllFilters = useCallback(() => {
    setFilterJobStatus([]);
    setFilterApplicationStatus([]);
  }, []);

  useEffect(() => {
    fetchApplications(1);
  }, [fetchApplications]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchApplications(currentPage + 1, true);
    }
  }, [currentPage, hasMore, loading, fetchApplications]);

  if (loading) {
    return (
      <div className="space-y-4 px-4 sm:px-0">
        {/* Show filters even when loading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-lg border shadow-sm gap-3 sm:gap-0">
          <div>
            <h2 className="text-xl font-bold text-card-foreground">
              Applications
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Loading applications...
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Job Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8" disabled>
                  <Filter className="h-3 w-3 mr-1" />
                  Job Status
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>

            {/* Application Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8" disabled>
                  <Filter className="h-3 w-3 mr-1" />
                  App Status
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "score" | "date")}
              className="px-3 py-1 border rounded text-sm h-8"
              disabled
            >
              <option value="score">Sort by Score</option>
              <option value="date">Sort by Date</option>
            </select>

            <Button
              onClick={() => fetchApplications(1)}
              variant="outline"
              size="sm"
              className="h-8"
              disabled
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 px-4 sm:px-0">
        {/* Show filters even when error */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-lg border shadow-sm gap-3 sm:gap-0">
          <div>
            <h2 className="text-xl font-bold text-card-foreground">
              Applications
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Error loading applications
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Job Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-3 w-3 mr-1" />
                  Job Status
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Job Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.values(JobStatus).map((status) => (
                  <DropdownMenuItem
                    key={status}
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleJobStatusToggle(status);
                    }}
                  >
                    <Checkbox
                      checked={filterJobStatus.includes(status)}
                      onChange={() => handleJobStatusToggle(status)}
                    />
                    <span className="flex-1">{getJobStatusLabel(status)}</span>
                  </DropdownMenuItem>
                ))}
                {filterJobStatus.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setFilterJobStatus([])}
                      className="text-destructive cursor-pointer"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear Job Status
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Application Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-3 w-3 mr-1" />
                  App Status
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  Filter by Application Status
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.values(ApplicationStatus).map((status) => (
                  <DropdownMenuItem
                    key={status}
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleApplicationStatusToggle(status);
                    }}
                  >
                    <Checkbox
                      checked={filterApplicationStatus.includes(status)}
                      onChange={() => handleApplicationStatusToggle(status)}
                    />
                    <span className="flex-1">
                      {getApplicationStatusLabel(status)}
                    </span>
                  </DropdownMenuItem>
                ))}
                {filterApplicationStatus.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setFilterApplicationStatus([])}
                      className="text-destructive cursor-pointer"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear App Status
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "score" | "date")}
              className="px-3 py-1 border rounded text-sm h-8"
            >
              <option value="score">Sort by Score</option>
              <option value="date">Sort by Date</option>
            </select>

            <Button
              onClick={() => fetchApplications(1)}
              variant="outline"
              size="sm"
              className="h-8"
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="text-center py-12 px-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 sm:p-6 max-w-md mx-auto">
            <p className="text-destructive mb-4 font-medium text-sm sm:text-base">
              {error}
            </p>
            <Button
              onClick={() => fetchApplications()}
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/5 w-full sm:w-auto"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Always render the filter controls first
  const filterControls = (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-lg border shadow-sm gap-3 sm:gap-0">
      <div>
        <h2 className="text-xl font-bold text-card-foreground">Applications</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {processedApplications.length} applications loaded
          {(filterJobStatus.length > 0 ||
            filterApplicationStatus.length > 0) && (
            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              Filtered
            </span>
          )}
        </p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {/* Job Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-3 w-3 mr-1" />
              Job Status
              {filterJobStatus.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  {filterJobStatus.length}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filter by Job Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.values(JobStatus).map((status) => (
              <DropdownMenuItem
                key={status}
                className="flex items-center space-x-2 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handleJobStatusToggle(status);
                }}
              >
                <Checkbox
                  checked={filterJobStatus.includes(status)}
                  onChange={() => handleJobStatusToggle(status)}
                />
                <span className="flex-1">{getJobStatusLabel(status)}</span>
              </DropdownMenuItem>
            ))}
            {filterJobStatus.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setFilterJobStatus([])}
                  className="text-destructive cursor-pointer"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Job Status
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Application Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-3 w-3 mr-1" />
              App Status
              {filterApplicationStatus.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  {filterApplicationStatus.length}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filter by Application Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.values(ApplicationStatus).map((status) => (
              <DropdownMenuItem
                key={status}
                className="flex items-center space-x-2 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handleApplicationStatusToggle(status);
                }}
              >
                <Checkbox
                  checked={filterApplicationStatus.includes(status)}
                  onChange={() => handleApplicationStatusToggle(status)}
                />
                <span className="flex-1">
                  {getApplicationStatusLabel(status)}
                </span>
              </DropdownMenuItem>
            ))}
            {filterApplicationStatus.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setFilterApplicationStatus([])}
                  className="text-destructive cursor-pointer"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear App Status
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "score" | "date")}
          className="px-3 py-1 border rounded text-sm h-8"
        >
          <option value="score">Sort by Score</option>
          <option value="date">Sort by Date</option>
        </select>

        {(filterJobStatus.length > 0 || filterApplicationStatus.length > 0) && (
          <Button
            onClick={clearAllFilters}
            variant="ghost"
            size="sm"
            className="h-8 text-destructive hover:text-destructive"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}

        <Button
          onClick={() => fetchApplications(1)}
          variant="outline"
          size="sm"
          className="h-8"
        >
          Refresh
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 px-4 sm:px-0">
      {filterControls}

      {processedApplications.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="bg-muted/50 border rounded-lg p-6 sm:p-8 w-full mx-auto">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground mb-4 text-lg">
              No applications found
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              {filterJobStatus.length > 0 || filterApplicationStatus.length > 0
                ? "Try adjusting your filters to see more applications."
                : "Applications will appear here once candidates apply to your job postings."}
            </p>
            <Button
              onClick={() => fetchApplications()}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Refresh
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-3">
            {processedApplications.map((application) => (
              <Card
                key={application.id}
                className="hover:shadow-lg transition-all duration-200 border bg-card p-3"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 ring-2 ring-border flex-shrink-0">
                      <AvatarImage
                        src={
                          application.user.image ?? "/image/profile-default.jpg"
                        }
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
                          className={`capitalize text-xs px-2 py-0.5 ${getApplicationStatusColor(
                            application.status
                          )}`}
                        >
                          {getApplicationStatusLabel(application.status)}
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
                          <Badge
                            className={`ml-1 text-xs px-1 py-0.5 ${getJobStatusColor(
                              application.jobOpening.status
                            )}`}
                          >
                            {getJobStatusLabel(application.jobOpening.status)}
                          </Badge>
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
                                width: `${
                                  (application.layoutScore / 10) * 100
                                }%`,
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
                                width: `${
                                  (application.contentScore / 10) * 100
                                }%`,
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
                              application.overallScore
                            )}`}
                          >
                            {application.overallScore.toFixed(1)}/10
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
                      {/* {application.status === "pending" && (
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
                  )} */}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? "Loading..." : "Load More Applications"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
