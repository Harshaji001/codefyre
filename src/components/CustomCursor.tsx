import { useEffect, useState, useRef } from "react";

interface CursorPosition {
  x: number;
  y: number;
}

interface TrailDot {
  x: number;
  y: number;
  id: number;
}

const CustomCursor = () => {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const trailIdRef = useRef(0);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Add new trail dot
      trailIdRef.current += 1;
      const newDot: TrailDot = {
        x: e.clientX,
        y: e.clientY,
        id: trailIdRef.current,
      };

      setTrail((prev) => [...prev.slice(-12), newDot]);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", updateCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updateCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  // Clean up old trail dots
  useEffect(() => {
    const cleanup = setInterval(() => {
      setTrail((prev) => prev.slice(-8));
    }, 50);
    return () => clearInterval(cleanup);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Hide default cursor globally */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Trail dots */}
      {trail.map((dot, index) => {
        const opacity = (index + 1) / trail.length * 0.6;
        const scale = (index + 1) / trail.length * 0.8;
        return (
          <div
            key={dot.id}
            className="fixed pointer-events-none z-[9998] rounded-full"
            style={{
              left: dot.x,
              top: dot.y,
              width: `${8 * scale}px`,
              height: `${8 * scale}px`,
              transform: "translate(-50%, -50%)",
              background: `linear-gradient(135deg, hsl(var(--primary) / ${opacity}), hsl(var(--neon-cyan) / ${opacity}))`,
              boxShadow: `0 0 ${6 * scale}px hsl(var(--primary) / ${opacity * 0.5})`,
              transition: "opacity 0.1s ease-out",
            }}
          />
        );
      })}

      {/* Main cursor */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Outer ring */}
        <div
          className={`absolute rounded-full border-2 transition-all duration-150 ${
            isClicking ? "scale-75" : "scale-100"
          }`}
          style={{
            width: "32px",
            height: "32px",
            borderColor: "hsl(var(--primary))",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 10px hsl(var(--primary) / 0.5), 0 0 20px hsl(var(--primary) / 0.3)",
          }}
        />
        {/* Inner dot */}
        <div
          className={`absolute rounded-full transition-all duration-150 ${
            isClicking ? "scale-150" : "scale-100"
          }`}
          style={{
            width: "8px",
            height: "8px",
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--neon-cyan)))",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 8px hsl(var(--primary)), 0 0 16px hsl(var(--neon-cyan) / 0.5)",
          }}
        />
      </div>
    </>
  );
};

export default CustomCursor;