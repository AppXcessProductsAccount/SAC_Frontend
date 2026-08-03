"use client";

import { useTheme } from "./ThemeProvider";
import HeroClassic from "./HeroClassic";
import HeroModern from "./HeroModern";

export default function Hero({ content, template: propTemplate }: { content?: any, template?: string }) {
    const { theme } = useTheme();
    const activeTemplate = propTemplate === "default" || !propTemplate ? theme : propTemplate;

    // Deliberately a fragment, not <main>: the page already renders a <main>
    // landmark, and nesting a second one is invalid HTML.
    return activeTemplate === "classic"
        ? <HeroClassic content={content} />
        : <HeroModern content={content} />;
}
