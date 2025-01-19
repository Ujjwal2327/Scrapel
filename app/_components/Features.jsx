"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Features() {
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

  const features = [
    {
      headline: "Visual Workflow Builder",
      subHeadline:
        "Easily design web scrapers with our intuitive drag-and-drop interface.",
      imgSrcDark: "/features/0-dark.png",
      imgSrcLight: "/features/0-light.png",
    },
    {
      headline: "Manual & Scheduled Execution",
      subHeadline:
        "Run workflows instantly or schedule them for automated execution.",
      imgSrcDark: "/features/1-dark.gif",
      imgSrcLight: "/features/1-light.gif",
    },
    {
      headline: "Execution Details & Outputs",
      subHeadline:
        "Track workflows in real time, monitor execution progress, and instantly analyze outputs and errors — all in one place immediately after completion.",
      imgSrcDark: "/features/2-dark.gif",
      imgSrcLight: "/features/2-light.gif",
    },
    {
      headline: "Execution History",
      subHeadline:
        "Access a comprehensive log of all your workflow runs with detailed insights.",
      imgSrcDark: "/features/3-dark.png",
      imgSrcLight: "/features/3-light.png",
    },
    {
      headline: "Credential Management",
      subHeadline:
        "Securely store and reuse credentials for streamlined workflows.",
      imgSrcDark: "/features/4-dark.png",
      imgSrcLight: "/features/4-light.png",
    },
    {
      headline: "Dashboard & Analytics",
      subHeadline:
        "Monitor workflow performance and credit usage with an intuitive dashboard.",
      imgSrcDark: "/features/5-dark.png",
      imgSrcLight: "/features/5-light.png",
    },
    {
      headline: "Flexible Billing",
      subHeadline: "Purchase credits easily to keep your workflows running.",
      imgSrcDark: "/features/6-dark.png",
      imgSrcLight: "/features/6-light.png",
    },
  ];

  const [featureIndex, setFeatureIndex] = useState(0);

  return (
    <div
      id="features"
      className="flex flex-col items-center gap-y-8 py-16 sm:py-20 px-7 bg-gradient-to-b from-secondary/70 via-primary/10 to-secondary/20"
    >
      <h2 className="text-3xl sm:text-5xl font-bold text-balance max-w-2xl text-center">
        Why Choose Scrapel?
      </h2>

      {/* lg:hidden */}
      <div className="w-full max-w-4xl lg:hidden flex flex-col gap-y-10">
        {features.map((feature, index) => (
          <div
            key={feature.headline}
            className={cn(
              "max-w-sm mx-auto sm:max-w-full flex justify-between items-center flex-col sm:flex-row gap-y-2 gap-x-10 bg-gradient-to-br from-secondary/70 via-primary/10 to-secondary/20 rounded-xl",
              index & 1 && "sm:flex-row-reverse"
            )}
          >
            <Image
              src={
                currentTheme === "light"
                  ? feature.imgSrcLight
                  : feature.imgSrcDark
              }
              alt={feature.headline}
              height={400}
              width={400}
              className="border-2 rounded-xl"
            />
            <div
              className={cn(
                "max-w-sm space-y-1 sm:space-y-3 px-4 sm:px-7 py-4",
                index & 1 ? "sm:pr-0" : "sm:pl-0"
              )}
            >
              <h4 className="text-xl font-semibold">{feature.headline}</h4>
              <p className="text-muted-foreground">{feature.subHeadline}</p>
              {index === 1 && (
                <p className="italic text-muted-foreground">
                  Note: The scheduling feature is currently unavailable due to
                  financial constraints, as it requires resources for execution
                  on a schedule.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* hidden lg:flex */}
      <div className="w-full max-w-5xl hidden lg:flex justify-center items-center gap-x-10">
        <Accordion type="single" collapsible className="w-80">
          {features.map((feature, index) => (
            <AccordionItem
              key={index}
              value={`feature-${index}`}
              onClick={() => setFeatureIndex(index)}
            >
              <AccordionTrigger className="text-[17px] font-semibold">
                {feature.headline}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] text-muted-foreground">
                {feature.subHeadline}
                {index === 1 && (
                  <p className="italic mt-2">
                    <strong>Note:</strong> The scheduling feature is currently
                    unavailable due to financial constraints, as it requires
                    resources for execution on a schedule.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Image
          src={
            currentTheme === "light"
              ? features[featureIndex].imgSrcLight
              : features[featureIndex].imgSrcDark
          }
          alt={features[featureIndex].headline}
          height={600}
          width={600}
          className="border-2 rounded-xl"
        />
      </div>
    </div>
  );
}
