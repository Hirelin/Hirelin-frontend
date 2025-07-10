"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { createJobSchema } from "~/zod/schema";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import { env } from "~/env";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  CalendarIcon,
  FileText,
  Upload,
  Building2,
  MapPin,
  Clock,
  Mail,
} from "lucide-react";
import { cn } from "~/lib/utils";

export default function CreateJobForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof createJobSchema>>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      type: "fullTime",
      description: "",
      contact: "",
      address: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createJobSchema>) {
    setLoading(true);
    const formData = new FormData();

    const data = form.getValues();

    (Object.keys(data) as Array<keyof typeof data>).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        if (
          (key === "requirementsFile" || key === "layoutReferenceFile") &&
          data[key] instanceof File
        ) {
          formData.append(key, data[key]);
        } else if (key === "deadline" && data[key] instanceof Date) {
          formData.append(key, data[key].toISOString());
        } else if (typeof data[key] !== "object") {
          formData.append(key, String(data[key]));
        }
      }
    });

    const res = await fetch(
      `${env.NEXT_PUBLIC_SERVER_URL}/api/jobs/recruiter/create`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    if (res.status === 200) {
      form.reset();
      toast.success("Job opening created successfully");
    } else {
      toast.error("Failed to create job opening");
    }

    setLoading(false);
  }

  return (
    <div className="w-full mx-auto mt-8 space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Job Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Job Title
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Senior Software Engineer"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Company
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Acme Corp"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. New York, NY"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          City, state, or remote
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Job Type
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fullTime">Full Time</SelectItem>
                            <SelectItem value="partTime">Part Time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">
                              Internship
                            </SelectItem>
                            <SelectItem value="freelance">Freelance</SelectItem>
                            <SelectItem value="temporary">Temporary</SelectItem>
                            <SelectItem value="volunteer">Volunteer</SelectItem>
                            <SelectItem value="remote">Remote</SelectItem>
                            <SelectItem value="onSite">On Site</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Job Description Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Job Description
                </h3>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => {
                    const [showPreview, setShowPreview] = React.useState(false);
                    const ReactMarkdown = React.useMemo(
                      () => require("react-markdown").default,
                      []
                    );

                    return (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Job Description
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            (Markdown supported)
                          </span>
                        </FormLabel>
                        <div className="flex items-center gap-2 mb-3">
                          <Button
                            type="button"
                            variant={showPreview ? "outline" : "default"}
                            size="sm"
                            onClick={() => setShowPreview(false)}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant={showPreview ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowPreview(true)}
                          >
                            Preview
                          </Button>
                        </div>
                        {!showPreview ? (
                          <FormControl>
                            <Textarea
                              placeholder="Describe the job responsibilities, requirements, and benefits... (Markdown supported)"
                              className="min-h-[150px] font-mono resize-y"
                              {...field}
                            />
                          </FormControl>
                        ) : (
                          <div className="border rounded-lg min-h-[150px] p-4 bg-muted/30 prose prose-sm max-w-none">
                            <ReactMarkdown>
                              {field.value || "*Nothing to preview.*"}
                            </ReactMarkdown>
                          </div>
                        )}
                        <FormDescription>
                          You can use{" "}
                          <a
                            href="https://www.markdownguide.org/cheat-sheet/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-600 hover:text-blue-800"
                          >
                            Markdown
                          </a>{" "}
                          for formatting (headings, lists, bold, italic, etc.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <Separator />

              {/* Contact Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Contact Email
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="contact@example.com"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Address
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123 Main Street, Suite 100"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Application Settings Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Application Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem className="flex justify-start flex-col">
                        <FormLabel className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          Application Deadline
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full h-11 pl-3 text-left font-normal justify-start",
                                  !value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {value ? (
                                  format(value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={value}
                              onSelect={onChange}
                              disabled={(date) =>
                                date < new Date() ||
                                date < new Date("1900-01-01")
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Set the deadline for applications
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* File Uploads Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Document Uploads
                </h3>

                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="layoutReferenceFile"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Layout Reference File
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                              className="h-11 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                onChange(file);
                              }}
                              {...fieldProps}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="flex items-start gap-2">
                          <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          Upload a reference file that shows the desired layout
                          or format for applications (PDF, Word, or image files)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requirementsFile"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Requirements Document
                          <Badge variant="secondary" className="text-xs">
                            Optional
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="h-11 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                onChange(file);
                              }}
                              {...fieldProps}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="flex items-start gap-2">
                          <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          Upload a PDF or Word document with detailed
                          requirements. If not provided, the job description
                          will be used for candidate filtering.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <CardFooter className="px-0 pt-6 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Fields marked with{" "}
                  <Badge variant="destructive" className="text-xs mx-1">
                    Required
                  </Badge>{" "}
                  are mandatory
                </p>
                <Button type="submit" className="px-8 h-11" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    "Create Job Posting"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
