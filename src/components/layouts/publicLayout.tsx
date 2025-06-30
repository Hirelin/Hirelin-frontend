import React from "react";
import ThemeProvider from "../provider/theme-provider";
import Navbar from "../navbar/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // return (
  //   <>
  //     <Navbar />
  //     <main className="min-h-screen w-full">{children}</main>
  //   </>
  // );
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Navbar />
      <main className="min-h-screen w-full">{children}</main>
    </ThemeProvider>
  );
}
