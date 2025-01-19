export const dynamic = "force-dynamic";
import { setupUser } from "@/actions/user/setupUser";
import { ErrorAlert } from "@/components/ErrorAlert";
import { Logo } from "@/components/Logo";
import { Separator } from "@/components/ui/separator";

export function generateMetadata() {
  return {
    title: "Setup Your Account - Scrapel | Start Building Your Web Scrapers",
    description:
      "Set up your account with default credits and start building your first web scraper effortlessly. Get started with Scrapel's intuitive workflow builder.",
  };
}

export default async function SetupPage() {
  const response = await setupUser();

  if (response?.errorMessage)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <Logo iconSize={50} fontSize="text-4xl" />
        <Separator className="max-w-xs" />
        <div className="max-w-xs">
          <ErrorAlert message={response?.errorMessage} />
        </div>
      </div>
    );
}
