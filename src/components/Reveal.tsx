import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  /** Schwelle, ab der ausgelöst wird (0..1). Default 0.15. */
  threshold?: number;
  /** Versatz nach unten in px (translate-y vor dem Einblenden). Default 16. */
  offsetY?: number;
}

/**
 * Blendet Inhalte einmalig ein, sobald sie in den Viewport scrollen.
 * Respektiert prefers-reduced-motion.
 */
export function Reveal({
  children,
  delayMs = 0,
  className,
  threshold = 0.15,
  offsetY = 16,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const style: CSSProperties = {
    transitionDelay: visible ? `${delayMs}ms` : "0ms",
    transform: visible ? "translateY(0)" : `translateY(${offsetY}px)`,
    opacity: visible ? 1 : 0,
    willChange: "opacity, transform",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className ?? ""}`}
      style={style}
    >
      {children}
    </div>
  );
}
