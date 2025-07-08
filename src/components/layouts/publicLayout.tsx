import React from "react";
import ThemeProvider from "../provider/theme-provider";

import Navbar from "../navbar/navbar";
import ReactScan from "../provider/react-scan";
import Footer from "../footer/footer";
import { Toaster } from "../ui/sonner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <ReactScan />
      <Navbar />
      <main className="min-h-screen w-full">{children}</main>
      <Footer />
      <Toaster richColors />
    </ThemeProvider>
  );
}
