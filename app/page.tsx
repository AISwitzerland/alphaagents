import { Navbar } from '@/components/ui/Navbar';
import { HeroSection } from '@/components/ui/HeroSection';
import { FeaturesSection } from '@/components/ui/FeaturesSection';
import { ProcessSection } from '@/components/ui/ProcessSection';
import { CTASection } from '@/components/ui/CTASection';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ProcessSection />
      <CTASection />
      <ChatInterface />
    </main>
  );
} 