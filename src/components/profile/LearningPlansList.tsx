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
import type { Applications } from "~/lib/user";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import Link from "next/link";

interface LearningPlansListProps {
  applications: Applications[];
}

export default function LearningPlansList({
  applications,
}: LearningPlansListProps) {
  const applicationsWithPlans = applications.filter(
    (app) => Array.isArray(app.learningPlan) && app.learningPlan.length > 0
  );

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

  applications.forEach((app) => {
    if (Array.isArray(app.learningPlan)) {
      app.learningPlan.forEach((plan) => {
        if (Array.isArray(plan.assessments)) {
          plan.assessments.sort((a, b) => Number(a.title) - Number(b.title));
        }
      });
    }
  });
  // // Sort assessments by title (as number) for all learning plans of all applications
  // React.useEffect(() => {
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [applications]);

  // const calculateProgress = (app: Applications) => {
  //   // Mock progress calculation - in real app, this would come from API
  //   if (app.status === "hired") return 100;
  //   if (app.status === "training") return 65;
  //   if (app.status === "accepted") return 10;
  //   return 0;
  // };

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

  const renderLearningPlanCard = (app: Applications) => {
    const plan = app.learningPlan[0];
    const totalDays =
      Array.isArray(plan?.planDetails) && plan.planDetails.length > 0
        ? plan.planDetails.length
        : 0;
    const completedDays = plan?.completed_plans ?? 0;
    const progressPercent =
      totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    return (
      <Card key={app.id} className="shadow-lg" id={`learning-plan-${app.id}`}>
        <CardHeader className="bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">
                {app.jobOpening.title} at {app.jobOpening.company}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(app.status)}
              <Badge variant="outline" className="gap-1">
                {getStatusLabel(app.status)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 space-y-5">
          {/* Plan Progress */}
          {plan && totalDays > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">
                  {completedDays} of {totalDays} days completed
                </span>
                {completedDays === totalDays && totalDays > 0 && (
                  <Badge
                    className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    variant="secondary"
                  >
                    Completed
                  </Badge>
                )}
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}

          {/* Plan Details */}
          {plan && (
            <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
              {/* <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">
                  Plan Details
                </span>
              </div> */}
              <>
                {Array.isArray(plan.planDetails) &&
                plan.planDetails.length > 0 ? (
                  <Accordion type="multiple" className="w-full">
                    {plan.planDetails.map((detail, idx) => (
                      <AccordionItem value={`day-${detail.day}`} key={idx}>
                        <AccordionTrigger>
                          <span className="font-semibold text-primary">
                            Day {detail.day}: {detail.title}
                          </span>
                          {/* Show checkmark if this day is completed */}
                          {idx < completedDays && (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                          )}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {/* Learning Objectives */}
                            {detail.learning_objectives?.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold text-primary">
                                    Objectives
                                  </span>
                                </div>
                                <ul className="list-disc list-inside text-xs ml-4 text-muted-foreground">
                                  {detail.learning_objectives.map((obj, i) => (
                                    <li key={i}>{obj}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Topics */}
                            {detail.topics?.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold text-primary">
                                    Topics
                                  </span>
                                </div>
                                <ul className="list-disc list-inside text-xs ml-4 text-muted-foreground">
                                  {detail.topics.map((topic, i) => (
                                    <li key={i}>{topic}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Resources */}
                            {detail.resources?.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-semibold text-primary">
                                    Resources
                                  </span>
                                </div>
                                <ul className="list-disc list-inside text-xs ml-4 text-muted-foreground">
                                  {detail.resources.map((res, i) => (
                                    <li key={i}>
                                      <span className="font-semibold">
                                        {res.type}:
                                      </span>{" "}
                                      <span>{res.title}</span>
                                      {res.estimated_time && (
                                        <span className="ml-2 text-muted-foreground">
                                          ({res.estimated_time})
                                        </span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          {plan.assessments.length > idx &&
                            plan.assessments[idx] && (
                              <div className="py-4 w-full flex justify-end">
                                {plan.assessments[idx].score > 0 ? (
                                  <Button variant={"outline"}>
                                    {plan.assessments[idx].score}
                                  </Button>
                                ) : (
                                  <Link
                                    href={`/profile/${app.id}/${plan.assessments[idx].id}`}
                                  >
                                    <Button>Take test</Button>
                                  </Link>
                                )}
                              </div>
                            )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No plan details available.
                  </p>
                )}
              </>
              <p className="text-xs text-muted-foreground mt-2">
                Created:{" "}
                {plan.createdAt
                  ? new Date(plan.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </div>
          )}

          {/* Assessment Section */}
          {/* {plan &&
            Array.isArray(plan.assessments) &&
            plan.assessments.length > 0 && (
              <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">
                    Assessments
                  </span>
                </div>
                {plan.assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="border rounded-lg p-4 bg-card shadow-sm mb-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">
                            {assessment.title}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            Assessment
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {assessment.description}
                        </p>
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
                            className="gap-2"
                            disabled={app.status === "pending"}
                          >
                            <Award className="h-3 w-3" />
                            {app.status === "pending"
                              ? "Pending"
                              : "Start Assessment"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )} */}
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">
              Learning Plans ({applicationsWithPlans.length})
            </CardTitle>
          </div>
          <Badge variant="outline" className="gap-2">
            <TrendingUp className="h-3 w-3" />
            {activePlans.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
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
      </CardContent>
    </Card>
  );
}
