export const UI_ORIGIN = 'http://localhost:4200';
export const AUTH_URL = 'http://localhost:3000/auth/login';
export const MISSION_SERVICE_BASE = 'http://localhost:8090';
// Class-room APIs are absolute URLs. Match origin, NOT a raw string prefix.
export function targetsMission(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl, UI_ORIGIN);
    return url.origin === new URL(MISSION_SERVICE_BASE).origin
      && !url.username && !url.password;
  } catch { return false; }
}