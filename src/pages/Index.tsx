import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustSection from "@/components/TrustSection";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import ProcessSection from "@/components/ProcessSection";
import ProjectsSection from "@/components/ProjectsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleStartProject = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>CodeFyre | Premium Web & App Development Agency India</title>
        <meta
          name="description"
          content="CodeFyre is a premium digital agency in India specializing in website development, web applications, mobile apps, and custom software solutions. We build digital powerhouses for startups and businesses."
        />
        <meta
          name="keywords"
          content="web development, app development, software agency, India, startup, mobile apps, UI/UX design, custom software"
        />
        <meta property="og:title" content="CodeFyre | Premium Web & App Development Agency India" />
        <meta
          property="og:description"
          content="We don't just build websites, we build digital powerhouses. Transform your ideas into powerful, revenue-generating digital products."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://codefyre.com" />
      </Helmet>

      <main className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <HeroSection onStartProject={handleStartProject} />
        <TrustSection />
        <ServicesSection />
        <WhyChooseSection />
        <ProcessSection />
        <ProjectsSection />
        <CTASection onStartProject={handleStartProject} />
        <Footer />
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Index;