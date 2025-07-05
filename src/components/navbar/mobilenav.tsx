"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { routes } from "./routes";
import AuthButton from "../buttons/authButton";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 text-foreground hover:bg-muted rounded-md transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 z-40" onClick={closeMenu} />

          {/* Mobile menu */}
          <div className="fixed top-20 left-0 right-0 bg-background border-b shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-6 space-y-4">
              <div className="space-y-3">
                {routes.map((route, idx) => (
                  <Link
                    key={idx}
                    href={route.link}
                    className="block text-lg font-semibold text-foreground hover:text-primary transition-colors py-2"
                    onClick={closeMenu}
                  >
                    {route.name}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t">
                <AuthButton />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
