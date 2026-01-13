import { Globe, Smartphone, Settings, Palette, Server, LayoutDashboard } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const services = [
  {
    icon: Globe,
    title: "Website Development",
    problem: "Your current website isn't converting visitors into customers.",
    solution: "We create stunning, high-performance websites that captivate visitors and turn them into loyal customers. From landing pages to complex e-commerce platforms.",
    value: "Higher conversions, stronger brand presence, and a website that works 24/7 as your best salesperson.",
    color: "primary",
  },
  {
    icon: LayoutDashboard,
    title: "Web Applications & Dashboards",
    problem: "Your business processes are scattered across multiple tools.",
    solution: "Custom web applications that streamline your operations, from admin dashboards to customer portals and internal tools.",
    value: "Save hours daily, reduce errors, and gain real-time insights into your business.",
    color: "secondary",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    problem: "You're missing out on the mobile-first audience.",
    solution: "Native and cross-platform mobile apps that deliver seamless experiences on iOS and Android.",
    value: "Reach customers wherever they are, increase engagement, and build lasting relationships.",
    color: "accent",
  },
  {
    icon: Settings,
    title: "Custom Software Solutions",
    problem: "Off-the-shelf software doesn't fit your unique needs.",
    solution: "Bespoke software tailored to your exact requirements, automating workflows and solving complex business challenges.",
    value: "Competitive advantage through technology that's built specifically for how you work.",
    color: "primary",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    problem: "Users find your product confusing or frustrating.",
    solution: "Research-driven design that puts users first, creating intuitive interfaces that delight and engage.",
    value: "Higher user satisfaction, reduced support costs, and products people love to use.",
    color: "secondary",
  },
  {
    icon: Server,
    title: "API & Backend Development",
    problem: "Your systems don't talk to each other efficiently.",
    solution: "Robust APIs and backend systems that power your applications, integrate services, and handle scale with ease.",
    value: "Seamless integrations, reliable performance, and infrastructure that grows with you.",
    color: "accent",
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const directions = ["left", "right", "bottom", "top"] as const;
  const direction = directions[index % 4];
  const { ref, animationClasses } = useScrollAnimation({ direction, threshold: 0.1 });

  const getColorClass = (color: string, type: "bg" | "text" | "border") => {
    const colors = {
      primary: {
        bg: "bg-primary/10 group-hover:bg-primary/20",
        text: "text-primary",
        border: "hover:border-primary/50",
      },
      secondary: {
        bg: "bg-secondary/10 group-hover:bg-secondary/20",
        text: "text-secondary",
        border: "hover:border-secondary/50",
      },
      accent: {
        bg: "bg-accent/10 group-hover:bg-accent/20",
        text: "text-accent",
        border: "hover:border-accent/50",
      },
    };
    return colors[color as keyof typeof colors][type];
  };

  return (
    <div
      ref={ref}
      className={`group p-8 rounded-2xl bg-card border border-border transition-all duration-300 hover:-translate-y-2 ${getColorClass(service.color, "border")} ${animationClasses}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`w-16 h-16 rounded-2xl ${getColorClass(service.color, "bg")} flex items-center justify-center mb-6 transition-colors`}>
        <service.icon className={`w-8 h-8 ${getColorClass(service.color, "text")}`} />
      </div>
      <h3 className="text-xl font-bold mb-4 text-foreground">{service.title}</h3>
      <div className="mb-4">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">The Problem</span>
        <p className="text-sm text-muted-foreground mt-1">{service.problem}</p>
      </div>
      <div className="mb-4">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Our Solution</span>
        <p className="text-sm text-foreground/80 mt-1">{service.solution}</p>
      </div>
      <div className="pt-4 border-t border-border">
        <span className={`text-sm font-semibold ${getColorClass(service.color, "text")}`}>
          → {service.value}
        </span>
      </div>
    </div>
  );
};

const ServicesSection = () => {
  const { ref: headerRef, animationClasses: headerClasses } = useScrollAnimation({ direction: "top" });

  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div ref={headerRef} className={`text-center max-w-3xl mx-auto mb-16 ${headerClasses}`}>
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Our Services</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-6">
            Everything You Need to{" "}
            <span className="text-gradient">Dominate Digital</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From concept to launch and beyond, we provide end-to-end digital solutions 
            that transform your ideas into powerful, revenue-generating products.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
