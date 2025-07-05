import React from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { mailtoLink } from "~/zod/constants";

export default function HrRegister() {
  return (
    <section className="container max-w-4xl mx-auto py-12 px-4 pt-40 flex justify-center">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Become a Recruiter
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Join our platform as a recruiter to post jobs and find talented
            candidates
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">How to Become a Recruiter</h3>
            <p className="text-muted-foreground">
              To become a recruiter on our platform, you need to send a request
              to our admin team. We'll review your application and get back to
              you within 2-3 business days.
            </p>

            <div className="mt-6 flex justify-center">
              <Link href={mailtoLink}>
                <Button size="lg" className="bg-brand">
                  Send Email to Request Access
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Requirements</h3>
            <div className="space-y-2">
              {[
                "You must represent a legitimate company or be an authorized hiring manager",
                "Valid company email address is required for verification",
                "Complete company profile information will be needed after approval",
                "Agree to our terms of service and recruiter guidelines",
                "Maintain ethical recruitment practices on our platform",
              ].map((requirement, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>{requirement}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Note</h4>
            <p className="text-sm text-muted-foreground">
              By applying to become a recruiter, you acknowledge that your
              account will be subject to additional verification and you agree
              to abide by our platform's recruiter terms and conditions. Misuse
              of recruiter privileges may result in account suspension.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
