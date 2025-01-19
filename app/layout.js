import "./globals.css";
import { Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { AppProviders } from "@/components/providers/AppProviders";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Scrapel - Build Web Scrapers Visually",
  description:
    "Create, manage, and execute web scrapers effortlessly with Scrapel's intuitive drag-and-drop workflow builder.",
  keywords:
    "web scraping, automation, workflow builder, AI, Scrapel, demo workflow, manual execution",
  url: "https://scrapel.vercel.app/",
  canonical: "https://scrapel.vercel.app/",
  robots: "index, follow",
  author: "Ujjwal",
  publisher: "Ujjwal",
  lang: "en",
  openGraph: {
    title: "Scrapel - Build Web Scrapers Visually",
    description:
      "Create, manage, and execute web scrapers effortlessly with Scrapel's intuitive drag-and-drop workflow builder.",
    url: "https://scrapel.vercel.app/",
    images: [
      {
        url: "/card.png",
        width: 1200,
        height: 630,
        alt: "Scrapel - Web Scraping Made Easy",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@scrapel",
    title: "Scrapel - Build Web Scrapers Visually",
    description:
      "Create, manage, and execute web scrapers effortlessly with Scrapel's intuitive drag-and-drop workflow builder.",
    image: "/card.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      afterSignOutUrl="/sign-in"
      appearance={{
        elements: {
          formButtonPrimary: "bg-primary hover:bg-primary/90",
          avatarBox: "rounded-sm",
          userButtonTrigger: "rounded-sm",
          userButtonPopoverFooter: "hidden",
        },
      }}
    >
      <html lang="en">
        <body className={outfit.variable}>
          <AppProviders>
            {children}
            <Toaster richColors />
            <Analytics />
          </AppProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
