"use client";
import { Building, Mail, Phone } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useSession } from "~/hooks/useSession";
import { Button } from "../ui/button";

export default function RecruiterProfile() {
  const session = useSession();

  if (session.status === "authenticated")
    return (
      <Card className="col-span-1 md:col-span-1">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={session.data?.user.image ?? "/images/profile-default.jpg"}
              alt={session.data?.user.name ?? "Recruiter Avatar"}
            />
            <AvatarFallback className="text-lg">
              {session.data?.user.recruiter?.name}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>
              {session.data.user.recruiter?.name ?? "Recruiter"}
            </CardTitle>
            <CardDescription>
              {session.data.user.recruiter?.position ?? "Role"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building className="size-5 text-muted-foreground" />
              <span className="truncate">
                {session.data.user.recruiter?.organization ?? "Organization"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-muted-foreground" />
              <span className="truncate">
                {session.data.user.email ?? "Email"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="size-5 text-muted-foreground" />
              <span className="truncate">
                {session.data.user.recruiter?.phone ?? "phone"}
              </span>
            </div>

            {/* <Button variant="outline" className="w-full mt-4">
              Edit Profile
            </Button> */}
          </div>
        </CardContent>
      </Card>
    );
}
