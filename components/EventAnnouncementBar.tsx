"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { GRAND_MEDITATION_PATH } from "@/lib/site-settings";
import { useGrandMeditationEvent } from "@/hooks/useSiteSettings";

/**
 * A slim, continuously scrolling event banner for the top of the landing page.
 *
 * Shows only while the event is published AND its announcement toggle is on, so
 * the admin can retract it independently of the page itself. The text is
 * admin-editable; clicking anywhere on the bar opens the event page.
 */
export default function EventAnnouncementBar() {
    const { enabled, announcementEnabled, content } = useGrandMeditationEvent();
    if (enabled !== true || !announcementEnabled) return null;

    const text = content.announcement_text?.trim();
    if (!text) return null;

    // Two identical halves; animating x by -50% shifts exactly one half, so the
    // loop is seamless. Each half repeats the line a few times to fill wide screens.
    const line = (
        <span className="flex items-center gap-3 px-6 text-[13px] text-[#F5E6A8]">
            <Sparkles size={13} className="text-[#C9A227] shrink-0" />
            <span className="font-medium tracking-wide">{text}</span>
            <span className="inline-flex items-center gap-1 text-[#C9A227] font-semibold">
                View details <ArrowRight size={12} />
            </span>
            <span className="text-[#C9A227]/60 px-2">◆</span>
        </span>
    );

    return (
        <Link
            href={GRAND_MEDITATION_PATH}
            aria-label={text}
            className="block relative overflow-hidden bg-gradient-to-r from-[#0a0e27] via-[#101848] to-[#0a0e27] border-b border-[#C9A227]/30"
        >
            <motion.div
                className="flex w-max py-2"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
            >
                {[0, 1].map((half) => (
                    <div key={half} className="flex items-center shrink-0" aria-hidden={half === 1}>
                        {[0, 1, 2, 3].map((i) => (
                            <span key={i} className="flex shrink-0">{line}</span>
                        ))}
                    </div>
                ))}
            </motion.div>
        </Link>
    );
}
