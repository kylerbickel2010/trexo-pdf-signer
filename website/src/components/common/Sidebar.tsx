
import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/utils';
import { ANIMATION } from '@/utils/constants';

// Define the shape of a section item
export interface NavigationSection {
    id: string;
    label: string;
    icon: React.ElementType;
    time?: string;
}

interface SidebarProps {
    sections: NavigationSection[];
    activeSection: string;
    completedSections: Set<string>;
    onSectionClick: (id: string) => void;
    onToggleComplete?: (id: string) => void;
}

export function Sidebar({
    sections,
    activeSection,
    completedSections,
    onSectionClick,
    onToggleComplete
}: SidebarProps) {

    // Calculate progress
    const progress = Math.round((completedSections.size / (sections.length > 0 ? sections.length : 1)) * 100);

    return (
        <aside className="hidden lg:block w-72 shrink-0">
            <nav className="sticky top-24 space-y-6" aria-label="Page sections">

                {/* Progress Card */}
                <div className="bg-card border border-border rounded-xl p-4 shadow-lg shadow-black/5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress</span>
                        <span className="text-xs font-mono font-medium text-primary">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 text-right">
                        {completedSections.size} of {sections.length} steps
                    </p>
                </div>

                {/* Navigation List */}
                <div className="relative pl-3">
                    {/* Timeline Line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-px bg-border group-hover:bg-border/80 transition-colors" />

                    <ul className="space-y-0.5">
                        {sections.map((section, index) => {
                            const isActive = activeSection === section.id;
                            const isCompleted = completedSections.has(section.id);

                            return (
                                <li key={section.id} className="relative z-10">
                                    <button
                                        onClick={() => onSectionClick(section.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer group text-left",
                                            isActive
                                                ? "bg-secondary text-primary font-medium shadow-md shadow-black/5"
                                                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                        )}
                                    >
                                        {/* Status Dot */}
                                        <div className={cn(
                                            "w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all",
                                            isCompleted
                                                ? "bg-emerald-500 border-emerald-500 text-black"
                                                : isActive
                                                    ? "bg-primary border-primary"
                                                    : "bg-background border-border group-hover:border-primary/50"
                                        )}>
                                            {isCompleted && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                                            {!isCompleted && isActive && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <span className="block truncate">{section.label}</span>
                                        </div>

                                        {section.time && isActive && (
                                            <span className="text-[10px] text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded border border-border/50">
                                                {section.time}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Keyboard Hint */}
                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground opacity-50">
                    <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border font-mono">↑</kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border font-mono">↓</kbd>
                    <span>to navigate</span>
                </div>
            </nav>
        </aside>
    );
}
