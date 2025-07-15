import React from "react";
import { getAssessment } from "~/lib/user";
import AssessmentComponent from "./assessment";

export default async function Assessment({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const assessmentId = (await params).assessmentId;
  const result = await getAssessment(assessmentId);

  if (result.status === "unauthenticated") {
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

  if (result.status === "error" || !result.data) {
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
        <AssessmentComponent assessment={result.data} />
      </div>
    </section>
  );
}
