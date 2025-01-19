import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export async function CallToAction() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col items-center gap-y-8 py-16 sm:py-20 px-7">
      <div className="flex flex-col gap-y-3 items-center">
        <h2 className="text-2xl sm:text-4xl font-bold max-w-2xl text-center">
          {userId
            ? "Take Your Scraping to the Next Level!"
            : "Ready to Simplify Web Scraping?"}
        </h2>

        <p className="text-lg text-center text-balance text-muted-foreground">
          {userId
            ? "Build a new workflow, check your dashboard stats, or explore your execution history."
            : "Sign up now and start building your first scraper in minutes!"}
        </p>
      </div>

      <Link href={`/workflows`} className={cn(buttonVariants(), "text-white")}>
        {userId ? "Build a new workflow" : "Get Started for Free"}
      </Link>
    </div>
  );
}
