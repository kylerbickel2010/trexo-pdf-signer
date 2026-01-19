
import React from 'react';

interface StandardCardProps {
    standard: string;
    description: string;
}

export function StandardCard({ standard, description }: StandardCardProps) {
    return (
        <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-card/80 transition-all duration-300">
            <span className="font-mono text-sm text-primary font-semibold block mb-1">{standard}</span>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
}
