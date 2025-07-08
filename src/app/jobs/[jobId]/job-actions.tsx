"use client";
import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { FileText, Loader2, Upload, Plus, CheckCircle } from "lucide-react";
import { env } from "~/env";
import { toast } from "sonner";

interface Resume {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}

export default function JobActions({ jobId }: { jobId: string }) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [open, setOpen] = useState(false);
  const [showUploadNew, setShowUploadNew] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [newlyUploadedResumeId, setNewlyUploadedResumeId] =
    useState<string>("");

  // Fetch existing resumes when dialog opens
  useEffect(() => {
    if (open) {
      fetchResumes();
    }
  }, [open]);

  const fetchResumes = async () => {
    setIsLoadingResumes(true);
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_SERVER_URL}/api/jobs/user/resume-list`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResumes(data.data || []);
      } else {
        throw new Error("Failed to fetch resumes");
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      toast.error("Failed to load your resumes");
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = ["application/pdf"];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setUploadSuccess(false);
      } else {
        toast.error("Please upload a PDF document");
      }
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("resumeFile", file);

      const response = await fetch(
        `${env.NEXT_PUBLIC_SERVER_URL}/api/jobs/user/upload-resume`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        const resumeId = data.resumeId;

        setNewlyUploadedResumeId(resumeId);
        setSelectedResumeId(resumeId);
        setUploadSuccess(true);

        // Refresh resumes list to include the new upload
        await fetchResumes();

        toast.success("Resume uploaded successfully!");
      } else {
        throw new Error("Failed to upload resume");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume");
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplicationSubmit = async () => {
    if (!selectedResumeId) {
      toast.error("Please select a resume");
      return;
    }

    setIsApplying(true);
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_SERVER_URL}/api/jobs/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            jobId,
            resumeId: selectedResumeId,
          }),
        }
      );

      if (response.ok) {
        resetForm();
        setOpen(false);
        toast.success("Application submitted successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit application"
      );
    } finally {
      setIsApplying(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setSelectedResumeId("");
    setShowUploadNew(false);
    setUploadSuccess(false);
    setNewlyUploadedResumeId("");
  };

  const canSubmitApplication = selectedResumeId && !isApplying;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full bg-brand font-semibold" size="lg">
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for this Job</DialogTitle>
          <DialogDescription>
            Select an existing resume or upload a new one to apply for this
            position.
          </DialogDescription>
        </DialogHeader>

        {isLoadingResumes ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading your resumes...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Existing Resumes Section */}
            {resumes.length > 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">
                    Select from existing resumes
                  </Label>
                  <Select
                    value={selectedResumeId}
                    onValueChange={setSelectedResumeId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a resume" />
                    </SelectTrigger>
                    <SelectContent>
                      {resumes.map((resume) => (
                        <SelectItem key={resume.id} value={resume.id}>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            {resume.name}
                            {resume.id === newlyUploadedResumeId && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedResumeId && (
                  <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium">
                          Selected:{" "}
                          {resumes.find((r) => r.id === selectedResumeId)?.name}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Separator */}
            {resumes.length > 0 && (
              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-sm text-muted-foreground">OR</span>
                <Separator className="flex-1" />
              </div>
            )}

            {/* Upload New Resume Section */}
            <div className="space-y-4">
              <Label className="text-base font-medium">
                Upload a new resume
              </Label>

              {!showUploadNew ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUploadNew(true)}
                  className="w-full gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Upload New Resume
                </Button>
              ) : (
                <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
                  <div className="space-y-2">
                    <Label htmlFor="resume">Choose PDF file</Label>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-muted file:text-sm"
                    />
                    {file && !uploadSuccess && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span>{file.name}</span>
                      </div>
                    )}
                  </div>

                  {uploadSuccess ? (
                    <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-700 dark:text-green-300">
                            Resume uploaded successfully! You can now submit
                            your application.
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handleFileUpload}
                        disabled={!file || isUploading}
                        className="gap-2"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Upload Resume
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowUploadNew(false);
                          setFile(null);
                          setUploadSuccess(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* No Resumes Available */}
            {resumes.length === 0 && !showUploadNew && (
              <div className="text-center py-6">
                <FileText className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  No resumes found. Please upload your resume to apply.
                </p>
                <Button
                  type="button"
                  onClick={() => setShowUploadNew(true)}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Resume
                </Button>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApplicationSubmit}
            disabled={!canSubmitApplication}
            className="bg-brand w-full sm:w-auto"
          >
            {isApplying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting Application...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
