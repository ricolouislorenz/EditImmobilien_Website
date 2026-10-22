import { Routes, Route } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminSession } from "@/hooks/useAdminSession";
import { ADMIN_WARNING_MS } from "@/lib/admin-session";
import { LoginPage } from "./LoginPage";
import { PropertiesPage } from "./PropertiesPage";
import { PropertyFormPage } from "./PropertyFormPage";
import { Button } from "@/components/ui/button";

export function AdminApp() {
  const { user, session, loading, signOut, logoutReason } = useAuth();
  const guard = useAdminSession(session?.access_token, signOut);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <p className="text-gray-500">Laden...</p>
      </div>
    );
  }

  // ÜBERGABE SICHERHEIT-01: Anmeldung und aktive Sitzung werden geprüft, eine Admin-Freigabeliste fehlt.
  // Bestehende Konten müssen zusätzlich über Datenbankrechte auf berechtigte Personen begrenzt werden.
  if (!user) return <LoginPage notice={logoutReason} />;

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Topbar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/10 bg-[#111111]/95 px-4 py-3 backdrop-blur sm:px-6 sm:py-4">
        <div className="min-w-0">
          <span className="font-semibold text-white">Edit Immobilien</span>
          <span className="ml-2 text-sm text-gray-500">Admin</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden max-w-[200px] truncate text-sm text-gray-500 md:block">
            {user.email}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { void signOut(); }}
            className="shrink-0 text-gray-400 hover:text-white"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Abmelden</span>
          </Button>
        </div>
      </header>

      {guard.locked && <div role="alert" className="mx-auto max-w-6xl px-4 pt-5 text-sm text-amber-200 sm:px-6">
        {guard.phase === "checking" ? "Anmeldung wird geprüft …" : <>
          Die Anmeldung kann gerade nicht geprüft werden. Die Bearbeitung ist gesperrt; deine Eingaben bleiben erhalten.
          <button type="button" onClick={guard.retry} className="ml-2 underline">Erneut prüfen</button>
        </>}
      </div>}
      {!guard.locked && guard.remainingMs <= ADMIN_WARNING_MS && <div role="alert" className="mx-auto max-w-6xl px-4 pt-5 sm:px-6">
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          Du wirst in {Math.max(1, Math.ceil(guard.remainingMs / 1000))} Sekunden wegen Inaktivität abgemeldet. Bitte Änderungen rechtzeitig speichern.
          <button type="button" onClick={guard.stay} className="ml-2 font-medium underline">Angemeldet bleiben</button>
        </div>
      </div>}

      {/* Inhalt */}
      <main ref={(element) => { if (element) element.inert = guard.locked; }}
        aria-busy={guard.locked} className={`mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8 ${guard.locked ? "pointer-events-none opacity-40" : ""}`}>
        <Routes>
          <Route index element={<PropertiesPage />} />
          <Route path="properties/new" element={<PropertyFormPage />} />
          <Route path="properties/:id" element={<PropertyFormPage />} />
        </Routes>
      </main>
    </div>
  );
}
