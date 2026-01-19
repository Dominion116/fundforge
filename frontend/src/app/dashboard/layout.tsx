import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Your Dashboard",
  description: "Manage your campaigns and track your contributions on FundForge.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="pt-20 flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}
