import { lazy, Suspense } from "react";
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
import { VerkaufsprozessTimeline } from "./components/VerkaufsprozessTimeline";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { CookieBanner } from "./components/CookieBanner";
import { ScrollProgressBar } from "./components/ScrollProgressBar";
import { MobileStickyCTA } from "./components/MobileStickyCTA";
import { ImpressumPage, DatenschutzPage } from "./components/LegalPage";

// Lazy geladen: zieht jsPDF + PDF-Generatoren erst bei Bedarf nach, nicht ins Initial-Bundle.
const DownloadsSection = lazy(() =>
  import("./components/DownloadsSection").then((m) => ({ default: m.DownloadsSection }))
);

// Lazy geladen: Admin-Panel inkl. Supabase-Auth-Logik gehört nicht ins öffentliche Bundle.
const AdminApp = lazy(() =>
  import("./admin/AdminApp").then((m) => ({ default: m.AdminApp }))
);

function GoldDivider() {
  return (
    <div style={{ height: "1px", background: "linear-gradient(to right, transparent, #C2A878, transparent)" }} />
  );
}

function MainSite() {
  return (
    <div className="min-h-screen">
      <SEOHead />
      <StructuredData />
      <ScrollProgressBar />
      <Header />
      <main className="pt-[73px]">
        <Hero />
        <GoldDivider />
        <ImmobilienwertRechner />
        <GoldDivider />
        <ServicesSection />
        <GoldDivider />
        <PropertiesSection />
        <GoldDivider />
        <AboutSection />
        <GoldDivider />
        <VerkaufsprozessTimeline />
        <GoldDivider />
        <Suspense fallback={<div className="min-h-[400px]" aria-hidden="true" />}>
          <DownloadsSection />
        </Suspense>
        <GoldDivider />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileStickyCTA />
      <CookieBanner />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="admin/*"
        element={
          <Suspense
            fallback={
              <div className="min-h-screen bg-[#111111] flex items-center justify-center">
                <p className="text-gray-500">Laden...</p>
              </div>
            }
          >
            <AdminApp />
          </Suspense>
        }
      />
      <Route path="impressum" element={<ImpressumPage />} />
      <Route path="datenschutz" element={<DatenschutzPage />} />
      <Route path="*" element={<MainSite />} />
    </Routes>
  );
}
