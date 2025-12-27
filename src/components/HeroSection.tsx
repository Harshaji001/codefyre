import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 backdrop-blur-sm animate-slide-up">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Young. Skilled. Unstoppable.</span>
          </div>

          {/* Headline */}
          <h1 
            className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            We build websites, apps & software that make businesses{" "}
            <span className="text-gradient glow-text">unstoppable.</span>
          </h1>

          {/* Subheadline */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            We don't just build websites, we build digital powerhouses. From startups to established brands, 
            we craft custom solutions that drive growth and deliver results.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button variant="hero" size="xl" asChild>
              <a href="#contact">
                Get Your Project Started
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#work">
                <Play className="w-5 h-5" />
                View Our Work
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div 
            className="pt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">50+</span>
              </div>
              <span className="text-sm">Projects Delivered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-2xl font-bold text-secondary">100%</span>
              </div>
              <span className="text-sm">Client Satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-2xl font-bold text-accent">24/7</span>
              </div>
              <span className="text-sm">Support Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
