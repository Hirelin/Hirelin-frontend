"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  FileText,
  ExternalLink,
  Upload,
  Trash2,
  Star,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface Upload {
  id: string;
  filetype: string;
  name: string;
  url: string;
  _count: {
    applications: number;
    jobOpenings: number;
  };
}

interface ResumeSectionProps {
  uploads: Upload[];
}

export default function ResumeSection({ uploads }: ResumeSectionProps) {
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  // Filter resumes from uploads
  const resumes = uploads.filter(
    (upload) =>
      upload.filetype === "application/pdf" ||
      upload.name.toLowerCase().includes("resume") ||
      upload.name.toLowerCase().includes("cv")
  );

  // Set default selected resume if none selected
  React.useEffect(() => {
    if (resumes.length > 0 && !selectedResumeId) {
      // Select the most used resume by default
      const mostUsed = resumes.reduce((prev, current) =>
        prev._count.applications > current._count.applications ? prev : current
      );
      setSelectedResumeId(mostUsed.id);
    }
  }, [resumes, selectedResumeId]);

  const selectedResume = resumes.find((r) => r.id === selectedResumeId);

  const handleUpload = () => {
    // Create file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log("Uploading file:", file);
        // TODO: Implement actual upload logic
        alert(`Upload functionality for ${file.name} coming soon!`);
      }
    };
    input.click();
  };

  const handleDelete = (resumeId: string) => {
    console.log("Deleting resume:", resumeId);
    // TODO: Implement delete logic
    alert("Delete functionality coming soon!");
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">
              Resumes ({resumes.length})
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpload}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Upload Resume
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {resumes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No resumes uploaded yet.</p>
            <Button className="mt-4" onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Your First Resume
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Resume Selection */}
            {resumes.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {resumes.map((resume) => (
                  <Button
                    key={resume.id}
                    variant={
                      selectedResumeId === resume.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedResumeId(resume.id)}
                    className="gap-2"
                  >
                    <FileText className="h-3 w-3" />
                    {resume.name.length > 20
                      ? `${resume.name.substring(0, 20)}...`
                      : resume.name}
                  </Button>
                ))}
              </div>
            )}

            {/* Selected Resume Display */}
            {selectedResume && (
              <div className="bg-muted/50 border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">
                          {selectedResume.name}
                        </p>
                        {selectedResume._count.applications > 0 && (
                          <Badge variant="secondary" className="gap-1">
                            <Star className="h-3 w-3" />
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        PDF Document
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(selectedResume.url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                      View
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDelete(selectedResume.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Resume
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Used in {selectedResume._count.applications}{" "}
                      application(s)
                    </span>
                    <span className="text-muted-foreground">
                      Associated with {selectedResume._count.jobOpenings} job(s)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* All Resumes List */}
            {resumes.length > 1 && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">All Resumes</h4>
                <div className="grid gap-2">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className={`flex items-center justify-between p-3 border rounded-lg ${
                        selectedResumeId === resume.id
                          ? "bg-primary/5 border-primary/20"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{resume.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {resume._count.applications} applications
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedResumeId(resume.id)}
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
