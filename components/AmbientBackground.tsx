"use client";

import React, { useMemo, useState, useEffect } from "react";

interface AmbientBackgroundProps {
    starCount?: number;
    showShootingStar?: boolean;
    shootingStarDuration?: string;
    opacity?: number;
}

export default function AmbientBackground({
    starCount = 30,
    showShootingStar = false,
    shootingStarDuration = "35s",
    opacity = 0.6
}: AmbientBackgroundProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Generate static stars once
    const stars = useMemo(() => {
        return Array.from({ length: starCount }).map((_, i) => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * 2 + 1}px`,
            duration: `${Math.random() * 3 + 2}s`,
            delay: `${Math.random() * 5}s`,
        }));
    }, [starCount]);

    if (!mounted) {
        return <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" />;
    }

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* 1. Celestial Drift Container */}
            <div className="absolute inset-0 animate-celestial-drift">
                {stars.map((star, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full animate-shimmer"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            "--shimmer-duration": star.duration,
                            animationDelay: star.delay,
                            opacity: opacity,
                            boxShadow: `0 0 10px rgba(255,255,255,0.4)`
                        } as React.CSSProperties}
                    ></div>
                ))}
            </div>

            {/* 2. Optional Shooting Star */}
            {showShootingStar && (
                <div
                    className="absolute bottom-0 left-0 w-[150px] h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[1px] animate-shooting-star-slow z-20"
                    style={{ "--ss-duration": shootingStarDuration } as React.CSSProperties}
                ></div>
            )}
        </div>
    );
}
