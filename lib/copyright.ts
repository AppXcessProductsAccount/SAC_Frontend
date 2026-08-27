/**
 * Keeps the footer's copyright line on the current year.
 *
 * The line is admin-editable, so it is a free-text string rather than something
 * assembled from parts — which is how it came to read "© 2024" two years on. Two
 * things fix that here:
 *
 *  - `{year}` anywhere in the text is replaced with the current year. This is the
 *    form the seeded default uses, so a site that has never had its footer edited
 *    is simply always right.
 *  - Failing that, the LAST four-digit year in the text is moved forward if it has
 *    fallen behind. That covers text an admin typed by hand, and it moves only the
 *    end of a range: "© 2015-2024 X" becomes "© 2015-2026 X", keeping the year the
 *    organisation started.
 *
 * A year in the future, or one before `EARLIEST`, is left alone — those are not a
 * stale copyright line, they are something else that happens to look like a year.
 */

/** Years below this are not treated as a copyright year worth advancing. */
const EARLIEST = 1990;

export function resolveCopyrightText(text: string | null | undefined, now = new Date()): string {
    const currentYear = now.getFullYear();
    const raw = (text ?? "").trim();

    if (!raw) return `© ${currentYear} SelfAwareness Inc. All rights reserved.`;

    if (raw.includes("{year}")) return raw.split("{year}").join(String(currentYear));

    /* Rewrite the last plausible year only. Matching every year would collapse a
       range's start onto its end; matching the first would leave the end stale. */
    let lastMatch: { index: number; value: string } | null = null;
    const yearPattern = /(?<!\d)(\d{4})(?!\d)/g;
    for (const match of raw.matchAll(yearPattern)) {
        const year = Number(match[1]);
        if (year >= EARLIEST && year <= currentYear) {
            lastMatch = { index: match.index ?? 0, value: match[1] };
        }
    }

    if (!lastMatch || Number(lastMatch.value) === currentYear) return raw;

    return (
        raw.slice(0, lastMatch.index) +
        currentYear +
        raw.slice(lastMatch.index + lastMatch.value.length)
    );
}
