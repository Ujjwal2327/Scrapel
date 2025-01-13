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
  title: "Create Next App",
  description: "Generated by create next app",
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
