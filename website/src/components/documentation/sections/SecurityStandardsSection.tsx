
import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { StandardCard } from '../StandardCard';

interface SecurityStandardsSectionProps {
    id: string;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function SecurityStandardsSection({ id, isCompleted, onToggleComplete }: SecurityStandardsSectionProps) {
    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader
                icon={Shield}
                title="Security & Standards"
                time="4 min"
                isCompleted={isCompleted}
                onToggleComplete={onToggleComplete}
            />
            <div className="glass-card p-6 space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Compliance Standards</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <StandardCard standard="ISO 32000" description="PDF specification compliance" />
                        <StandardCard standard="PAdES" description="PDF Advanced Electronic Signatures" />
                        <StandardCard standard="PKCS#7" description="Cryptographic Message Syntax" />
                        <StandardCard standard="PKCS#11 v2.40" description="Hardware security device interface" />
                        <StandardCard standard="RFC 3161" description="Timestamping protocol" />
                        <StandardCard standard="RFC 5280" description="X.509 certificate validation" />
                        <StandardCard standard="RFC 6960" description="Online Certificate Status Protocol" />
                        <StandardCard standard="DSC (India)" description="Digital Signature Certificate support" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Certificate Validation Process</h3>
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-white/10">
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>1. Certificate Chain Verification (Root CA → End Entity)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>2. Validity Period Check (Not Before ≤ Now ≤ Not After)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>3. Revocation Check (OCSP and/or CRL)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>4. Key Usage Verification (Digital Signature, Non-Repudiation)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>5. Trust Anchor Validation (Trusted Root CA Store)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>6. Signature Integrity Check (Hash comparison)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}
