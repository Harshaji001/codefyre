import { useEffect, useRef, useState } from "react";

type AnimationDirection = "left" | "right" | "top" | "bottom";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  direction?: AnimationDirection;
}

export const useScrollAnimation = ({
  threshold = 0.1,
  rootMargin = "0px",
  direction = "bottom",
}: UseScrollAnimationOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);

  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-700 ease-out";
    
    if (isVisible) {
      return `${baseClasses} opacity-100 translate-x-0 translate-y-0`;
    }

    switch (direction) {
      case "left":
        return `${baseClasses} opacity-0 -translate-x-16`;
      case "right":
        return `${baseClasses} opacity-0 translate-x-16`;
      case "top":
        return `${baseClasses} opacity-0 -translate-y-16`;
      case "bottom":
      default:
        return `${baseClasses} opacity-0 translate-y-16`;
    }
  };

  return { ref, isVisible, animationClasses: getAnimationClasses() };
};
