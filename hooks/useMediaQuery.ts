"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe media query hook. Always returns `false` on the server and on the
 * first client render so hydration stays consistent, then settles to the real
 * value in an effect.
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(query);
        const onChange = (e: MediaQueryListEvent | MediaQueryList) => setMatches(e.matches);

        onChange(mql);
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, [query]);

    return matches;
}

/** True from the Tailwind `md` breakpoint (768px) up. */
export const useIsDesktop = () => useMediaQuery("(min-width: 768px)");

/** True when the visitor asked the OS to reduce motion. */
export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
