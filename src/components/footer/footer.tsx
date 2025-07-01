import React from "react";
import Link from "next/link";
import { Contact } from "~/zod/constants";

import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaDiscord,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { routes } from "~/components/navbar/routes";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-6">
            {/* Logo */}
            <div>
              <div className="text-4xl font-bitcount font-normal bg-gradient-to-br from-orange-500 to-fuchsia-500 bg-clip-text text-transparent">
                Hirelin
              </div>
              <p className="mt-3 text-sm text-muted-foreground max-w-xs">
                Streamlining your hiring process with advanced AI-powered
                solutions for teams of all sizes.
              </p>
            </div>

            {/* Social media icons */}
            <div className="flex space-x-4">
              <a
                href={Contact.github}
                className="text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/hirelin"
                className="text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/hirelin"
                className="text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a
                href="https://discord.gg/hirelin"
                className="text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
              >
                <FaDiscord className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@hirelin"
                className="text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Explore</h3>
            <ul className="space-y-3">
              {routes.map((route, idx) => (
                <li key={idx}>
                  <Link
                    href={route.link}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact section */}
          <div className="space-y-5">
            <h3 className="text-sm font-medium">Contact</h3>
            <address className="not-italic text-sm text-muted-foreground">
              {Contact.address.line1}
              <br />
              {Contact.address.line2 && (
                <>
                  {Contact.address.line2}
                  <br />
                </>
              )}
              {Contact.address.city}, {Contact.address.state}{" "}
              {Contact.address.zip}
              <br />
              {Contact.address.country}
            </address>

            <p className="flex items-center gap-2">
              <MdEmail className="h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${Contact.email}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {Contact.email}
              </a>
            </p>

            <div className="pt-4">
              <h4 className="text-sm font-medium mb-3">Share your feedback</h4>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Tell us what you think"
                  aria-label="Feedback"
                />
                <Button>Send</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                We value your input to improve our service.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-border pt-8">
          <div className="flex flex-col-reverse justify-between gap-6 sm:flex-row sm:items-center">
            {/* Copyright on the left */}
            <div className="text-xs text-muted-foreground">
              <p>© {currentYear} Hirelin, Inc. All rights reserved.</p>
              <p className="mt-1">
                Designed with care by the Hirelin team.{" "}
                <span className="text-primary">❤</span>
              </p>
            </div>

            {/* Additional links on the right */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href="/privacy"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Cookies
              </Link>
              <Link
                href="/sitemap"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
