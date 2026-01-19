
import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { TSAServer } from '../TSAServer';

interface TimestampingSectionProps {
    id: string;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function TimestampingSection({ id, isCompleted, onToggleComplete }: TimestampingSectionProps) {
    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader
                icon={Clock}
                title="Timestamping"
                time="2 min"
                isCompleted={isCompleted}
                onToggleComplete={onToggleComplete}
            />
            <div className="glass-card p-6 space-y-6">
                <p className="text-muted-foreground">
                    RFC 3161 timestamps provide cryptographic proof of when a signature was created.
                </p>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Why Timestamping Matters</h3>
                    <ul className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <li className="flex items-start gap-3 bg-secondary/30 p-3 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                            <span>Proves signature was created at a specific time</span>
                        </li>
                        <li className="flex items-start gap-3 bg-secondary/30 p-3 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                            <span>Extends signature validity beyond certificate expiration</span>
                        </li>
                        <li className="flex items-start gap-3 bg-secondary/30 p-3 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                            <span>Legal requirement in many jurisdictions</span>
                        </li>
                        <li className="flex items-start gap-3 bg-secondary/30 p-3 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                            <span>Prevents backdating attacks</span>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Popular Free TSA Servers</h3>
                    <div className="space-y-3">
                        <TSAServer name="DigiCert" url="http://timestamp.digicert.com" />
                        <TSAServer name="Sectigo" url="http://timestamp.sectigo.com" />
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}
