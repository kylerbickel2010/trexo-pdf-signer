
import React from 'react';
import { cn } from '@/utils/utils';

interface CertificateOptionProps {
    title: string;
    description: string;
    recommended?: boolean;
    windows?: boolean;
}

export function CertificateOption({ title, description, recommended, windows }: CertificateOptionProps) {
    return (
        <div className={cn(
            "p-5 rounded-2xl border transition-all duration-300 group",
            recommended
                ? "bg-primary/5 border-primary/20 hover:border-primary/40 shadow-sm"
                : "bg-card border-border hover:border-sidebar-primary/50 hover:bg-card/80"
        )}>
            <div className="flex items-center gap-2.5 mb-2.5">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h3>
                {recommended && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary/10 text-primary border border-primary/20">
                        Recommended
                    </span>
                )}
                {windows && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Windows only
                    </span>
                )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
}
