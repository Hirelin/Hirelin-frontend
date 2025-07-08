"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Briefcase,
  BookOpen,
  ExternalLink,
  Calendar,
  TrendingUp,
} from "lucide-react";

interface Application {
  id: string;
  status: "pending" | "rejected" | "accepted" | "training" | "hired";
  layoutScore: number;
  contentScore: number;
  jobOpening: {
    id: string;
    title: string;
    company: string;
  };
  learningPlan: {
    id: string;
    planDetails: string;
    createdAt: Date;
    _count: {
      assesments: number;
    };
    assessments: {
      id: string;
      title: string;
      description: string;
    };
  } | null;
}

interface ApplicationsListProps {
  applications: Application[];
}

export default function ApplicationsList({
  applications,
}: ApplicationsListProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 4) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "training":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "hired":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleViewLearningPlan = (applicationId: string) => {
    // Scroll to learning plan section
    const element = document.getElementById(`learning-plan-${applicationId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">
              Job Applications ({applications.length})
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Browse jobs functionality coming soon!")}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Browse Jobs
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {applications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No applications yet.</p>
            <Button
              className="mt-4"
              onClick={() => alert("Browse jobs functionality coming soon!")}
            >
              Start Applying
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Job Title</TableHead>
                  <TableHead className="font-semibold">Company</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">
                    Layout Score
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Content Score
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Overall
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Learning Plan
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {app.jobOpening.title}
                    </TableCell>
                    <TableCell>{app.jobOpening.company}</TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize ${getStatusColor(app.status)}`}
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`font-bold ${getScoreColor(
                          app.layoutScore
                        )}`}
                      >
                        {app.layoutScore}/10
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`font-bold ${getScoreColor(
                          app.contentScore
                        )}`}
                      >
                        {app.contentScore}/10
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`font-bold ${getScoreColor(
                          (app.layoutScore + app.contentScore) / 2
                        )}`}
                      >
                        {((app.layoutScore + app.contentScore) / 2).toFixed(1)}
                        /10
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {app.learningPlan ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewLearningPlan(app.id)}
                          className="gap-1"
                        >
                          <BookOpen className="h-3 w-3" />
                          View Plan
                        </Button>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Not Available
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
