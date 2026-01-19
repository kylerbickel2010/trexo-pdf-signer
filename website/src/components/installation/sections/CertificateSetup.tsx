
import React from 'react';
import { Shield } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { CertificateOption } from '../CertificateOption';

interface CertificateSetupProps {
    id: string;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function CertificateSetup({ id, isCompleted, onToggleComplete }: CertificateSetupProps) {
    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader
                icon={Shield}
                title="Certificate Setup"
                time="3 min"
                isCompleted={isCompleted}
                onToggleComplete={onToggleComplete}
            />
            <div className="glass-card p-6">
                <p className="text-muted-foreground mb-6">
                    Trexo PDF Signer supports multiple certificate sources for digitally signing your PDF documents:
                </p>

                <div className="grid gap-4">
                    <CertificateOption
                        title="PKCS#12 / PFX Files"
                        description="Select your certificate file (.p12 or .pfx) directly when signing - no import needed. Your password is requested each time and never stored."
                    />
                    <CertificateOption
                        title="USB Security Tokens / Smart Cards"
                        description="Configure PKCS#11 provider in settings. Trexo PDF Signer detects compatible USB tokens (SafeNet, YubiKey, etc.) and smart cards for hardware-based signing."
                    />
                    <CertificateOption
                        title="Windows Certificate Store"
                        description="On Windows, Trexo PDF Signer can access certificates installed in the Windows Certificate Store (certmgr). Enable this option in Security settings."
                        windows
                    />
                </div>
            </div>
        </AnimatedSection>
    );
}
