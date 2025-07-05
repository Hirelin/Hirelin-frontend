"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Briefcase,
  Mail,
  Phone,
  Building,
  PlusCircle,
  Calendar,
  Users,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";

// Mock data - replace with actual data fetching
const mockRecruiterData = {
  id: "rec-123",
  name: "Jane Smith",
  email: "jane.smith@company.com",
  phone: "+1 (555) 123-4567",
  company: "Tech Innovations Inc.",
  position: "Senior HR Manager",
  avatar: "/images/avatars/jane-smith.jpg", // Replace with actual path or use fallback
  joinDate: "January 2023",
  stats: {
    activeJobs: 8,
    totalApplications: 126,
    interviewed: 42,
    hired: 12,
  },
  recentJobs: [
    {
      id: "job-1",
      title: "Senior Frontend Developer",
      applicants: 24,
      posted: "3 days ago",
      status: "active",
    },
    {
      id: "job-2",
      title: "DevOps Engineer",
      applicants: 18,
      posted: "1 week ago",
      status: "active",
    },
    {
      id: "job-3",
      title: "UX Designer",
      applicants: 32,
      posted: "2 weeks ago",
      status: "active",
    },
    {
      id: "job-4",
      title: "Product Manager",
      applicants: 16,
      posted: "2 weeks ago",
      status: "closed",
    },
  ],
};

export default function HrProfile() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl pt-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your profile and job postings
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          <Link href="/recruiter/jobs/create">Post New Job</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={mockRecruiterData.avatar}
                alt={mockRecruiterData.name}
              />
              <AvatarFallback className="text-lg">
                {mockRecruiterData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{mockRecruiterData.name}</CardTitle>
              <CardDescription>{mockRecruiterData.position}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <span>{mockRecruiterData.company}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>{mockRecruiterData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>{mockRecruiterData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Member since {mockRecruiterData.joinDate}</span>
              </div>

              <Button variant="outline" className="w-full mt-4">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Recruitment Statistics</CardTitle>
            <CardDescription>
              Overview of your recruitment activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <Briefcase className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">
                  {mockRecruiterData.stats.activeJobs}
                </div>
                <div className="text-sm text-muted-foreground">Active Jobs</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">
                  {mockRecruiterData.stats.totalApplications}
                </div>
                <div className="text-sm text-muted-foreground">
                  Applications
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">
                  {mockRecruiterData.stats.interviewed}
                </div>
                <div className="text-sm text-muted-foreground">Interviewed</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <User className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">
                  {mockRecruiterData.stats.hired}
                </div>
                <div className="text-sm text-muted-foreground">Hired</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">My Jobs</TabsTrigger>
          <TabsTrigger value="applicants">Applicants</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Recent Job Postings</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/recruiter/jobs">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecruiterData.recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {job.applicants} applicants • Posted {job.posted}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          job.status === "active" ? "default" : "secondary"
                        }
                      >
                        {job.status === "active" ? "Active" : "Closed"}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/recruiter/jobs/${job.id}`}>Manage</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button asChild>
                  <Link href="/recruiter/jobs/create">
                    <PlusCircle className="mr-2 h-4 w-4" /> Post New Job
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>All Job Postings</CardTitle>
              <CardDescription>
                Manage all your current and past job listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Detailed job listings would appear here with filtering options
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applicants">
          <Card>
            <CardHeader>
              <CardTitle>Applicant Management</CardTitle>
              <CardDescription>
                Review and manage candidates who have applied to your jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Applicant management interface would appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
