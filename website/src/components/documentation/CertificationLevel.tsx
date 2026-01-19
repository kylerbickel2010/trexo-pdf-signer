
import React from 'react';
import { cn } from '@/utils/utils';
import { ShieldCheck } from 'lucide-react';

interface CertificationLevelProps {
    level: string;
    description: string;
    recommended?: boolean;
}

export function CertificationLevel({
    level,
    description,
    recommended,
}: CertificationLevelProps) {
    return (
        <div className={cn(
            "flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
            recommended
                ? "bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5"
                : "bg-card border-border hover:border-primary/20"
        )}>
            <div className="flex items-center gap-3">
                {recommended && <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />}
                <div>
                    <span className={cn("font-medium block", recommended ? "text-emerald-400" : "text-foreground")}>
                        {level}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
            </div>
            {recommended && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Secure
                </span>
            )}
        </div>
    );
}
