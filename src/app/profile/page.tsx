"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import {
  Edit,
  Save,
  X,
  FileText,
  ExternalLink,
  Calendar,
  TrendingUp,
  BookOpen,
  Award,
  Mail,
  CheckCircle,
  AlertCircle,
  User,
  Briefcase,
} from "lucide-react";

// ---- MOCK DATA ----
const mock = {
  user: {
    id: "u1",
    name: "Shreejan Shetty",
    email: "shreejan@hirelin.com",
    image:
      "https://th.bing.com/th/id/OIP.NmhB_IY8yA-7J483wwf77wHaHa?w=175&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    emailVerified: new Date("2025-07-01"),
    createdAt: new Date("2025-07-01"),
    updatedAt: new Date("2025-07-03"),
  },
  resume: {
    id: "upload1",
    name: "Shreejan_Resume.pdf",
    url: "https://example.com/resume.pdf",
    filetype: "application/pdf",
    uploadType: "resume",
  },
  applications: [
    {
      id: "app1",
      status: "pending",
      parsedResume:
        "Skilled React developer with experience in building scalable UIs.",
      layoutScore: 8.5,
      contentScore: 9.2,
      skillGap: JSON.stringify({
        missing_skills: ["TypeScript", "Testing"],
        score: 7.8,
      }),
      jobOpening: {
        id: "job1",
        title: "Frontend Developer",
        company: "Hirelin",
        location: "Remote",
        type: "fullTime",
        status: "open",
      },
      learningPlan: {
        id: "lp1",
        planDetails: {
          topics: "React, Next.js, Tailwind",
          startDate: "2025-07-01",
          endDate: "2025-07-20",
        },
        assessments: [
          {
            id: "assess1",
            title: "Frontend Quiz",
            description: "Covers fundamentals of React and UI design",
            questions: {
              attempted: true,
              score: 85,
            },
          },
          {
            id: "assess2",
            title: "Advanced React Test",
            description: "Hooks, Context, and Performance",
            questions: {
              attempted: false,
              score: null,
            },
          },
        ],
      },
    },
    {
      id: "app2",
      status: "training",
      parsedResume:
        "Skilled React developer with experience in building scalable UIs.",
      layoutScore: 7.2,
      contentScore: 8.0,
      skillGap: JSON.stringify({
        missing_skills: ["Node.js", "Database Design"],
        score: 6.5,
      }),
      jobOpening: {
        id: "job2",
        title: "Full Stack Developer",
        company: "TechCorp",
        location: "San Francisco",
        type: "fullTime",
        status: "open",
      },
      learningPlan: {
        id: "lp2",
        planDetails: {
          topics: "TypeScript, Node.js, Database Design",
          startDate: "2025-08-01",
          endDate: "2025-08-10",
        },
        assessments: [
          {
            id: "assess3",
            title: "Backend Fundamentals",
            description: "Node.js, Express, and API design",
            questions: {
              attempted: false,
              score: null,
            },
          },
        ],
      },
    },
  ],
};

export default function StudentProfileDashboard() {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    image: mock.user.image,
    name: mock.user.name,
    email: mock.user.email,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setEditing(false);
    console.log("Saved profile:", formData);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      image: mock.user.image,
      name: mock.user.name,
      email: mock.user.email,
    });
  };

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

  return (
    <main className="min-h-screen bg-background p-4 md:p-6 md:my-28 my-20">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-4">
            <User className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Student Dashboard</h1>
              <p className="text-primary-foreground/80">
                Manage your profile and track your progress
              </p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <Card className="shadow-lg">
          <CardHeader className="bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Profile Information</CardTitle>
              </div>
              {!editing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(true)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <label htmlFor="image-upload" className="cursor-pointer group">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData((prev) => ({
                            ...prev,
                            image: reader.result as string,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Avatar className="h-24 w-24 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Profile"
                        className="rounded-full object-cover"
                        onError={() =>
                          setFormData((prev) => ({ ...prev, image: "" }))
                        }
                      />
                    ) : (
                      <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                        {formData.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </label>
                {editing && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Click to change photo
                  </p>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Full Name
                    </label>
                    <Input
                      name="name"
                      disabled={!editing}
                      value={formData.name}
                      onChange={handleChange}
                      className={editing ? "ring-2 ring-primary/20" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email Address
                    </label>
                    <Input
                      name="email"
                      disabled={!editing}
                      value={formData.email}
                      onChange={handleChange}
                      className={editing ? "ring-2 ring-primary/20" : ""}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={`gap-2 ${
                      mock.user.emailVerified
                        ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {mock.user.emailVerified ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {mock.user.emailVerified
                      ? "Email Verified"
                      : "Email Not Verified"}
                  </Badge>

                  {!mock.user.emailVerified && (
                    <Button
                      variant="link"
                      size="sm"
                      className="text-primary p-0 h-auto"
                      onClick={() => alert("Verification email sent!")}
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Verify now
                    </Button>
                  )}
                </div>

                {editing && (
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSave} className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Section */}
        <Card className="shadow-lg">
          <CardHeader className="bg-muted/50">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Resume</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {mock.resume.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF Document
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => window.open(mock.resume.url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  View Resume
                </Button>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Summary:</strong> {mock.applications[0]?.parsedResume}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Section */}
        <Card className="shadow-lg">
          <CardHeader className="bg-muted/50">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Job Applications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mock.applications.map((app, index) => (
                    <TableRow
                      key={`${app.id}-${index}`}
                      className="hover:bg-muted/50"
                    >
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
                          {((app.layoutScore + app.contentScore) / 2).toFixed(
                            1
                          )}
                          /10
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Learning Plans Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Learning Plans</h2>
          </div>

          {mock.applications
            .filter((app) => app.learningPlan)
            .map((app, idx) => (
              <Card key={app.id} className="shadow-lg">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      {app.jobOpening.title} - Learning Plan
                    </CardTitle>
                    <Badge variant="outline" className="gap-2">
                      <Calendar className="h-3 w-3" />
                      {app.learningPlan!.planDetails.startDate} →{" "}
                      {app.learningPlan!.planDetails.endDate}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-muted/50 border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">
                      Topics Covered
                    </p>
                    <p className="font-medium text-foreground">
                      {app.learningPlan!.planDetails.topics}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <p className="font-medium text-foreground">Assessments</p>
                    </div>

                    <div className="grid gap-3">
                      {app.learningPlan!.assessments.map((assessment, aidx) => (
                        <div
                          key={assessment.id}
                          className="border rounded-lg p-4 bg-card shadow-sm"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground mb-1">
                                {assessment.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mb-3">
                                {assessment.description}
                              </p>
                            </div>
                            <div className="ml-4">
                              {assessment.questions.attempted ? (
                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Completed ({assessment.questions.score}%)
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    alert(`Redirect to ${assessment.title}`)
                                  }
                                  className="gap-2"
                                >
                                  <Award className="h-3 w-3" />
                                  Start Assessment
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </main>
  );
}
