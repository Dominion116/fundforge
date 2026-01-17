import { Navbar } from "@/components/Navbar";
import Hero from "@/components/hero";
import LogoCloud from "@/components/logo-cloud";
import { Features } from "@/components/landing/Features";
import { CampaignsPreview } from "@/components/landing/CampaignsPreview";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <Hero />
      <LogoCloud />
      <Features />
      <CampaignsPreview />
      <HowItWorks />
      <Footer />
    </main>
  );
}
