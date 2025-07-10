import React from "react";
import { getUserProfile } from "~/lib/user";
import ProfileHeader from "~/components/profile/ProfileHeader";
import ApplicationsList from "~/components/profile/ApplicationsList";
import ResumeSection from "~/components/profile/ResumeSection";
import LearningPlansList from "~/components/profile/LearningPlansList";
import { User } from "lucide-react";
import { getServerSession } from "~/server/auth";
import AuthButton from "~/components/buttons/authButton";

export default async function ProfilePage() {
  const session = await getServerSession();

  if (session.status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-destructive mb-2 flex items-center justify-center gap-2">
            <User className="h-7 w-7" />
            Access Denied
          </h1>
          <p className="text-muted-foreground mb-4">
            You must be logged in to view your profile.
          </p>
          <AuthButton />
        </div>
      </div>
    );
  }

  const userProfile = await getUserProfile();

  if (userProfile.status === "error" || !userProfile.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Error</h1>
          <p className="text-muted-foreground">Failed to load profile data.</p>
        </div>
      </div>
    );
  }

  const { data } = userProfile;

  return (
    <main className="min-h-screen bg-background p-4 md:p-6 md:my-28 my-20">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-4">
            <User className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Student Dashboard</h1>
              <p className="text-primary-foreground/80">
                Manage your profile and track your progress
              </p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <ProfileHeader
          name={data.name}
          email={data.email}
          image={data.image}
          createdAt={data.createdAt}
          emailVerified={data.emailVerified}
        />

        {/* Resume Section */}
        <ResumeSection uploads={data.uploads} />

        {/* Applications Section */}
        <ApplicationsList applications={data.applications} />

        {/* Learning Plans Section */}
        {/* <LearningPlansList applications={data.applications} /> */}
      </div>
    </main>
  );
}
