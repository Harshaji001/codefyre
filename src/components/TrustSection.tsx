import { Shield, Zap, Code2, Lock } from "lucide-react";

const trustPoints = [
  {
    icon: Code2,
    title: "Clean, Scalable Code",
    description: "Every line is written with precision. No spaghetti, no shortcuts—just clean, maintainable code that grows with your business.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Performance",
    description: "Speed matters. We optimize every pixel and millisecond to ensure your digital products load instantly and run smoothly.",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "Your data and your users' data are sacred. We implement robust security measures that keep threats at bay.",
  },
  {
    icon: Lock,
    title: "Future-Proof Solutions",
    description: "Technology evolves. We build with tomorrow in mind, ensuring your investment stays relevant for years to come.",
  },
];

const TrustSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-dark" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Why Trust Us</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Built on a Foundation of{" "}
            <span className="text-gradient">Excellence</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We're not just developers—we're craftsmen who take pride in building digital experiences 
            that stand the test of time.
          </p>
        </div>

        {/* Trust Points Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point, index) => (
            <div
              key={point.title}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <point.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">{point.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
