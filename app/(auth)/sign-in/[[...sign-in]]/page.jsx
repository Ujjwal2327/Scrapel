import { SignIn } from "@clerk/nextjs";

export function generateMetadata() {
  return {
    title: "Sign In - Scrapel | Access Your Web Scraping Workflows",
    description:
      "Sign in to your Scrapel account to manage your web scraping workflows, track progress, and automate tasks with ease.",
  };
}

export default function Page() {
  return <SignIn />;
}
