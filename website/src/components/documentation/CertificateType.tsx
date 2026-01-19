
import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/utils';

interface CertificateTypeProps {
    title: string;
    description: string;
    features: string[];
    securityNote?: string;
    platformNote?: string;
    recommended?: boolean;
}

export function CertificateType({
    title,
    description,
    features,
    securityNote,
    platformNote,
    recommended,
}: CertificateTypeProps) {
    return (
        <div className={cn(
            "p-5 rounded-xl border transition-all duration-300 hover:bg-card/80",
            recommended
                ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5"
                : "bg-card border-border hover:border-primary/20"
        )}>
            <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-foreground">{title}</h4>
                {recommended && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary/10 text-primary border border-primary/20">
                        Recommended
                    </span>
                )}
                {platformNote && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {platformNote}
                    </span>
                )}
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
            <ul className="space-y-2">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            {securityNote && (
                <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-xs text-amber-500 flex items-center gap-1.5 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {securityNote}
                    </p>
                </div>
            )}
        </div>
    );
}
