/**
 * Token access for plain modules.
 *
 * `useAuth` owns the session, but it is a hook — the API modules that need a
 * bearer token are not components and cannot call it. Both read the same
 * `auth_tokens` key in localStorage, so the token is available either way and
 * there is one source of truth.
 */

const TOKENS_KEY = "auth_tokens";

/** The current access token, or "" when signed out or rendering on the server. */
export const getAuthToken = (): string => {
    if (typeof window === "undefined") return "";
    try {
        const raw = window.localStorage.getItem(TOKENS_KEY);
        if (!raw) return "";
        const parsed = JSON.parse(raw);
        return typeof parsed?.access_token === "string" ? parsed.access_token : "";
    } catch {
        // Corrupt or unreadable storage is the same as being signed out.
        return "";
    }
};

/**
 * Authorization header for an admin request, or {} when there is no token.
 *
 * Sending `Bearer ` with an empty token reads as a malformed credential rather
 * than an absent one, and some servers answer 400 instead of 401.
 */
export const authHeaders = (token?: string): Record<string, string> => {
    const value = token ?? getAuthToken();
    return value ? { Authorization: `Bearer ${value}` } : {};
};

/** Roles allowed into /admin. Case-insensitive; adjust if the backend renames them. */
export const ADMIN_ROLES = new Set(["admin", "superadmin", "super_admin", "staff"]);

export const isAdminRole = (role?: string | null): boolean =>
    !!role && ADMIN_ROLES.has(role.trim().toLowerCase());
