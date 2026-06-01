import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

/**
 * Mobile-only Sticky-Button "Termin vereinbaren" links unten.
 * Erscheint, sobald spürbar gescrollt wurde, mit einmaligem Soft-Pulse.
 * Bleibt vom Kontakt-Anker an ausgeblendet, um Form-Eingaben nicht zu überdecken.
 */
export function MobileStickyCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const scrolled = window.scrollY > 480;
      const contactEl = document.getElementById("kontakt");
      const nearContact =
        contactEl != null &&
        contactEl.getBoundingClientRect().top < window.innerHeight - 60;
      setShow(scrolled && !nearContact);
      raf = 0;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToContact = () => {
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToContact}
      aria-label="Termin vereinbaren"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`md:hidden fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full bg-[#6B4F3A] px-4 py-3 text-white shadow-2xl shadow-black/40 transition-all duration-500 ease-out hover:bg-[#5A4230] focus:outline-none focus:ring-2 focus:ring-[#C2A878] ${
        show
          ? "translate-y-0 opacity-100 animate-cta-pulse"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <CalendarDays className="h-5 w-5" />
      <span className="text-sm font-medium">Termin</span>
    </button>
  );
}
