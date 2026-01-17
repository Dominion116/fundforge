import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/landing/Footer';
import { BackgroundPattern } from '@/components/background-pattern';

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
