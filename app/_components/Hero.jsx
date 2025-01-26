"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import { buttonVariants } from "@/components/ui/button";
import Ripple from "@/components/ui/ripple";

export function Hero() {
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setCurrentTheme(systemTheme);
    } else {
      setCurrentTheme(theme);
    }
  }, [theme]);

  return (
    <div
      id="hero"
      className="flex flex-col justify-between items-center gap-y-8 pt-14 pb-20 sm:pt-16 sm:pb-24 overflow-hidden relative"
    >
      <Ripple
        mainCircleSize={450}
        mainCircleOpacity={0.18}
        className="md:bottom-72"
      />

      <Link
        href="https://github.com/Ujjwal2327/Scrapel"
        target="_blank"
        className={cn(
          "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        )}
      >
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          <span>🚀 Explore Scrapel on GitHub</span>
          <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>
      </Link>

      <h2 className="text-4xl sm:text-6xl font-bold text-balance max-w-3xl text-center">
        Build Powerful
        <br />
        Web Scrapers <span>Visually!</span>
      </h2>

      <p className="text-balance text-center text-xl text-muted-foreground max-w-xl">
        Scrapel empowers you to create, manage and execute web scrapers
        effortlessly with our drag-and-drop builder.
      </p>

      <Link
        href={`/workflows`}
        className={cn(buttonVariants({ size: "lg" }), "text-white")}
      >
        {/* {userId ? "Create Your Workflow" : "Get Started for Free"} */}
        Get Started for Free
      </Link>

      <div className="p-[2px] bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-xl z-10">
        <div className="bg-background rounded-xl">
          <Image
            src={
              currentTheme === "light" ? `/hero/light.png` : `/hero/dark.png`
            }
            alt="hero preview image"
            height={950}
            width={950}
            className="rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
