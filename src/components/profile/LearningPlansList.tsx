import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import {
  BookOpen,
  TrendingUp,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
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

interface LearningPlansListProps {
  applications: Application[];
}

export default function LearningPlansList({
  applications,
}: LearningPlansListProps) {
  const applicationsWithPlans = applications.filter((app) => app.learningPlan);

  // Group learning plans by status
  const activePlans = applicationsWithPlans.filter(
    (app) => app.status === "training" || app.status === "accepted"
  );

  const completedPlans = applicationsWithPlans.filter(
    (app) => app.status === "hired"
  );

  const pendingPlans = applicationsWithPlans.filter(
    (app) => app.status === "pending"
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "training":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "accepted":
        return <Target className="h-4 w-4 text-green-500" />;
      case "hired":
        return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "training":
        return "In Progress";
      case "accepted":
        return "Ready to Start";
      case "hired":
        return "Completed";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const calculateProgress = (app: Application) => {
    // Mock progress calculation - in real app, this would come from API
    if (app.status === "hired") return 100;
    if (app.status === "training") return 65;
    if (app.status === "accepted") return 10;
    return 0;
  };

  if (applicationsWithPlans.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="bg-muted/50">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Learning Plans</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No learning plans available yet.</p>
            <p className="text-sm mt-2">
              Learning plans will be generated after your job applications are
              reviewed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderLearningPlanCard = (app: Application) => (
    <Card key={app.id} className="shadow-lg" id={`learning-plan-${app.id}`}>
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {app.jobOpening.title} at {app.jobOpening.company}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getStatusIcon(app.status)}
            <Badge variant="outline" className="gap-1">
              {getStatusLabel(app.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{calculateProgress(app)}%</span>
          </div>
          <Progress value={calculateProgress(app)} className="h-2" />
        </div>

        {/* Plan Details */}
        <div className="bg-muted/50 border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Plan Details</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {app.learningPlan!.planDetails}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Created:{" "}
            {new Date(app.learningPlan!.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Assessment Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <p className="font-medium text-foreground">Assessment</p>
          </div>

          <div className="border rounded-lg p-4 bg-card shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground">
                    {app.learningPlan!.assessments.title}
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {app.learningPlan!._count.assesments} questions
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {app.learningPlan!.assessments.description}
                </p>

                {/* Assessment Status */}
                {app.status === "hired" && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Assessment Completed
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-4">
                {app.status === "hired" ? (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Completed
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() =>
                      alert(
                        `Redirect to ${app.learningPlan!.assessments.title}`
                      )
                    }
                    className="gap-2"
                    disabled={app.status === "pending"}
                  >
                    <Award className="h-3 w-3" />
                    {app.status === "pending" ? "Pending" : "Start Assessment"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">
            Learning Plans ({applicationsWithPlans.length})
          </h2>
        </div>
        <Badge variant="outline" className="gap-2">
          <TrendingUp className="h-3 w-3" />
          {activePlans.length} Active
        </Badge>
      </div>

      {/* Active Plans */}
      {activePlans.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Active Learning Plans ({activePlans.length})
          </h3>
          {activePlans.map(renderLearningPlanCard)}
        </div>
      )}

      {/* Pending Plans */}
      {pendingPlans.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Pending Plans ({pendingPlans.length})
          </h3>
          {pendingPlans.map(renderLearningPlanCard)}
        </div>
      )}

      {/* Completed Plans */}
      {completedPlans.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-purple-500" />
            Completed Plans ({completedPlans.length})
          </h3>
          {completedPlans.map(renderLearningPlanCard)}
        </div>
      )}
    </div>
  );
}
