import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ServicesSection } from "./components/ServicesSection";
import { PropertiesSection } from "./components/PropertiesSection";
import { AboutSection } from "./components/AboutSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { SEOHead, StructuredData } from "./components/SEOHead";
import { ImmobilienwertRechner } from "./components/ImmobilienwertRechner";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { VerkaufsprozessTimeline } from "./components/VerkaufsprozessTimeline";
import { DownloadsSection } from "./components/DownloadsSection";
import { CookieBanner } from "./components/CookieBanner";
import { AdminApp } from "./admin/AdminApp";

function MainSite() {
  return (
    <div className="min-h-screen">
      <SEOHead />
      <StructuredData />
      <Header />
      <main className="pt-[73px]">
        <Hero />
        <ImmobilienwertRechner />
        <ServicesSection />
        <PropertiesSection />
        <VerkaufsprozessTimeline />
        <AboutSection />
        <TestimonialsSection />
        <DownloadsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="admin/*" element={<AdminApp />} />
      <Route path="*" element={<MainSite />} />
    </Routes>
  );
}
