import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function RecruiterStats() {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Recruitment Statistics</CardTitle>
        <CardDescription>
          Overview of your recruitment activities
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground">
        Stay tuned! This section is under development and will be available
        soon.
      </CardContent>
    </Card>
  );
}
