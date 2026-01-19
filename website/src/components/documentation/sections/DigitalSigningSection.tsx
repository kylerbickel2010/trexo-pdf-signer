
import React from 'react';
import { FileSignature, CheckCircle } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { CertificationLevel } from '../CertificationLevel';

interface DigitalSigningSectionProps {
    id: string;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function DigitalSigningSection({ id, isCompleted, onToggleComplete }: DigitalSigningSectionProps) {
    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader
                icon={FileSignature}
                title="Digital Signing"
                time="3 min"
                isCompleted={isCompleted}
                onToggleComplete={onToggleComplete}
            />
            <div className="glass-card p-6 space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        Signature Appearance
                    </h3>
                    <p className="text-muted-foreground">Customize how your signature appears on the document:</p>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-start gap-3 bg-secondary/30 p-3 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                            <div>
                                <strong className="text-foreground block mb-0.5">Visible signatures</strong>
                                <span>Display name, reason, location, date, and custom images</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 bg-secondary/30 p-3 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                            <div>
                                <strong className="text-foreground block mb-0.5">Invisible signatures</strong>
                                <span>Embed signature without visual representation (metadata only)</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 bg-secondary/30 p-3 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                            <div>
                                <strong className="text-foreground block mb-0.5">Existing fields</strong>
                                <span>Sign pre-existing signature fields in PDFs (e.g., forms)</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Certification Levels</h3>
                    <p className="text-muted-foreground">Control what changes are allowed after signing:</p>
                    <div className="grid gap-3">
                        <CertificationLevel level="Open" description="No restrictions - allows further signatures and modifications" />
                        <CertificationLevel level="Form Filling Only" description="Permits only form field completion after signing" />
                        <CertificationLevel level="Form + Annotations" description="Allows forms and comments/annotations" />
                        <CertificationLevel level="Locked" description="Prevents all modifications after signing" recommended />
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}
