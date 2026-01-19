
import React from 'react';
import { Lock } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { PrivacyItem } from '../PrivacyItem';

interface PrivacySectionProps {
    id: string;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function PrivacySection({ id, isCompleted, onToggleComplete }: PrivacySectionProps) {
    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader
                icon={Lock}
                title="Privacy & Data Protection"
                time="2 min"
                isCompleted={isCompleted}
                onToggleComplete={onToggleComplete}
            />
            <div className="glass-card p-6 space-y-6">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <h3 className="font-semibold text-emerald-400 mb-2">100% Offline Operation</h3>
                    <p className="text-sm text-muted-foreground">
                        All PDF processing happens locally on your computer. No internet connection required
                        except for optional OCSP/CRL validation and timestamping.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">What Trexo PDF Signer Never Does</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <PrivacyItem text="Upload PDFs to cloud servers" />
                        <PrivacyItem text="Send data to external servers" />
                        <PrivacyItem text="Track user behavior or analytics" />
                        <PrivacyItem text="Store signing history externally" />
                        <PrivacyItem text="Collect personal information" />
                        <PrivacyItem text="Share certificates or keys" />
                        <PrivacyItem text="Phone home or check licenses" />
                        <PrivacyItem text="Display advertisements" />
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}
