import React from "react";
import { routes } from "./routes";
import Link from "next/link";
import AuthButton from "../buttons/authButton";
import MobileNav from "./mobilenav";

export default function Navbar() {
  return (
    <nav className="w-full h-20 backdrop-blur-lg fixed top-0 z-50 border-b border-border/40">
      <div className="px-4 md:px-8 h-full mx-auto flex flex-row justify-between items-center">
        <Link
          href={"/"}
          className="font-bitcount text-3xl md:text-4xl font-normal bg-gradient-to-br from-orange-500 to-fuchsia-500 bg-clip-text text-transparent"
        >
          Hirelin
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-row justify-center items-center gap-8">
          <div className="flex flex-row justify-center gap-6 items-center">
            {routes.map((route, idx) => {
              return (
                <Link
                  key={idx}
                  href={route.link}
                  className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                >
                  {route.name}
                </Link>
              );
            })}
          </div>
          <AuthButton />
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </nav>
  );
}
