
import React from 'react';
import { cn } from '@/utils/utils';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    className?: string;
    recommended?: boolean;
}

export function FeatureCard({ icon: Icon, title, description, className, recommended }: FeatureCardProps) {
    return (
        <div className={cn(
            "relative p-5 rounded-2xl border transition-all duration-300 group overflow-hidden",
            recommended
                ? "bg-primary/5 border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                : "bg-card border-border hover:border-primary/30 hover:bg-card/80",
            className
        )}>
            {recommended && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-bl-xl">
                    Recommended
                </div>
            )}

            <div className="flex gap-4">
                {Icon && (
                    <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                        recommended ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground group-hover:text-primary"
                    )}>
                        <Icon className="w-5 h-5" />
                    </div>
                )}

                <div>
                    <h3 className={cn("font-semibold mb-2 group-hover:text-primary transition-colors", Icon ? "text-base" : "text-sm")}>
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
