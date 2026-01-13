import { Sparkles, MessageSquare, TrendingUp, HeartHandshake } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const reasons = [
  {
    icon: Sparkles,
    title: "100% Custom-Built Solutions",
    description: "No templates, no shortcuts. Every project is crafted from scratch to match your unique vision and requirements. Your business deserves something as unique as you are.",
    highlight: "Zero templates",
  },
  {
    icon: MessageSquare,
    title: "Transparent Communication",
    description: "No ghosting, no jargon. We keep you in the loop with regular updates, clear explanations, and honest timelines. You'll always know exactly where your project stands.",
    highlight: "Weekly updates",
  },
  {
    icon: TrendingUp,
    title: "Performance & Scalability Focus",
    description: "We build for today and tomorrow. Your product will be fast, optimized, and ready to handle growth—whether that's 100 users or 100,000.",
    highlight: "Built to scale",
  },
  {
    icon: HeartHandshake,
    title: "Long-Term Partnership",
    description: "Our relationship doesn't end at launch. We provide ongoing support, maintenance, and evolution to ensure your digital products stay ahead of the curve.",
    highlight: "Lifetime support",
  },
];

const ReasonCard = ({ reason, index }: { reason: typeof reasons[0]; index: number }) => {
  const { ref, animationClasses } = useScrollAnimation({ direction: "right", threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`group flex gap-5 p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 ${animationClasses}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <reason.icon className="w-7 h-7 text-primary" />
      </div>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-semibold text-foreground">{reason.title}</h3>
          <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium">
            {reason.highlight}
          </span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">{reason.description}</p>
      </div>
    </div>
  );
};

const WhyChooseSection = () => {
  const { ref: leftRef, animationClasses: leftClasses } = useScrollAnimation({ direction: "left" });
  const { ref: statsRef, animationClasses: statsClasses } = useScrollAnimation({ direction: "bottom" });

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div ref={leftRef} className={leftClasses}>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
              We're Not Your Average{" "}
              <span className="text-gradient">Tech Agency</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              In a world of cookie-cutter solutions and unreliable freelancers, we stand apart. 
              We combine startup agility with enterprise-quality delivery to give you the best of both worlds.
            </p>

            {/* Stats */}
            <div ref={statsRef} className={`grid grid-cols-3 gap-6 ${statsClasses}`}>
              <div className="text-center p-4 rounded-xl bg-card border border-border">
                <div className="text-3xl font-bold text-primary">3+</div>
                <div className="text-xs text-muted-foreground mt-1">Years Experience</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card border border-border">
                <div className="text-3xl font-bold text-secondary">50+</div>
                <div className="text-xs text-muted-foreground mt-1">Projects Completed</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card border border-border">
                <div className="text-3xl font-bold text-accent">98%</div>
                <div className="text-xs text-muted-foreground mt-1">Client Retention</div>
              </div>
            </div>
          </div>

          {/* Right Content - Reasons */}
          <div className="space-y-6">
            {reasons.map((reason, index) => (
              <ReasonCard key={reason.title} reason={reason} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
