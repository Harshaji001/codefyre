import { ArrowUpRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const projects = [
  {
    title: "E-Commerce Platform",
    category: "Web Application",
    description: "A full-featured e-commerce platform with real-time inventory, payment processing, and admin dashboard.",
    outcomes: ["200% increase in sales", "50ms page load time", "99.9% uptime"],
    gradient: "from-primary to-secondary",
  },
  {
    title: "FinTech Dashboard",
    category: "Web Application",
    description: "Comprehensive financial dashboard for tracking investments, analytics, and portfolio management.",
    outcomes: ["10K+ active users", "Real-time data sync", "Bank-grade security"],
    gradient: "from-secondary to-neon-blue",
  },
  {
    title: "Healthcare Mobile App",
    category: "Mobile Application",
    description: "Patient management app with appointment scheduling, telemedicine, and medical records access.",
    outcomes: ["50K+ downloads", "4.8★ rating", "HIPAA compliant"],
    gradient: "from-accent to-neon-orange",
  },
  {
    title: "SaaS Management Tool",
    category: "Custom Software",
    description: "Enterprise SaaS platform for project management, team collaboration, and resource planning.",
    outcomes: ["500+ companies", "3x productivity boost", "API integrations"],
    gradient: "from-neon-pink to-primary",
  },
];

const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  const directions = ["left", "right", "left", "right"] as const;
  const { ref, animationClasses } = useScrollAnimation({ direction: directions[index], threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`group relative rounded-3xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-500 ${animationClasses}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Gradient Background */}
      <div className={`h-48 bg-gradient-to-br ${project.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />

      {/* Content */}
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-primary font-semibold">{project.category}</span>
            <h3 className="text-2xl font-bold mt-2 text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary transition-colors">
            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
          </div>
        </div>

        <p className="text-muted-foreground mb-6">{project.description}</p>

        {/* Outcomes */}
        <div className="flex flex-wrap gap-3">
          {project.outcomes.map((outcome) => (
            <span
              key={outcome}
              className="px-3 py-1.5 text-sm rounded-full bg-muted/50 text-foreground border border-border"
            >
              {outcome}
            </span>
          ))}
        </div>
      </div>

      {/* Hover Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
    </div>
  );
};

const ProjectsSection = () => {
  const { ref: headerRef, animationClasses: headerClasses } = useScrollAnimation({ direction: "top" });

  return (
    <section id="work" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div ref={headerRef} className={`text-center max-w-3xl mx-auto mb-16 ${headerClasses}`}>
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Our Work</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Projects That{" "}
            <span className="text-gradient">Speak Results</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Every project we deliver is a testament to our commitment to excellence. 
            Here's a glimpse of the digital products we've brought to life.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
