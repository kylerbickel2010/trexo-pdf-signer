
import React from 'react';
import { Info, CheckCircle, Coffee, Cpu, HardDrive } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { SystemRequirement } from '../SystemRequirement';

interface PrerequisitesSectionProps {
    id: string;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function PrerequisitesSection({ id, isCompleted, onToggleComplete }: PrerequisitesSectionProps) {
    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader
                icon={Info}
                title="Prerequisites"
                time="2 min"
                isCompleted={isCompleted}
                onToggleComplete={onToggleComplete}
            />
            <div className="glass-card p-6 space-y-6">
                {/* Good News - Bundled Java */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20">
                    <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-emerald-500 to-emerald-600" />
                    <div className="flex items-start gap-4 p-5">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="font-bold text-emerald-400">No Java Installation Required!</p>
                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    Easy Setup
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                The <strong className="text-foreground">Windows, Linux (.deb), and macOS (.dmg)</strong> installers include a <strong className="text-emerald-400">bundled Java 8 runtime</strong>.
                                No separate Java installation is needed! Just download and install.
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                                <strong className="text-warning">Note:</strong> If you use the universal JAR file, you must have Java 8 installed separately.
                            </p>
                        </div>
                    </div>
                </div>

                {/* System Requirements */}
                <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
                        System Requirements
                        <span className="text-xs text-muted-foreground font-normal">(Minimum)</span>
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <SystemRequirement
                            icon={Coffee}
                            title="Java Version"
                            value="Java 8 only"
                            note="OpenJDK 8 or Oracle JDK 8"
                            highlight
                        />
                        <SystemRequirement
                            icon={Cpu}
                            title="Memory"
                            value="2GB RAM"
                            note="4GB recommended"
                        />
                        <SystemRequirement
                            icon={HardDrive}
                            title="Storage"
                            value="100MB"
                            note="Free disk space"
                        />
                    </div>
                </div>

                {/* Quick tip */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Info className="w-5 h-5 text-blue-400 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                        <strong className="text-blue-400">Tip:</strong> Use the native installers (Windows .exe, Linux .deb, macOS .dmg) for the easiest setup experience with bundled Java 8.
                    </p>
                </div>
            </div>
        </AnimatedSection>
    );
}
