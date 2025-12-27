import { Search, FileText, Paintbrush, TestTube, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discovery & Strategy",
    description: "We dive deep into your business, goals, and target audience. Through detailed discussions and research, we understand exactly what success looks like for you.",
    deliverables: ["Business analysis", "Competitor research", "Technical requirements"],
  },
  {
    number: "02",
    icon: FileText,
    title: "Planning & Architecture",
    description: "We create a comprehensive roadmap with clear milestones, timelines, and deliverables. No surprises—you'll know exactly what to expect and when.",
    deliverables: ["Project timeline", "Technical architecture", "Feature prioritization"],
  },
  {
    number: "03",
    icon: Paintbrush,
    title: "Design & Development",
    description: "Our designers and developers work in sync to bring your vision to life. You'll see regular previews and have opportunities to provide feedback at every stage.",
    deliverables: ["UI/UX designs", "Frontend development", "Backend integration"],
  },
  {
    number: "04",
    icon: TestTube,
    title: "Testing & Refinement",
    description: "Rigorous testing across devices, browsers, and scenarios ensures your product is bulletproof. We fix issues before they become problems.",
    deliverables: ["Quality assurance", "Performance testing", "Security audit"],
  },
  {
    number: "05",
    icon: Rocket,
    title: "Launch & Support",
    description: "We don't just launch and leave. We ensure a smooth go-live, monitor for issues, and provide ongoing support to keep your product thriving.",
    deliverables: ["Deployment", "Monitoring setup", "Ongoing maintenance"],
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Our Process</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            From Idea to Impact in{" "}
            <span className="text-gradient">5 Simple Steps</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our proven process ensures every project is delivered on time, on budget, 
            and exceeds expectations. Here's how we turn your vision into reality.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-primary via-secondary to-accent hidden lg:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex flex-col lg:flex-row gap-8 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content Card */}
                <div className={`flex-1 ${index % 2 === 1 ? "lg:text-right" : ""}`}>
                  <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300">
                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                      <span className="text-5xl font-bold text-muted/50">{step.number}</span>
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <step.icon className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <div className={`flex flex-wrap gap-2 ${index % 2 === 1 ? "lg:justify-end" : ""}`}>
                      {step.deliverables.map((deliverable) => (
                        <span
                          key={deliverable}
                          className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                        >
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center Node */}
                <div className="hidden lg:flex w-16 h-16 rounded-full bg-card border-4 border-primary items-center justify-center z-10">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Spacer */}
                <div className="flex-1 hidden lg:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
