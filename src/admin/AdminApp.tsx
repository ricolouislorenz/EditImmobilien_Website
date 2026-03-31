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
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-white font-semibold">Edit Immobilien</span>
          <span className="text-gray-500 text-sm ml-2">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm hidden sm:block">{user.email}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-gray-400 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Abmelden
          </Button>
        </div>
      </header>

      {/* Inhalt */}
      <main className="p-6">
        <Routes>
          <Route index element={<PropertiesPage />} />
          <Route path="properties/new" element={<PropertyFormPage />} />
          <Route path="properties/:id" element={<PropertyFormPage />} />
        </Routes>
      </main>
    </div>
  );
}
