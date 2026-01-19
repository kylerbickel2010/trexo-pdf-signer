
import React from 'react';
import { cn } from '@/utils/utils';
import type { LucideIcon } from 'lucide-react';

interface SystemRequirementProps {
    icon: LucideIcon;
    title: string;
    value: string;
    note: string;
    highlight?: boolean;
}

export function SystemRequirement({
    icon: Icon,
    title,
    value,
    note,
    highlight,
}: SystemRequirementProps) {
    return (
        <div className={cn(
            "p-5 rounded-2xl text-center transition-all duration-300 hover:scale-[1.02]",
            highlight
                ? "bg-primary/5 border border-primary/20 ring-1 ring-primary/10 shadow-lg shadow-primary/5"
                : "bg-card border border-border hover:border-primary/20 hover:bg-card/80"
        )}>
            <div className={cn(
                "w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors",
                highlight ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
            )}>
                <Icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{title}</p>
            <p className={cn("font-bold text-lg mb-1", highlight ? "text-primary" : "text-foreground")}>{value}</p>
            <p className="text-xs text-muted-foreground opacity-80">{note}</p>
        </div>
    );
}
