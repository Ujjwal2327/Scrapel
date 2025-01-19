import { SignUp } from "@clerk/nextjs";

export function generateMetadata() {
  return {
    title: "Sign Up - Scrapel | Create Your Account to Build Web Scrapers",
    description:
      "Sign up for Scrapel to start building, automating, and managing your web scraping workflows with ease. Join the Scrapel community today!",
  };
}

export default function Page() {
  return <SignUp />;
}
