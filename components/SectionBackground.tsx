"use client";

import { resolveMediaUrl } from "@/lib/api/config";

/**
 * The single texture layer shared by every classic section.
 *
 * It exists because each section used to hand-roll its own <img> layer, which
 * produced three separate problems:
 *
 * 1. FIT — the texture plates are wide (~2000x870). `object-cover` on a tall
 *    section scales them ~3x and crops to the centre, so an ornamental frame or
 *    a dark corner lands wherever the crop happens to fall, and the same plate
 *    looks different in every section. Blurring turns the plate into an ambient
 *    wash, which reads the same at any crop or aspect ratio.
 *
 * 2. SEAM — each section faded its texture out to its OWN background colour
 *    (some `bg-white`, some `#eeebf0`), so two stacked sections met at a visible
 *    band of mismatched tone. The ground is painted here now, below the texture,
 *    so every section dissolves into the same colour.
 *
 * 3. HARD EDGES — the fades were ad-hoc: 26px bottom-only, an asymmetric
 *    20px/22px pair, 15%, 15%/85%, and none at all on Contact. One symmetric
 *    fade means any two neighbours cross-dissolve instead of butting together.
 *
 * Note on `blur`, which defaults OFF: it only helps plates with a large feature
 * that crops badly. The marble plate is the opposite — a low-contrast texture
 * whose entire visible character is fine veining, only a few percent of
 * luminance. Blurring averages that away, and since the ground tone (#eeebf0) is
 * within a hair of the marble's own tone, a blurred plate at partial opacity
 * renders as flat colour: the texture vanishes completely. Only (1) and (3)
 * above need to be true for every section; (2) is a per-plate decision.
 */

type Fade = "both" | "top" | "bottom" | "none";

interface Props {
    /**
     * Local path (`/testimonial.png`) or a CMS value. Resolved here so call sites can
     * hand a raw `background_image_url` straight from a section payload: an admin
     * upload comes back as `/uploads/...`, which has to be pointed at the API host.
     */
    src?: string | null;
    /** Which edges dissolve into the shared ground. */
    fade?: Fade;
    /**
     * Blur radius in px. Off by default — see the note on the component. Turn it on
     * only for plates with a large feature that crops badly (a frame, a dark corner).
     */
    blur?: number;
    /** Texture strength over the ground tone. */
    opacity?: number;
    /**
     * Depth of the dissolve, as a % of section height. Kept small: two stacked
     * sections each contribute their own fade at the shared boundary, so the flat
     * band between them is roughly double this. At 14 it read as an empty gap.
     */
    fadeDepth?: number;
    /** Load immediately instead of lazily — for the first textured section on a page. */
    eager?: boolean;
    /** Extra wrapper classes, e.g. a different ground colour. */
    className?: string;
}

function maskFor(fade: Fade, depth: number): string | undefined {
    if (fade === "none") return undefined;

    const top = fade === "both" || fade === "top";
    const bottom = fade === "both" || fade === "bottom";

    const stops = [
        top ? "transparent 0%" : "black 0%",
        top ? `black ${depth}%` : null,
        bottom ? `black ${100 - depth}%` : null,
        bottom ? "transparent 100%" : "black 100%",
    ].filter(Boolean) as string[];

    return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

export default function SectionBackground({
    src,
    fade = "both",
    blur = 0,
    opacity = 1,
    fadeDepth = 6,
    eager = false,
    className = "",
}: Props) {
    const mask = maskFor(fade, fadeDepth);
    // An empty/cleared CMS field falls back to the marble plate rather than rendering
    // a broken image, so a section never loses its background by being half-edited.
    const resolved = resolveMediaUrl(src) || "/testimonial.png";

    return (
        <div
            aria-hidden="true"
            className={`absolute inset-0 z-0 overflow-hidden pointer-events-none bg-background-light ${className}`}
        >
            {/* The mask sits on this wrapper, not on the <img>: a mask is applied in
                the element's own box and the image below is scaled up, so masking the
                image would scale the fade too and push both feathered edges outside
                the section where they'd be clipped away. */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ maskImage: mask, WebkitMaskImage: mask }}
            >
                <img
                    src={resolved}
                    alt=""
                    loading={eager ? "eager" : "lazy"}
                    decoding="async"
                    /* The overscale exists only to serve the blur: a blur samples past
                       the element's own bounds, so an un-overscaled image feathers into
                       transparency at all four edges and the corners go pale. Without a
                       blur it would crop 10% of the plate for nothing. */
                    className={`w-full h-full object-cover ${blur > 0 ? "scale-110" : ""}`}
                    style={{
                        opacity,
                        filter: blur > 0 ? `blur(${blur}px)` : undefined,
                    }}
                />
            </div>
        </div>
    );
}
