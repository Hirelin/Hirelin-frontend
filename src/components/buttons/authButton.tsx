"use client";
import React from "react";
import Image from "next/image";
import { useSession } from "~/hooks/useSession";
import { logOut, SignInWithProvider } from "~/lib/auth";
import { useSearchParams } from "next/navigation";

import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";

export default function AuthButton() {
  const session = useSession();
  const params = useSearchParams();

  if (session.status === "loading") {
    <Button disabled></Button>;
  } else if (session.status === "authenticated") {
    return (
      <Popover>
        <PopoverTrigger className="flex border border-white bg-white/10 rounded-full p-0.5 flex-row max-w-40 items-center gap-2">
          <Image
            src={session.data.image ?? "/images/profile-default.jpg"}
            className="size-10 rounded-full"
            height={100}
            width={100}
            alt="User"
          />
          <span className="truncate">{session.data.name}</span>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col items-center gap-2">
          <Image
            src={session.data.image ?? "/images/profile-default.jpg"}
            className="rounded-md mb-2"
            height={100}
            width={100}
            alt="User"
          />
          <Separator className="w-full bg-white/30 h-0.5" />
          <div className="grid grid-cols-1 w-full text-center">
            <p className="text-lg font-semibold">
              Welcome {session.data.name ?? "User"}
            </p>
            <p className="opacity-70">{session.data.email}</p>
            <div className="grid grid-rows-2 grid-cols-1 mt-4 gap-2 w-full">
              <Button className="w-full">Profile</Button>
              <Button
                className="w-full"
                variant={"destructive"}
                onClick={() => logOut()}
              >
                Log out
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  } else {
    return (
      <Button
        onClick={() => {
          const redirect = params.get("redirect");
          SignInWithProvider("google", redirect);
        }}
      >
        Sign in
      </Button>
    );
  }
}
