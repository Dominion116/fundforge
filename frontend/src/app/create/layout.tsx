import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Start a Campaign",
  description: "Launch your project with milestone-based crowdfunding. Build trust with your contributors and deliver results.",
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="pt-20 flex-grow">
        <div className="relative z-10">
             {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
