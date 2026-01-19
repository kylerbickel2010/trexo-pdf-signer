
import React from 'react';

// Animated gradient orbs
export function GradientOrbs() {
    return (
        <>
            {/* Primary orb */}
            <div
                className="orb orb-primary w-[500px] h-[500px] -top-48 -left-48"
                style={{ animationDelay: '0s' }}
            />
            {/* Secondary orb */}
            <div
                className="orb orb-secondary w-[400px] h-[400px] top-1/2 -right-32"
                style={{ animationDelay: '-5s' }}
            />
            {/* Tertiary orb */}
            <div
                className="orb orb-tertiary w-[300px] h-[300px] -bottom-24 left-1/4"
                style={{ animationDelay: '-10s' }}
            />
        </>
    );
}
