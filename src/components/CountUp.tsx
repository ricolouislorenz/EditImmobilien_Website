import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  to: number;
  from?: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  /** Gruppentrennzeichen verwenden (z. B. 1.234). */
  formatThousands?: boolean;
  className?: string;
}

/**
 * Zählt eine Zahl hoch, sobald das Element in den Viewport kommt.
 * Respektiert prefers-reduced-motion.
 */
export function CountUp({
  to,
  from = 0,
  durationMs = 1400,
  prefix = "",
  suffix = "",
  formatThousands = false,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const animatedRef = useRef(false);
  const [value, setValue] = useState(from);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(to);
      return;
    }

    let raf = 0;
    let started = 0;

    const tick = (ts: number) => {
      if (!started) started = ts;
      const elapsed = ts - started;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          raf = requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [from, to, durationMs]);

  const display = formatThousands ? value.toLocaleString("de-DE") : String(value);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
