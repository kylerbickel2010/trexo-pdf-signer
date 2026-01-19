
import React from 'react';
import { Check, Clock } from 'lucide-react';
import { cn } from '@/utils/utils';

interface SectionHeaderProps {
    icon?: React.ElementType;
    title: string;
    badge?: string;
    time?: string;
    isCompleted?: boolean;
    onToggleComplete?: () => void;
    className?: string;
    description?: string;
}

export function SectionHeader({
    icon: Icon,
    title,
    badge,
    time,
    isCompleted,
    onToggleComplete,
    className,
    description
}: SectionHeaderProps) {
    return (
        <div className={cn("flex flex-col gap-4 mb-8", className)}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    {Icon && (
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg shrink-0",
                            isCompleted
                                ? "bg-emerald-500/10 ring-1 ring-emerald-500/30 text-emerald-400 shadow-emerald-500/10"
                                : "bg-primary/10 ring-1 ring-primary/30 text-primary shadow-primary/10"
                        )}>
                            {isCompleted ? (
                                <Check className="w-6 h-6" />
                            ) : (
                                <Icon className="w-6 h-6" />
                            )}
                        </div>
                    )}

                    <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
                            {badge && (
                                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                                    {badge}
                                </span>
                            )}
                        </div>

                        {description && (
                            <p className="mt-2 text-muted-foreground text-sm leading-relaxed max-w-2xl">
                                {description}
                            </p>
                        )}

                        {time && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{time} read</span>
                            </div>
                        )}
                    </div>
                </div>

                {onToggleComplete && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete();
                        }}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border shrink-0",
                            isCompleted
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:border-primary/30"
                        )}
                        title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                        <div className={cn(
                            "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                            isCompleted ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground/50"
                        )}>
                            {isCompleted && <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />}
                        </div>
                        <span>{isCompleted ? 'Completed' : 'Mark as done'}</span>
                    </button>
                )}
            </div>

            <div className="h-px w-full bg-gradient-to-r from-border via-border/50 to-transparent" />
        </div>
    );
}
