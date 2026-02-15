import Header from '@/react-app/components/Header';
import Hero from '@/react-app/components/Hero';
import Features from '@/react-app/components/Features';
import HowItWorks from '@/react-app/components/HowItWorks';
import Pricing from '@/react-app/components/Pricing';
import Footer from '@/react-app/components/Footer';
import FloatingElements from '@/react-app/components/FloatingElements';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 overflow-hidden">
      <FloatingElements />
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
}
