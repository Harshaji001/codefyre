import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Flame } from "lucide-react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import AuthModal from "@/components/AuthModal";
import ProfileDropdown from "@/components/ProfileDropdown";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading } = useFirebaseAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#process", label: "Process" },
    { href: "#contact", label: "Contact" },
  ];

  const handleStartProject = () => {
    setIsAuthModalOpen(true);
  };

  const handleSignIn = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Flame className="w-8 h-8 text-primary transition-all group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:bg-primary/50 transition-all" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Code<span className="text-gradient">Fyre</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA Button or Profile */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              ) : user ? (
                <ProfileDropdown user={user} />
              ) : (
                <>
                  <Button variant="ghost" onClick={handleSignIn}>
                    Sign In
                  </Button>
                  <Button variant="hero" size="default" onClick={handleStartProject}>
                    Start Your Project
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors py-2 text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                {loading ? (
                  <div className="h-10 w-24 rounded bg-muted animate-pulse" />
                ) : user ? (
                  <div className="flex items-center gap-3 py-2">
                    <ProfileDropdown user={user} />
                    <span className="text-sm text-muted-foreground">{user.displayName || user.email}</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    <Button variant="ghost" onClick={handleSignIn}>
                      Sign In
                    </Button>
                    <Button variant="hero" onClick={handleStartProject}>
                      Start Your Project
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
