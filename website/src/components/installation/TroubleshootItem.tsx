
import React, { useState, useMemo } from 'react';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/utils';

export type TroubleshootCategory = 'java' | 'certificate' | 'pdf';

interface TroubleshootItemProps {
    title: string;
    solution: string;
    filter?: string;
    category?: TroubleshootCategory;
}

export function TroubleshootItem({
    title,
    solution,
    filter = '',
    category,
}: TroubleshootItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Filter logic
    const isVisible = useMemo(() => {
        if (!filter) return true;
        const searchTerm = filter.toLowerCase();
        return (
            title.toLowerCase().includes(searchTerm) ||
            solution.toLowerCase().includes(searchTerm) ||
            (category && category.toLowerCase().includes(searchTerm))
        );
    }, [filter, title, solution, category]);

    if (!isVisible) return null;

    const categoryColors = {
        java: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        certificate: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        pdf: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };

    return (
        <div className={cn(
            "rounded-2xl border overflow-hidden transition-all duration-300",
            isOpen
                ? "bg-card border-primary/30 shadow-lg shadow-black/5 ring-1 ring-primary/10"
                : "bg-card/50 border-border hover:border-border/80 hover:bg-card"
        )}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left cursor-pointer gap-4"
            >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className={cn(
                        "p-2 rounded-lg shrink-0 transition-colors",
                        isOpen ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                    )}>
                        <AlertTriangle className="w-4 h-4" />
                    </div>
                    <span className={cn("font-medium truncate transition-colors", isOpen ? "text-foreground" : "text-muted-foreground")}>
                        {title}
                    </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    {category && (
                        <span className={cn(
                            "hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border",
                            categoryColors[category]
                        )}>
                            {category}
                        </span>
                    )}
                    <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-300", isOpen ? "rotate-180" : "")} />
                </div>
            </button>

            <div className={cn("grid transition-all duration-300 ease-in-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-0 ml-[3.25rem]">
                        <p className="text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                            {solution}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
