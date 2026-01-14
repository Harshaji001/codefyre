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
  velocity: number;
}

const CustomCursor = () => {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  
  const trailIdRef = useRef(0);
  const rippleIdRef = useRef(0);
  const animationRef = useRef<number>();
  const lastPosition = useRef<CursorPosition>({ x: 0, y: 0 });
  const lastTrailTime = useRef(0);
  const velocityRef = useRef(0);

  // Smooth cursor following with lerp
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const animate = useCallback(() => {
    setPosition((prev) => ({
      x: lerp(prev.x, targetPosition.x, 0.12),
      y: lerp(prev.y, targetPosition.y, 0.12),
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
      const newPos = { x: e.clientX, y: e.clientY };
      setTargetPosition(newPos);
      setIsVisible(true);

      // Calculate velocity
      const dx = newPos.x - lastPosition.current.x;
      const dy = newPos.y - lastPosition.current.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);
      velocityRef.current = Math.min(velocity, 50);
      lastPosition.current = newPos;

      const now = Date.now();
      // Add trail dots at intervals
      if (now - lastTrailTime.current > 12) {
        lastTrailTime.current = now;
        trailIdRef.current += 1;
        const newDot: TrailDot = {
          x: e.clientX,
          y: e.clientY,
          id: trailIdRef.current,
          timestamp: now,
          velocity: velocityRef.current,
        };
        setTrail((prev) => [...prev.slice(-30), newDot]);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      // Add ripple effect on click
      rippleIdRef.current += 1;
      setRipples((prev) => [...prev, { x: e.clientX, y: e.clientY, id: rippleIdRef.current }]);
      setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 600);
    };
    
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
      setTrail((prev) => prev.filter((dot) => now - dot.timestamp < 500));
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

      {/* Click ripple effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-[9997] rounded-full animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "60px",
            height: "60px",
            transform: "translate(-50%, -50%)",
            border: "2px solid hsl(var(--primary) / 0.6)",
            animation: "ripple 0.6s ease-out forwards",
          }}
        />
      ))}

      {/* Trail dots with gradient fade and velocity-based sizing */}
      {trail.map((dot, index) => {
        const age = Date.now() - dot.timestamp;
        const maxAge = 500;
        const lifeRatio = Math.max(0, 1 - age / maxAge);
        const opacity = lifeRatio * 0.8;
        const velocityScale = 1 + (dot.velocity / 50) * 0.5;
        const scale = (0.2 + lifeRatio * 0.8) * velocityScale;
        const hueShift = (index * 3) % 30; // Subtle rainbow effect
        
        return (
          <div
            key={dot.id}
            className="fixed pointer-events-none z-[9998] rounded-full will-change-transform"
            style={{
              left: dot.x,
              top: dot.y,
              width: `${12 * scale}px`,
              height: `${12 * scale}px`,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, 
                hsl(calc(var(--primary-hue, 220) + ${hueShift}) 80% 60% / ${opacity}) 0%, 
                hsl(var(--primary) / ${opacity * 0.4}) 50%, 
                transparent 100%)`,
              filter: `blur(${(1 - lifeRatio) * 3}px)`,
              boxShadow: `0 0 ${10 * lifeRatio}px hsl(var(--primary) / ${opacity * 0.5})`,
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
        {/* Magnetic field effect when hovering */}
        {isHovering && (
          <div
            className="absolute rounded-full animate-pulse"
            style={{
              width: "64px",
              height: "64px",
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, 
                hsl(var(--primary) / 0.1) 0%, 
                hsl(var(--primary) / 0.05) 50%, 
                transparent 100%)`,
            }}
          />
        )}

        {/* Outer glow ring */}
        <div
          className="absolute rounded-full transition-all duration-200 ease-out"
          style={{
            width: isHovering ? "52px" : isClicking ? "20px" : "38px",
            height: isHovering ? "52px" : isClicking ? "20px" : "38px",
            border: `2px solid hsl(var(--primary) / ${isHovering ? 0.9 : isClicking ? 1 : 0.6})`,
            transform: "translate(-50%, -50%)",
            boxShadow: `
              0 0 ${isHovering ? 25 : 15}px hsl(var(--primary) / ${isHovering ? 0.5 : 0.4}),
              0 0 ${isHovering ? 50 : 30}px hsl(var(--primary) / ${isHovering ? 0.3 : 0.2}),
              inset 0 0 ${isHovering ? 15 : 10}px hsl(var(--primary) / 0.1)
            `,
            background: isHovering 
              ? "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)" 
              : isClicking 
                ? "hsl(var(--primary) / 0.3)"
                : "transparent",
          }}
        />

        {/* Secondary ring for depth */}
        <div
          className="absolute rounded-full transition-all duration-300 ease-out"
          style={{
            width: isHovering ? "40px" : isClicking ? "14px" : "26px",
            height: isHovering ? "40px" : isClicking ? "14px" : "26px",
            border: `1px solid hsl(var(--primary) / ${isHovering ? 0.5 : 0.3})`,
            transform: "translate(-50%, -50%)",
          }}
        />
        
        {/* Inner dot with glow */}
        <div
          className="absolute rounded-full transition-all duration-150 ease-out"
          style={{
            width: isClicking ? "14px" : isHovering ? "8px" : "6px",
            height: isClicking ? "14px" : isHovering ? "8px" : "6px",
            background: `radial-gradient(circle, 
              hsl(var(--primary-foreground)) 0%, 
              hsl(var(--primary)) 100%)`,
            transform: "translate(-50%, -50%)",
            boxShadow: `
              0 0 ${isClicking ? 20 : 10}px hsl(var(--primary)),
              0 0 ${isClicking ? 40 : 20}px hsl(var(--primary) / 0.6),
              0 0 ${isClicking ? 60 : 30}px hsl(var(--primary) / 0.3)
            `,
          }}
        />

        {/* Plus sign indicator when hovering clickable elements */}
        {isHovering && !isClicking && (
          <>
            <div
              className="absolute bg-primary transition-all duration-200"
              style={{
                width: "1px",
                height: "12px",
                transform: "translate(-50%, -50%)",
                opacity: 0.8,
              }}
            />
            <div
              className="absolute bg-primary transition-all duration-200"
              style={{
                width: "12px",
                height: "1px",
                transform: "translate(-50%, -50%)",
                opacity: 0.8,
              }}
            />
          </>
        )}
      </div>

      {/* Custom ripple animation */}
      <style>{`
        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;