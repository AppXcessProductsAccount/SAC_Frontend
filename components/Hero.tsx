"use client";

import HeroClassic from "./HeroClassic";

// Classic is the only template. The `template` prop is still accepted so CMS
// section payloads keep passing through unchanged, but it no longer selects a
// variant.
export default function Hero({ content }: { content?: any, template?: string }) {
    return <HeroClassic content={content} />;
}
