"use client";
import React, { useEffect } from "react";
import { scan } from "react-scan";
import { env } from "~/env";

export default function ReactScan() {
  useEffect(() => {
    scan({
      enabled: env.NEXT_PUBLIC_NODE_ENV === "development",
    });
  }, []);

  return <></>;
}
