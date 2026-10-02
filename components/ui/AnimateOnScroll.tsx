"use client";

import React, { useRef, useEffect, useState } from "react";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  /** Animation variant */
  animation?: "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scaleIn";
  /** Delay in ms before animation triggers */
  delay?: number;
  /** Threshold for IntersectionObserver (0–1) */
  threshold?: number;
  /** Whether to animate only once */
  once?: boolean;
  /** HTML tag to render */
  as?: "div" | "section" | "article" | "aside" | "header" | "footer" | "span" | "p";
}

const ANIMATION_CLASSES: Record<string, { initial: string; animate: string }> = {
  fadeUp: {
    initial: "opacity-0 translate-y-6",
    animate: "opacity-100 translate-y-0",
  },
  fadeIn: {
    initial: "opacity-0",
    animate: "opacity-100",
  },
  slideLeft: {
    initial: "opacity-0 -translate-x-8",
    animate: "opacity-100 translate-x-0",
  },
  slideRight: {
    initial: "opacity-0 translate-x-8",
    animate: "opacity-100 translate-x-0",
  },
  scaleIn: {
    initial: "opacity-0 scale-90",
    animate: "opacity-100 scale-100",
  },
};

export function AnimateOnScroll({
  children,
  className = "",
  animation = "fadeUp",
  delay = 0,
  threshold = 0.15,
  once = true,
  as: Tag = "div",
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  const { initial, animate } = ANIMATION_CLASSES[animation] || ANIMATION_CLASSES.fadeUp;
  const Comp = Tag as React.ElementType;

  return (
    <Comp
      ref={ref}
      className={`transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? animate : initial
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Comp>
  );
}

/**
 * Hook to detect if an element is in viewport.
 * Usage: const [ref, isVisible] = useInView({ threshold: 0.1, once: true });
 */
export function useInView(options: { threshold?: number; once?: boolean; rootMargin?: string } = {}) {
  const { threshold = 0.15, once = true, rootMargin = "0px 0px -40px 0px" } = options;
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once, rootMargin]);

  return [ref, isVisible] as const;
}
