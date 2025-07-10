"use client";
import { format } from "date-fns";
import {
  Briefcase,
  Calendar,
  CalendarIcon,
  Download,
  Eye,
  FileText,
  Save,
  TrendingUp,
  User,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import {
  ApplicationStatus,
  getApplicationStatusColor,
  getApplicationStatusLabel,
  JobStatus,
  shortlistApplicantions,
} from "~/lib/recruiter";
import { cn } from "~/lib/utils";
import { Application, JobOpening } from "~/server/recruiter";
import { JobType } from "~/types/jobs";
import { Calendar as CalendarComp } from "~/components/ui/calendar";
import { toast } from "sonner";
import { env } from "~/env";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

type JobEditFormData = {
  title: string;
  company: string;
  location: string;
  type: JobType;
  description: string;
  contact: string;
  address: string;
  deadline: Date | null;
  status: JobStatus;
  startDate: Date | null;
  endDate: Date | null;
};

export default function DataForm({
  job,
  editing,
  setEditing,
}: {
  job: JobOpening;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [form, setForm] = useState<JobEditFormData>({
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type as JobType,
    description: job.description,
    contact: job.contact,
    address: job.address,
    deadline: job.deadline ? new Date(job.deadline) : null,
    status: job.status as JobStatus,
    startDate: job.startDate ? new Date(job.startDate) : null,
    endDate: job.endDate ? new Date(job.endDate) : null,
  });
  const [saving, setSaving] = useState(false);
  const { jobId } = useParams();

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);

    try {
      if (jobId === null || jobId === undefined || jobId === "") {
        toast.error("Invalid job Id");
        setSaving(false);
        return;
      }

      const res = await fetch(
        `${env.NEXT_PUBLIC_SERVER_URL}/api/jobs/recruiter/update-job?jobId=${jobId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        toast.error("Failed to save changes");
      }

      toast.success("Successfully updated changes");
    } catch (error) {
      toast.error("Failed to save changes");
    }
    setSaving(false);
    setEditing(false);
  }

  return (
    <form>
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="dates">Dates</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Details form={form} setForm={setForm} editing={editing} />
        </TabsContent>
        <TabsContent value="dates" className="space-y-6">
          <Dates form={form} setForm={setForm} editing={editing} />
        </TabsContent>
        <TabsContent value="files" className="space-y-6">
          <Files job={job} />
        </TabsContent>
        <TabsContent value="applications" className="space-y-6">
          {/* <Dates form={form} setForm={setForm} /> */}
          <ApplicationList job={job} />
        </TabsContent>

        {editing && (
          <Card>
            <CardFooter className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </CardFooter>
          </Card>
        )}
      </Tabs>
    </form>
  );
}

const jobTypeOptions = [
  { value: "fullTime", label: "Full Time", api: "fullTime" },
  { value: "partTime", label: "Part Time", api: "partTime" },
  { value: "contract", label: "Contract", api: "contract" },
  { value: "internship", label: "Internship", api: "internship" },
  { value: "freelance", label: "Freelance", api: "freelance" },
  { value: "temporary", label: "Temporary", api: "temporary" },
  { value: "volunteer", label: "Volunteer", api: "volunteer" },
  { value: "remote", label: "Remote", api: "remote" },
  { value: "onSite", label: "On Site", api: "onSite" },
  { value: "hybrid", label: "Hybrid", api: "hybrid" },
];

const jobStatusOptions = [
  "upcoming",
  "open",
  "closed",
  "cancelled",
  "completed",
];

function Details({
  form,
  setForm,
  editing,
}: {
  form: JobEditFormData;
  setForm: React.Dispatch<React.SetStateAction<JobEditFormData>>;
  editing: boolean;
}) {
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSelectChange(name: string, value: string) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Job Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              disabled={!editing}
              required
            />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              value={form.company || ""}
              onChange={handleChange}
              disabled={!editing}
              required
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={form.location || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div>
            <Label htmlFor="type">Job Type</Label>
            <Select
              value={form.type || ""}
              onValueChange={(v) => handleSelectChange("type", v)}
              disabled={!editing}
              required
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {jobTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.status || ""}
              onValueChange={(v) => handleSelectChange("status", v)}
              disabled={!editing}
              required
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {jobStatusOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    <span className="capitalize">{opt}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="contact">Contact Email</Label>
            <Input
              id="contact"
              name="contact"
              type="email"
              value={form.contact || ""}
              onChange={handleChange}
              disabled={!editing}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={form.address || ""}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>
        <div>
          <Label htmlFor="description">Job Description</Label>
          <Textarea
            id="description"
            name="description"
            value={form.description || ""}
            onChange={handleChange}
            disabled={!editing}
            rows={6}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}

function Dates({
  form,
  setForm,
  editing,
}: {
  form: JobEditFormData;
  setForm: React.Dispatch<React.SetStateAction<JobEditFormData>>;
  editing: boolean;
}) {
  function handleDateChange(key: string, value: Date) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Important Dates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="startDate">Training Start Date</Label>
            <Popover>
              <PopoverTrigger asChild disabled={!editing}>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 pl-3 mt-2 text-left font-normal justify-start",
                    !form.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.startDate ? (
                    format(form.startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComp
                  mode="single"
                  selected={form.startDate ?? undefined}
                  onSelect={(value) => {
                    if (value) {
                      handleDateChange("startDate", value);
                    }
                  }}
                  disabled={(date) =>
                    date < new Date() || date < new Date("1900-01-01")
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="endDate">Traning End Date</Label>
            <Popover>
              <PopoverTrigger asChild disabled={!editing}>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 pl-3 mt-2 text-left font-normal justify-start",
                    !form.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.endDate ? (
                    format(form.endDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComp
                  mode="single"
                  selected={form.endDate ?? undefined}
                  onSelect={(value) => {
                    if (value) {
                      handleDateChange("endDate", value);
                    }
                  }}
                  disabled={(date) =>
                    date < new Date() || date < new Date("1900-01-01")
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="deadline">Application Deadline</Label>
            <Popover>
              <PopoverTrigger asChild disabled={!editing}>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 pl-3 mt-2 text-left font-normal justify-start",
                    !form.deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.deadline ? (
                    format(form.deadline, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComp
                  mode="single"
                  selected={form.deadline ?? undefined}
                  onSelect={(value) => {
                    if (value) {
                      handleDateChange("deadline", value);
                    }
                  }}
                  disabled={(date) =>
                    date < new Date() || date < new Date("1900-01-01")
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Files({ job }: { job: JobOpening }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Files & Requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Requirements Document</Label>
          <div className="mt-2 space-y-3">
            {job.requirements ? (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{job.requirements.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.requirements.filetype}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={job.requirements.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed rounded-lg">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  No requirements file uploaded
                </p>
              </div>
            )}
            {/* {isEditing && (
              <div>
                <Label htmlFor="requirements-file">
                  Upload New Requirements
                </Label>
                <Input
                  id="requirements-file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setRequirementsFile(e.target.files?.[0] || null)
                  }
                  className="mt-1"
                />
              </div>
            )} */}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-base font-medium">Layout Template</Label>
          <div className="mt-2 space-y-3">
            {job.layoutTemplate ? (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{job.layoutTemplate.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.layoutTemplate.filetype}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={job.layoutTemplate.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed rounded-lg">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  No layout template uploaded
                </p>
              </div>
            )}
            {/* {isEditing && (
              <div>
                <Label htmlFor="template-file">Upload New Template</Label>
                <Input
                  id="template-file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setLayoutTemplateFile(e.target.files?.[0] || null)
                  }
                  className="mt-1"
                />
              </div>
            )} */}
          </div>
        </div>

        {job.parsedRequirements && (
          <>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-medium">
                  Parsed Requirements
                </Label>
                <ParsedRequirementsDialog
                  requirements={job.parsedRequirements}
                />
              </div>
              {/* {isEditing && (
                <Textarea
                  name="parsedRequirements"
                  value={form.parsedRequirements || ""}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Parsed requirements (JSON format)"
                />
              )} */}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ParsedRequirementsDialog({ requirements }: { requirements: string }) {
  let parsedData;
  try {
    parsedData = JSON.parse(requirements);
  } catch {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Requirements
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Job Requirements</DialogTitle>
          </DialogHeader>
          <div className="whitespace-pre-wrap text-sm">{requirements}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          View Requirements
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Job Requirements</DialogTitle>
          <DialogDescription>
            Parsed requirements for {parsedData.job_title}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Position Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Job Title</Label>
                <p className="text-sm text-muted-foreground">
                  {parsedData.job_title}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Experience Required
                </Label>
                <p className="text-sm text-muted-foreground">
                  {parsedData.experience_required}
                </p>
              </div>
            </div>
          </div>

          {parsedData.skills_required && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Required Skills</h3>
              <div className="space-y-3">
                {parsedData.skills_required.map((skill: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="font-medium text-sm mb-1">
                      {skill.skill}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {skill.goal}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {parsedData.tools_or_tech && (
            <div>
              <h3 className="font-semibold text-lg mb-3">
                Tools & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {parsedData.tools_or_tech.map((tech: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ApplicationWithScore extends Application {
  overallScore: number;
}

function ApplicationList({ job }: { job: JobOpening }) {
  const [shortlistCount, setShortlistCount] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);

  const processedApplications = useMemo(() => {
    const withScores: ApplicationWithScore[] =
      job.applications?.map((app) => ({
        ...app,
        overallScore: ((app.layoutScore ?? 0) + (app.contentScore ?? 0)) / 2,
      })) ?? [];

    // Sort applications
    return withScores.sort((a, b) => {
      return b.overallScore - a.overallScore;
      // if (sortBy === "score") {
      //   return b.overallScore - a.overallScore;
      // } else {
      //   return (
      //     new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      //   );
      // }
    });
  }, [job]);

  const getScoreColor = useCallback((score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 4) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  }, []);

  const getScoreBarColor = useCallback((score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    if (score >= 4) return "bg-orange-500";
    return "bg-red-500";
  }, []);

  const getScoreBarBg = useCallback((score: number) => {
    if (score >= 8) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 6) return "bg-yellow-100 dark:bg-yellow-900/20";
    if (score >= 4) return "bg-orange-100 dark:bg-orange-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  }, []);

  return (
    <>
      {processedApplications.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="bg-muted/50 border rounded-lg p-6 sm:p-8 w-full mx-auto">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground mb-4 text-lg">
              No applications found
            </p>
            <Button
              onClick={() => {
                window.location.reload();
              }}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Refresh
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader className="text-muted-foreground flex flex-row justify-between items-center">
              <div className="my-auto">
                Application Count : {processedApplications.length}
              </div>
              <div className="flex flex-row gap-4">
                <Button
                  variant={"outline"}
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Refresh
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Shortlist</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Select Count</DialogTitle>
                    <DialogDescription className="gap-2 flex flex-col">
                      <p>Select the number of application to be shortlisted</p>
                      <Input
                        value={shortlistCount}
                        type="text"
                        onChange={(e) =>
                          setShortlistCount(Number(e.target.value))
                        }
                      />
                    </DialogDescription>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant={"destructive"}>Cancel</Button>
                      </DialogClose>
                      <Button
                        onClick={async () => {
                          if (shortlistCount === 0) {
                            toast.error(
                              "Number of candidates to shortlist cannot be zero"
                            );
                          } else {
                            const result = await shortlistApplicantions(
                              shortlistCount,
                              job.id
                            );

                            if (result.status) {
                              toast.success(result.message);
                              setDialogOpen(false);
                            } else {
                              toast.error(result.message);
                            }
                          }
                        }}
                      >
                        Submit
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
          </Card>
          <div className="grid gap-3">
            {processedApplications.map((application) => (
              <Card
                key={application.id}
                className="hover:shadow-lg transition-all duration-200 border bg-card p-3"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 ring-2 ring-border flex-shrink-0">
                      <AvatarImage
                        src={
                          application.user.image ?? "/image/profile-default.jpg"
                        }
                        alt={application.user.name}
                      />
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-card-foreground">
                          {application.user.name}
                        </h3>
                        <Badge
                          className={`capitalize text-xs px-2 py-0.5 ${getApplicationStatusColor(
                            application.status as ApplicationStatus
                          )}`}
                        >
                          {getApplicationStatusLabel(
                            application.status as ApplicationStatus
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 sm:mb-1">
                        {application.user.email}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span className="truncate">{job.title}</span>
                          {/* <Badge
                            className={`ml-1 text-xs px-1 py-0.5 ${getJobStatusColor(
                              application.jobOpening.status
                            )}`}
                          >
                            {getJobStatusLabel(application.jobOpening.status)}
                          </Badge> */}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(application.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-2 md:flex-shrink-0">
                    <div className="bg-muted/50 border rounded-lg p-2 w-full sm:w-auto min-w-[160px]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Analysis
                        </span>
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                      </div>

                      <div className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Layout
                            </span>
                            <span
                              className={`text-xs font-bold ${getScoreColor(
                                application.layoutScore ?? 0
                              )}`}
                            >
                              {application.layoutScore}/10
                            </span>
                          </div>
                          <div
                            className={`h-1 rounded-full w-full ${getScoreBarBg(
                              application.layoutScore ?? 0
                            )}`}
                          >
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(
                                application.layoutScore ?? 0
                              )}`}
                              style={{
                                width: `${
                                  ((application.layoutScore ?? 0) / 10) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Content
                            </span>
                            <span
                              className={`text-xs font-bold ${getScoreColor(
                                application.contentScore ?? 0
                              )}`}
                            >
                              {application.contentScore}/10
                            </span>
                          </div>
                          <div
                            className={`h-1 rounded-full w-full ${getScoreBarBg(
                              application.contentScore ?? 0
                            )}`}
                          >
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(
                                application.contentScore ?? 0
                              )}`}
                              style={{
                                width: `${
                                  ((application.contentScore ?? 0) / 10) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Overall
                          </span>
                          <span
                            className={`text-xs font-bold ${getScoreColor(
                              application.overallScore
                            )}`}
                          >
                            {application.overallScore.toFixed(1)}/10
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(application.resume.url, "_blank")
                        }
                        className="h-8 px-3 flex-1 md:flex-none"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Resume</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                      {/* {application.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 px-3 flex-1 md:flex-none"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 px-3 flex-1 md:flex-none"
                      >
                        Reject
                      </Button>
                    </>
                  )} */}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? "Loading..." : "Load More Applications"}
              </Button>
            </div>
          )} */}
        </>
      )}
    </>
  );
}
