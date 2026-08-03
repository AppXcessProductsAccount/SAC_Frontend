"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

type Theme = "classic" | "modern";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("classic");

    // Read the theme the inline <head> script already resolved. Running this in a
    // layout effect means the swap is committed BEFORE the browser paints, so a
    // returning "modern" visitor never sees the classic layout flash first.
    useIsomorphicLayoutEffect(() => {
        const fromDom = document.documentElement.dataset.theme as Theme | undefined;
        const saved = fromDom || (localStorage.getItem("app-theme") as Theme | null);
        if (saved === "modern" || saved === "classic") {
            setThemeState(saved);
        }
    }, []);

    const setTheme = (next: Theme) => {
        setThemeState(next);
        document.documentElement.dataset.theme = next;
        try {
            localStorage.setItem("app-theme", next);
        } catch {
            /* private mode / storage disabled — theme just won't persist */
        }
    };

    const toggleTheme = () => setTheme(theme === "classic" ? "modern" : "classic");

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
            <ThemeToggle />
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
