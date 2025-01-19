import { CallToAction } from "./_components/CallToAction";
import { Features } from "./_components/Features";
import { Footer } from "./_components/Footer";
import { Hero } from "./_components/Hero";
import { HowItWorks } from "./_components/HowItWorks";
import { Navbar } from "./_components/Navbar";
import { Pricing } from "./_components/Pricing";
import ScrollProgress from "@/components/ui/scroll-progress";

export default function LandingPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CallToAction />
      <Footer />
    </>
  );
}
