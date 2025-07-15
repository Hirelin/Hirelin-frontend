import React from "react";
import LearningPlansList from "~/components/profile/LearningPlansList";
import { getApplicationPlans } from "~/lib/user";

export default async function LearningPlan({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const response = await getApplicationPlans(applicationId);

  if (response.status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-destructive mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground mb-4">
            You must be logged in to view this page.
          </p>
        </div>
      </div>
    );
  }

  if (response.status === "error" || !response.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Error</h1>
          <p className="text-muted-foreground">
            Failed to load application plans.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen py-32">
      <div className="container mx-auto px-4 py-8">
        <LearningPlansList applications={[response.data]} />
      </div>
    </section>
  );
}
