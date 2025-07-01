import React from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowRight, Briefcase, UserPlus } from "lucide-react";

export default function Start() {
  return (
    <section
      className="container mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8 h-[70vh] flex justify-center flex-col"
      id="get-started"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Whether you're looking for your next career opportunity or seeking top
          talent for your team, Hirelin has the tools you need to succeed.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Job Seekers Card */}
        <div className="relative group">
          <div className="rounded-lg border border-border bg-background p-6 transition-all duration-200 hover:shadow-md">
            <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Job Seekers</h3>
            <p className="text-muted-foreground mb-6">
              Discover opportunities that match your skills and ambitions. Get
              personalized feedback and prepare for your ideal role.
            </p>
            <Link href="/jobs" passHref>
              <Button className="w-full group-hover:bg-primary/90 transition-colors">
                Browse Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* HR Teams Card */}
        <div className="relative group">
          <div className="rounded-lg border border-border bg-background p-6 transition-all duration-200 hover:shadow-md">
            <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
              <UserPlus className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">HR Teams</h3>
            <p className="text-muted-foreground mb-6">
              Post open positions and connect with qualified candidates. Our
              AI-powered platform helps you find the perfect match.
            </p>
            <Link href="/recruiter/create" passHref>
              <Button className="w-full group-hover:bg-primary/90 transition-colors">
                Post a Job
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* <div className="text-center mt-12">
        <p className="text-sm text-muted-foreground">
          Not sure where to start?{" "}
          <Link href="/help" className="text-primary hover:underline">
            Learn more about how Hirelin works
          </Link>
        </p>
      </div> */}
    </section>
  );
}
