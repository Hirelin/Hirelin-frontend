"use client";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { FileText, Loader2 } from "lucide-react";
import { env } from "~/env";
import { toast } from "sonner";

export default function JobActions({ jobId }: { jobId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = ["application/pdf"];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        alert("Please upload a PDF document");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("resumeFile", file);
      formData.append("jobId", jobId);

      const response = await fetch(
        `${env.NEXT_PUBLIC_SERVER_URL}/api/jobs/apply`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setOpen(false);
        setFile(null);
        toast.success("Application submitted successfully!");
      } else {
        throw new Error((await response.json()).error);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit application"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-brand font-semibold" size="lg">
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Apply for this Job</DialogTitle>
          <DialogDescription>
            Upload your resume to apply for this position.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume">Resume (PDF document)</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-muted file:text-sm"
            />
            {file && (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4" />
                <span>{file.name}</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!file || isUploading}
              className="bg-brand"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
