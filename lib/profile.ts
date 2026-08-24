import type { AuthUser } from "./api/auth";

/**
 * Fields the backend requires before it will accept a programme registration.
 *
 * The API enforces this itself and answers 400 with `detail.profile_setup === false`,
 * but that only happens on submit — the visitor filled in the whole registration form
 * and pressed pay before being told. Checking the same fields client-side lets the
 * completion modal open BEFORE the form, so the requirement is met first.
 *
 * The API remains the authority: if this list ever drifts from the backend's, the 400
 * is still handled at submit as a backstop.
 */
/*
 * `phone_number` is deliberately NOT here. The Complete Profile modal does not
 * collect it, so gating on it would be a dead end: the visitor clicks Register, is
 * shown the modal, fills in every field it offers, saves — and is still blocked,
 * with nothing on screen able to fix it. Phone is edited on the profile page.
 */
export const REQUIRED_PROFILE_FIELDS = [
    "full_name",
    "gender",
    "dob",
    "occupation",
    "address",
] as const;

export type RequiredProfileField = (typeof REQUIRED_PROFILE_FIELDS)[number];

const hasValue = (value: unknown) =>
    typeof value === "string" ? value.trim().length > 0 : value != null;

/** Which required fields are still blank on this user. */
export const missingProfileFields = (user?: AuthUser | null): RequiredProfileField[] => {
    if (!user) return [...REQUIRED_PROFILE_FIELDS];
    return REQUIRED_PROFILE_FIELDS.filter((field) => !hasValue(user[field]));
};

export const isProfileComplete = (user?: AuthUser | null) =>
    missingProfileFields(user).length === 0;
