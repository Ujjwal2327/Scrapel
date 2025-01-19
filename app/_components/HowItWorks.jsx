import { ChartNoAxesCombined, Layers2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function HowItWorks() {
  const steps = [
    {
      headline: "Build Your Workflow",
      subHeadline: "Drag and drop tasks to create your custom scraper.",
      icon: Layers2,
    },
    {
      headline: "Execute or Schedule",
      subHeadline:
        "Run scrapers manually or set up schedules for hands-free automation.",
      icon: Play,
    },
    {
      headline: "Monitor Execution",
      subHeadline:
        "Monitor workflow progress in real time and access execution outputs or errors instantly as they occur.",
      icon: ChartNoAxesCombined,
    },
  ];

  return (
    <div
      id="how-it-works"
      className="flex flex-col items-center gap-y-8 py-16 sm:py-20 px-7 "
    >
      <h2 className="text-3xl sm:text-5xl font-bold text-balance max-w-2xl text-center">
        How Scrapel Works
      </h2>

      <div className="w-full max-w-4xl grid sm:grid-cols-3 gap-7">
        {steps.map(({ icon: Icon, ...step }, index) => (
          <div
            key={step.headline}
            className={cn(
              "max-w-sm mx-auto flex flex-col gap-y-3 text-center border-2 border-green-800 rounded-lg p-3",
              index & 1 && "border-2 border-green-700"
            )}
          >
            <div className="h-14 w-14 p-3 rounded-full bg-primary flex items-center justify-center mx-auto">
              <Icon className="stroke-white" />
            </div>
            <h4 className="text-xl font-semibold">
              {index + 1}. {step.headline}
            </h4>
            <p className="text-balance text-muted-foreground">
              {step.subHeadline}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
