import React from "react";
import Link from "next/link";
import {
  CalendarIcon,
  MapPinIcon,
  BriefcaseIcon,
  BuildingIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { JobCardData, JOB_TYPE_LABELS } from "~/types/jobs";

/**
 * Displays individual job card
 */
export function JobCard({
  id,
  title,
  company,
  location,
  type,
  salary,
  postedDate,
}: JobCardData) {
  // Format the date for display
  const formattedDate = new Date(postedDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="rounded-lg border border-border bg-background p-5 hover:shadow-md transition-shadow">
      <div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <BuildingIcon className="h-4 w-4 mr-1" />
          <span>{company}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinIcon className="h-4 w-4" />
          <span>{location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BriefcaseIcon className="h-4 w-4" />
          <span>{JOB_TYPE_LABELS[type] || type}</span>
          {salary && <span>• {salary}</span>}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>Posted {formattedDate}</span>
        </div>
      </div>

      <Link href={`/jobs/${id}`} passHref>
        <Button variant="default" className="w-full mt-2">
          View Details
        </Button>
      </Link>
    </div>
  );
}
