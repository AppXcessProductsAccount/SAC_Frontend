"use client";

import { useEffect, useState } from "react";
import {
    getPublicSettings,
    mergeGrandMeditationContent,
    DEFAULT_GRAND_MEDITATION_CONTENT,
    type GrandMeditationContent,
} from "@/lib/site-settings";

/**
 * Reads whether the Grand Group Meditation event page is published.
 *
 * Returns `null` while the setting is still loading so callers can tell "not yet
 * known" from "known to be off" — the navbar renders nothing extra during load,
 * and the page shows a spinner rather than flashing a 404.
 */
export function useEventGrandMeditationEnabled(): boolean | null {
    const [enabled, setEnabled] = useState<boolean | null>(null);

    useEffect(() => {
        let active = true;
        getPublicSettings()
            .then((s) => active && setEnabled(!!s.event_grand_meditation_enabled))
            // A failed fetch already defaults to on inside getPublicSettings; if it
            // rejects entirely, hide the extra nav entry rather than link to a page
            // that might 404.
            .catch(() => active && setEnabled(false));
        return () => {
            active = false;
        };
    }, []);

    return enabled;
}

/**
 * Full state for the Grand Group Meditation page: whether it's published and the
 * admin-editable content (Guru + three masters), merged over the defaults so the
 * page always has three named masters even before anything is customised.
 */
export function useGrandMeditationEvent(): {
    enabled: boolean | null;
    announcementEnabled: boolean;
    content: GrandMeditationContent;
} {
    const [enabled, setEnabled] = useState<boolean | null>(null);
    const [announcementEnabled, setAnnouncementEnabled] = useState(false);
    const [content, setContent] = useState<GrandMeditationContent>(
        DEFAULT_GRAND_MEDITATION_CONTENT
    );

    useEffect(() => {
        let active = true;
        getPublicSettings()
            .then((s) => {
                if (!active) return;
                setEnabled(!!s.event_grand_meditation_enabled);
                setAnnouncementEnabled(!!s.event_announcement_enabled);
                setContent(mergeGrandMeditationContent(s.event_grand_meditation_content));
            })
            .catch(() => active && setEnabled(false));
        return () => {
            active = false;
        };
    }, []);

    return { enabled, announcementEnabled, content };
}
