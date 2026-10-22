import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { adminSessionId, ADMIN_IDLE_MS } from "@/lib/admin-session";
import { monitorAdminSession, type SessionView } from "@/lib/admin-session-monitor";

export function useAdminSession(accessToken: string | undefined, signOut: (reason?: string) => Promise<void>) {
  const sessionId = accessToken ? adminSessionId(accessToken) : null;
  const [state, setState] = useState<SessionView & { sessionId: string | null }>({ sessionId: null, phase: "checking", remainingMs: ADMIN_IDLE_MS });
  const monitor = useRef<ReturnType<typeof monitorAdminSession> | null>(null);
  const logout = useRef(signOut);
  logout.current = signOut;
  useEffect(() => {
    if (!sessionId) return;
    monitor.current = monitorAdminSession({
      key: `admin:activity:${sessionId}`,
      check: async (activity) => {
        const { data, error } = await supabase.rpc("admin_session_check", { p_activity: activity })
          .abortSignal(AbortSignal.timeout(8000));
        if (error || !data) throw error ?? new Error("Sitzungsprüfung fehlgeschlagen");
        return data;
      },
      onState: (next) => setState({ ...next, sessionId }),
      onEnd: (reason) => { void logout.current(reason); },
    });
    return () => { monitor.current?.stop(); monitor.current = null; };
  }, [sessionId]);
  return {
    ...state,
    locked: !sessionId || state.sessionId !== sessionId || state.phase !== "active",
    retry: () => monitor.current?.retry(),
    stay: () => monitor.current?.stay(),
  };
}
