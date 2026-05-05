const STORAGE_KEY = "mono_device_id";

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `d_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

/** Stable anonymous id for personalization events (localStorage). */
export function getOrCreateDeviceId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    let id = window.localStorage.getItem(STORAGE_KEY);
    if (!id || id.length < 8) {
      id = generateId();
      window.localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}
