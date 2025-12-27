import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();

  const handleStartProject = () => {
    navigate("/auth");
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-8 animate-float">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Have an idea?{" "}
            <span className="text-gradient">Let's turn it into something powerful.</span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Whether you're a startup with a vision or an established business ready to level up, 
            we're here to make it happen. Let's build something extraordinary together.
          </p>

          {/* CTA Button */}
          <Button variant="hero" size="xl" className="group" onClick={handleStartProject}>
            Start Your Project Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Trust Note */}
          <p className="mt-8 text-sm text-muted-foreground">
            Free consultation • No commitment required • Response within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
