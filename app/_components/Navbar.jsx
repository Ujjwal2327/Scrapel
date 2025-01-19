"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { handleScroll } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { ModeToggle } from "@/components/ModeToggle";

export function Navbar() {
  return (
    <div className="bg-primary/20 sticky top-0 max-w-2xl mx-auto p-3 rounded-md backdrop-blur-md backdrop flex justify-between items-center flex-wrap z-20">
      <Logo id="hero" />
      <div className="flex justify-center items-center gap-x-4">
        <ul className="hidden xs:flex xs:gap-x-4">
          <li
            onClick={() => handleScroll("features")}
            className="cursor-pointer underline"
          >
            Features
          </li>
          <li
            onClick={() => handleScroll("how-it-works")}
            className="cursor-pointer underline"
          >
            How It Works
          </li>
          <li
            onClick={() => handleScroll("pricing")}
            className="cursor-pointer underline"
          >
            Pricing
          </li>
        </ul>
        <ModeToggle />
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
