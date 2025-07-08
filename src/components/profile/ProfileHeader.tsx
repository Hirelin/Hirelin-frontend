"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Mail,
  User,
} from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  email: string;
  image: string | null;
  createdAt: Date;
  emailVerified: Date | null;
}

export default function ProfileHeader({
  name,
  email,
  image,
  createdAt,
  emailVerified,
}: ProfileHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    image: image || "",
    name,
    email,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setEditing(false);
    console.log("Saved profile:", formData);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      image: image || "",
      name,
      email,
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Profile Information</CardTitle>
          </div>
          {!editing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start">
            <label htmlFor="image-upload" className="cursor-pointer group">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData((prev) => ({
                        ...prev,
                        image: reader.result as string,
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <Avatar className="h-24 w-24 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Profile"
                    className="rounded-full object-cover"
                    onError={() =>
                      setFormData((prev) => ({ ...prev, image: "" }))
                    }
                  />
                ) : (
                  <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                    {formData.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
            </label>
            {editing && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Click to change photo
              </p>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input
                  name="name"
                  disabled={!editing}
                  value={formData.name}
                  onChange={handleChange}
                  className={editing ? "ring-2 ring-primary/20" : ""}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  name="email"
                  disabled={!editing}
                  value={formData.email}
                  onChange={handleChange}
                  className={editing ? "ring-2 ring-primary/20" : ""}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className={`gap-2 ${
                  emailVerified
                    ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {emailVerified ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                {emailVerified ? "Email Verified" : "Email Not Verified"}
              </Badge>

              {!emailVerified && (
                <Button
                  variant="link"
                  size="sm"
                  className="text-primary p-0 h-auto"
                  onClick={() => alert("Verification email sent!")}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Verify now
                </Button>
              )}
            </div>

            {editing && (
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
