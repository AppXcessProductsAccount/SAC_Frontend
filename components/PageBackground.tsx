"use client";

import { resolveMediaUrl } from "@/lib/api/config";

/**
 * ONE marble plate behind the entire page.
 *
 * Replaces the per-section backdrop for pages that want a single continuous
 * surface. The seam it fixes is structural, not cosmetic: when every section
 * renders its own <img>, each one `object-cover`s the plate to its own height,
 * so the crop restarts at every boundary and the texture visibly breaks. Fading
 * the section edges does not merge them — it swaps a hard seam for a band of flat
 * colour, which reads as a gap. With a single viewport-fixed image there is no
 * boundary to merge, because there is only one image.
 *
 * `fixed`, not `absolute`: the plate stays anchored to the viewport while content
 * scrolls over it, so it never has to stretch to the full page height (which on a
 * long page would smear a 2000x870 plate over ~8000px).
 *
 * `-z-10` is painted after <body>'s own background but before any in-flow content,
 * so a page that wants this visible must leave its <main> and sections transparent
 * — an opaque section background will cover it.
 */
export default function PageBackground({
    src = "/testimonial.png",
    blur = 0,
    opacity = 1,
}: {
    src?: string | null;
    blur?: number;
    opacity?: number;
}) {
    const resolved = resolveMediaUrl(src) || "/testimonial.png";

    return (
        <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none bg-background-light overflow-hidden">
            <img
                src={resolved}
                alt=""
                decoding="async"
                className={`w-full h-full object-cover ${blur > 0 ? "scale-110" : ""}`}
                style={{
                    opacity,
                    filter: blur > 0 ? `blur(${blur}px)` : undefined,
                }}
            />
        </div>
    );
}
