import { useCallback, useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { adminSessionId } from "@/lib/admin-session";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [logoutReason, setLogoutReason] = useState<string | null>(null);
  const dismissedSession = useRef<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let authChanged = false;
    const accept = (next: Session | null) => {
      if (!mounted) return;
      if (next && adminSessionId(next.access_token) === dismissedSession.current) return;
      setSession(next);
      if (next) setLogoutReason(null);
    };
    supabase.auth.getSession().then(({ data }) => {
      if (!authChanged) accept(data.session);
      if (mounted) setLoading(false);
    }).catch(() => {
      if (mounted) setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      authChanged = true;
      accept(session);
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const signOut = useCallback(async (reason?: string) => {
    dismissedSession.current = session ? adminSessionId(session.access_token) : null;
    setLogoutReason(reason ?? "Du wurdest abgemeldet.");
    setSession(null);
    // Nur diese Sitzung beenden: eine neuere Anmeldung darf nicht mit abgemeldet werden.
    try { await supabase.auth.signOut({ scope: "local" }); } catch { /* Oberfläche bleibt gesperrt. */ }
  }, [session?.access_token]);

  return { user: session?.user ?? null, session, loading, signOut, logoutReason };
}
