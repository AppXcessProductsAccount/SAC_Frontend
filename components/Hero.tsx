"use client";

import { useTheme } from "./ThemeProvider";
import HeroClassic from "./HeroClassic";
import HeroModern from "./HeroModern";

export default function Hero({ content, template: propTemplate }: { content?: any, template?: string }) {
    const { theme } = useTheme();
    const activeTemplate = propTemplate === "default" || !propTemplate ? theme : propTemplate;

    return (
        <main>
            {activeTemplate === "classic" ? (
                <HeroClassic content={content} />
            ) : (
                <HeroModern content={content} />
            )}
        </main>
    );
}
