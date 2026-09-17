"use client";

import { useEffect, useState } from "react";
import {
    getPublicSettings,
    mergeGrandMeditationContent,
    normalizeHomeVideos,
    isGrandMeditationExpired,
    DEFAULT_GRAND_MEDITATION_CONTENT,
    type GrandMeditationContent,
    type HomeVideos,
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
            // Off if the admin disabled it OR the event ended more than 3 days ago.
            .then((s) => {
                if (!active) return;
                const content = mergeGrandMeditationContent(s.event_grand_meditation_content);
                setEnabled(!!s.event_grand_meditation_enabled && !isGrandMeditationExpired(content));
            })
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
                const merged = mergeGrandMeditationContent(s.event_grand_meditation_content);
                const expired = isGrandMeditationExpired(merged);
                setEnabled(!!s.event_grand_meditation_enabled && !expired);
                setAnnouncementEnabled(!!s.event_announcement_enabled && !expired);
                setContent(merged);
            })
            .catch(() => active && setEnabled(false));
        return () => {
            active = false;
        };
    }, []);

    return { enabled, announcementEnabled, content };
}

/**
 * The landing-page video rails (YouTube + TikTok), admin-editable. Returns empty
 * lists until loaded, so a section renders nothing rather than flashing empty.
 */
export function useHomeVideos(): { videos: HomeVideos; loaded: boolean } {
    const [videos, setVideos] = useState<HomeVideos>({ youtube: [], tiktok: [] });
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let active = true;
        getPublicSettings()
            .then((s) => active && setVideos(normalizeHomeVideos(s.home_videos)))
            .catch(() => {})
            .finally(() => active && setLoaded(true));
        return () => {
            active = false;
        };
    }, []);

    return { videos, loaded };
}
