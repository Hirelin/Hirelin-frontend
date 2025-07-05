import React from "react";
import Link from "next/link";

import { PlusCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import RecruiterProfile from "~/components/recruiter/profile";
import RecruiterStats from "~/components/recruiter/stats";
import RecruiterDashboardTabs from "~/components/recruiter/dashboardtabs";

export default function HrProfile() {
  return (
    <section className="w-full pt-40">
      <div className="container mx-auto py-8 px-4 flex flex-col gap-8">
        <div className="w-full flex md:flex-row flex-col justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your HR profile and job postings
            </p>
          </div>

          <Link href={"/recruiter/create"} className="flex items-center">
            <Button className="bg-brand font-semibold w-fit">
              <PlusCircle />
              Post New Job
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <RecruiterProfile />
          <RecruiterStats />
        </div>
        <RecruiterDashboardTabs />
      </div>
    </section>
  );
}
