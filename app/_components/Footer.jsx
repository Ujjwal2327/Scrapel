"use client";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const links = ["workflows", "credentials", "dashboard", "billing"];

  return (
    <div
      id="pricing"
      className="flex flex-col items-center gap-y-4 py-4 px-7 bg-gradient-to-b from-background/20 via-primary/5 to-background border-t"
    >
      <div className="w-full max-w-4xl flex justify-between items-center flex-col sm:flex-row gap-y-4">
        <Logo id="hero" />
        <div className="flex gap-x-4">
          {links.map((link) => (
            <Link
              key={link}
              href={`/${link}`}
              alt={link}
              className="capitalize underline"
            >
              {link}
            </Link>
          ))}
        </div>
      </div>
      <Separator className="max-w-4xl" />
      <p>&copy; 2025 Scrapel. All rights reserved.</p>
    </div>
  );
}
