import React from "react";
import CreateJobForm from "~/components/forms/createJobForm";

export default function CreateJob() {
  return (
    <section className="w-full flex justify-center py-40 px-4">
      <div className="container">
        <div>
          <h1 className="text-3xl font-semibold">Create Job Opening</h1>
          <p className="text-muted-foreground">
            Create a job Opening for recruiting candidates
          </p>
        </div>
        <CreateJobForm />
      </div>
    </section>
  );
}
