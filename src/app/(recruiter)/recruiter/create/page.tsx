import React from "react";
import CreateJobForm from "~/components/forms/createJobForm";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Building2, Users, FileText, Zap } from "lucide-react";

export default function CreateJob() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-14">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Create Job Opening
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Post a new position and find the perfect candidates for your team
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            <Card className="border-primary/20">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm">Smart Filtering</h3>
                  <p className="text-xs text-muted-foreground">
                    AI-powered candidate matching
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm">Rich Descriptions</h3>
                  <p className="text-xs text-muted-foreground">
                    Markdown support for formatting
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm">Quick Setup</h3>
                  <p className="text-xs text-muted-foreground">
                    Easy form with file uploads
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto">
          <CreateJobForm />
        </div>

        {/* Help Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-muted/30 border-primary/20">
            <CardHeader>
              <h3 className="text-lg font-semibold">Need Help?</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Writing Job Descriptions</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>
                      • Be specific about requirements and responsibilities
                    </li>
                    <li>• Include company culture and benefits</li>
                    <li>• Use bullet points for better readability</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">File Uploads</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>
                      • Layout reference: Shows desired application format
                    </li>
                    <li>• Requirements doc: Detailed job specifications</li>
                    <li>• Supported formats: PDF, DOC, DOCX, images</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
