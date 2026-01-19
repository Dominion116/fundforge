import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/landing/Footer';
import { BackgroundPattern } from '@/components/background-pattern';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Explore Campaigns",
  description: "Discover and fund groundbreaking projects built by the community. Back projects with confidence using milestone-based funding.",
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="pt-20 flex-grow">
        <BackgroundPattern />
        <div className="relative z-10">
             {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
