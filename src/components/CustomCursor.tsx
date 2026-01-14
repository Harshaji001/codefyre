import { useEffect, useState, useRef, useCallback } from "react";

interface CursorPosition {
  x: number;
  y: number;
}

interface TrailDot {
  x: number;
  y: number;
  id: number;
  timestamp: number;
}

const CustomCursor = () => {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const trailIdRef = useRef(0);
  const animationRef = useRef<number>();
  const lastTrailTime = useRef(0);

  // Smooth cursor following with lerp
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const animate = useCallback(() => {
    setPosition((prev) => ({
      x: lerp(prev.x, targetPosition.x, 0.15),
      y: lerp(prev.y, targetPosition.y, 0.15),
    }));
    animationRef.current = requestAnimationFrame(animate);
  }, [targetPosition]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setTargetPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const now = Date.now();
      // Add trail dots at intervals for smoother effect
      if (now - lastTrailTime.current > 16) {
        lastTrailTime.current = now;
        trailIdRef.current += 1;
        const newDot: TrailDot = {
          x: e.clientX,
          y: e.clientY,
          id: trailIdRef.current,
          timestamp: now,
        };
        setTrail((prev) => [...prev.slice(-20), newDot]);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Detect hoverable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.matches('a, button, [role="button"], input, textarea, select, [tabindex]:not([tabindex="-1"])');
      setIsHovering(isClickable);
    };

    window.addEventListener("mousemove", updateCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updateCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  // Clean up old trail dots based on age
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setTrail((prev) => prev.filter((dot) => now - dot.timestamp < 400));
    }, 30);
    return () => clearInterval(cleanup);
  }, []);

  // Don't show on touch devices
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Hide default cursor globally */}
      <style>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Trail dots with gradient fade */}
      {trail.map((dot, index) => {
        const age = Date.now() - dot.timestamp;
        const maxAge = 400;
        const lifeRatio = Math.max(0, 1 - age / maxAge);
        const opacity = lifeRatio * 0.7;
        const scale = 0.3 + lifeRatio * 0.7;
        
        return (
          <div
            key={dot.id}
            className="fixed pointer-events-none z-[9998] rounded-full will-change-transform"
            style={{
              left: dot.x,
              top: dot.y,
              width: `${10 * scale}px`,
              height: `${10 * scale}px`,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, hsl(var(--primary) / ${opacity}) 0%, hsl(var(--primary) / ${opacity * 0.3}) 70%, transparent 100%)`,
              filter: `blur(${(1 - lifeRatio) * 2}px)`,
            }}
          />
        );
      })}

      {/* Main cursor container */}
      <div
        className="fixed pointer-events-none z-[9999] will-change-transform"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Outer glow ring */}
        <div
          className="absolute rounded-full transition-all duration-200 ease-out"
          style={{
            width: isHovering ? "48px" : isClicking ? "24px" : "36px",
            height: isHovering ? "48px" : isClicking ? "24px" : "36px",
            border: `2px solid hsl(var(--primary) / ${isHovering ? 0.8 : 0.5})`,
            transform: "translate(-50%, -50%)",
            boxShadow: `
              0 0 15px hsl(var(--primary) / 0.4),
              0 0 30px hsl(var(--primary) / 0.2),
              inset 0 0 10px hsl(var(--primary) / 0.1)
            `,
            background: isHovering ? "hsl(var(--primary) / 0.1)" : "transparent",
          }}
        />
        
        {/* Inner dot */}
        <div
          className="absolute rounded-full transition-all duration-150 ease-out"
          style={{
            width: isClicking ? "12px" : "6px",
            height: isClicking ? "12px" : "6px",
            background: "hsl(var(--primary))",
            transform: "translate(-50%, -50%)",
            boxShadow: `
              0 0 10px hsl(var(--primary)),
              0 0 20px hsl(var(--primary) / 0.6),
              0 0 30px hsl(var(--primary) / 0.3)
            `,
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;