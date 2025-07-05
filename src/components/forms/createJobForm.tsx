"use client";

import React, { useState } from "react";
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
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { env } from "~/env";
import { toast } from "sonner";

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
        if (key === "requiremetsFile" && data[key] instanceof File) {
          formData.append(key, data[key]);
        } else {
          formData.append(key, String(data[key]));
        }
      }
    });

    console.log(formData);

    const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/jobs/create`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (res.status === 200) {
      form.reset();
      toast.success("Job opening created successfully");
    } else {
      toast.error("Failed to create job opening");
    }

    setLoading(false);
  }

  return (
    <Card className="w-full mx-auto mt-4">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Senior Software Engineer"
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
                    <FormLabel>Company*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Acme Corp" {...field} />
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
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. New York, NY" {...field} />
                    </FormControl>
                    <FormDescription>City, state, or remote</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fullTime">Full Time</SelectItem>
                        <SelectItem value="partTime">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                const [showPreview, setShowPreview] = React.useState(false);
                // Dynamically import react-markdown to avoid SSR issues if needed
                const ReactMarkdown = React.useMemo(
                  () => require("react-markdown").default,
                  []
                );

                return (
                  <FormItem>
                    <FormLabel>Job Description* (Markdown supported)</FormLabel>
                    <div className="flex items-center gap-2 mb-2">
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
                          className="min-h-[120px] font-mono"
                          {...field}
                        />
                      </FormControl>
                    ) : (
                      <div className="border rounded min-h-[120px] p-3 bg-muted font-mono prose prose-sm max-w-none">
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
                        className="underline text-blue-600"
                      >
                        Markdown
                      </a>{" "}
                      for formatting.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email*</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contact@example.com"
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
                    <FormLabel>Address*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main Street, Suite 100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="requiremetsFile"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Requirements Document</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a PDF or Word document with detailed requirements.
                    Job description will be used to filter candidates if no
                    format file is uploaded
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pt-6">
              <Button type="submit" className="ml-auto" disabled={loading}>
                Create Job Posting
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
