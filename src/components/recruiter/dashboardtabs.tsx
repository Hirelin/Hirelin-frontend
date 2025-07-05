import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import RecruiterJobs from "./tab-contents/jobs";
import RecruiterApplications from "./tab-contents/applications";

export default function RecruiterDashboardTabs() {
  return (
    <Tabs defaultValue="jobs">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-6 my-auto">
          <TabsTrigger value="jobs">My Jobs</TabsTrigger>
          {/* <TabsTrigger value="overview">Overview</TabsTrigger> */}
          <TabsTrigger value="applicants">Applicants</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="jobs">
        <RecruiterJobs />
      </TabsContent>
      {/* <TabsContent value="overview">
        <RecruiterOverview />
      </TabsContent> */}
      <TabsContent value="applicants">
        <RecruiterApplications />
      </TabsContent>
    </Tabs>
  );
}
