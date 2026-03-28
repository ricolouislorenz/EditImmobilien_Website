import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface Testimonial {
  name: string;
  text: string;
  rating: number;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Daniel Wichern",
    text: "Herr Konrad hat uns vom ersten Tag bis zum erfolgreichen Verkauf unserer Immobilie super begleitet. Fachlich absolut top, immer zuverlässig und transparent. Auch menschlich einfach eine 1 mit Stern, man fühlt sich rundum gut aufgehoben. 100 % weiterzuempfehlen!",
    rating: 5,
    date: "Vor 3 Wochen",
  },
  {
    name: "Ulrike Hermine",
    text: "Herr Konrad erwies sich als ausgesprochen kompetenter, sowie loyaler Begleiter und Berater im Veräußerungsprozess meiner Wohnung. Definitiv ein Makler mit Herz.",
    rating: 5,
    date: "Vor 15 Wochen",
  },
  {
    name: "Andreas Koslowsky",
    text: "Wir haben Herrn Konrad zum wiederholten Mal gebeten eine Immobilie für uns zu vermarkten. Wieder sind wir von seinem Engagement, Kommunikation und Professionalität begeistert. Auf jegliche Rückfragen hat er sehr zeitnah und kompetent reagiert. Das erstellte Exposé war klasse, sehr schnell wurde ein Käufer gefunden. Herr Konrad hat es verstanden den Verhandlungsprozess sehr emphatisch und neutral zu moderieren. Offene Fragen im Rahmen der Erstellung des Kaufvertrages hat er schnell und pragmatisch gelöst! Wir danken Herrn Konrad für seine so erfolgreiche Arbeit und können ihn von Herzen weiterempfehlen.",
    rating: 5,
    date: "Vor 21 Wochen",
  },
  {
    name: "Bianca Rasche",
    text: "Wir sind sehr zufrieden mit Herrn Timo Konrad. Er hat immer für eine gute und harmonische Atmosphäre gesorgt und die richtigen Worte gefunden. Es blieben keine Fragen unbeantwortet. Auch auf zwischenmenschlicher Ebene ein durchaus sympathischer Mensch! Falls wir nochmal einen Makler benötigen, gehen wir wieder zu Timo.",
    rating: 5,
    date: "Vor 29 Wochen",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const googleReviewUrl = "https://www.google.com/search?q=EDIT+Immobilien+by+Timo+Konrad";

  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header mit Google Badge */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#808FA6]/10 px-4 py-2 rounded-full mb-4">
            <Star className="w-5 h-5 text-[#A2694A] fill-[#A2694A]" />
            <span className="text-[#808FA6]">Kundenstimmen</span>
          </div>
          
          <h2 className="text-white mb-4">
            Das sagen unsere Kunden
          </h2>
          
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Vertrauen ist die Basis unserer Arbeit. Lesen Sie, was Kunden über ihre Erfahrungen
            mit EDIT Immobilien berichten.
          </p>

          {/* Google Rating Badge */}
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-1">
              <img
                src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png"
                alt="Google"
                className="h-5"
              />
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-[#FBBC04] fill-[#FBBC04]"
                />
              ))}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm text-gray-900">5.0</span>
              <span className="text-xs text-gray-600">4 Bewertungen</span>
            </div>
          </a>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-[#808FA6] hover:bg-[#A2694A] text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-xl"
            aria-label="Vorherige Bewertung"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-[#808FA6] hover:bg-[#A2694A] text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-xl"
            aria-label="Nächste Bewertung"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Testimonial Cards */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-2xl p-8 md:p-12 relative">
                    {/* Quote Icon */}
                    <Quote className="w-12 h-12 text-[#A2694A] opacity-20 absolute top-8 left-8" />

                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-6 relative z-10">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-[#A2694A] fill-[#A2694A]"
                        />
                      ))}
                    </div>

                    {/* Text */}
                    <blockquote className="text-gray-300 text-lg leading-relaxed mb-8 relative z-10 italic">
                      "{testimonial.text}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <div className="text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Google Bewertung • {testimonial.date}
                        </div>
                      </div>
                      
                      {/* Google Icon */}
                      <img
                        src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png"
                        alt="Google"
                        className="h-4 opacity-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-[#A2694A] w-8"
                    : "bg-white/20 w-2 hover:bg-white/40"
                }`}
                aria-label={`Gehe zu Bewertung ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="border-[#808FA6] text-[#808FA6] hover:bg-[#808FA6] hover:text-white transition-all duration-300"
            >
              Alle Bewertungen auf Google ansehen
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
