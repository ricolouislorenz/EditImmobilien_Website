import { Routes, Route } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LoginPage } from "./LoginPage";
import { PropertiesPage } from "./PropertiesPage";
import { PropertyFormPage } from "./PropertyFormPage";
import { Button } from "@/components/ui/button";

export function AdminApp() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <p className="text-gray-500">Laden...</p>
      </div>
    );
  }

  if (!user) return <LoginPage />;

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
            onClick={signOut}
            className="shrink-0 text-gray-400 hover:text-white"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Abmelden</span>
          </Button>
        </div>
      </header>

      {/* Inhalt */}
      <main className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route index element={<PropertiesPage />} />
          <Route path="properties/new" element={<PropertyFormPage />} />
          <Route path="properties/:id" element={<PropertyFormPage />} />
        </Routes>
      </main>
    </div>
  );
}
