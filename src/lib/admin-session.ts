export const ADMIN_IDLE_MS = 30 * 60 * 1000;
export const ADMIN_WARNING_MS = 2 * 60 * 1000;
export const ADMIN_CHECK_MS = 15 * 1000;

/** Nur zur Zuordnung lokaler Bedienaktivität; die Datenbank prüft das signierte Token selbst. */
export function adminSessionId(accessToken: string): string | null {
  try {
    const payload = accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const id = JSON.parse(atob(payload)).session_id;
    return typeof id === 'string' ? id : null;
  } catch { return null; }
}

export function readActivity(key: string, fallback: number): number {
  try {
    const value = Number(localStorage.getItem(key));
    return value > 0 && value <= Date.now() ? Math.max(fallback, value) : fallback;
  } catch { return fallback; }
}
