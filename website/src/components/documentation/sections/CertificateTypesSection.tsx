
import React from 'react';
import { Key } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { CertificateType } from '../CertificateType';

interface CertificateTypesSectionProps {
    id: string;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function CertificateTypesSection({ id, isCompleted, onToggleComplete }: CertificateTypesSectionProps) {
    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader
                icon={Key}
                title="Certificate Types"
                time="4 min"
                isCompleted={isCompleted}
                onToggleComplete={onToggleComplete}
            />
            <div className="glass-card p-6 space-y-6">
                <CertificateType
                    title="PKCS#12 / PFX Files"
                    description="File-based certificates containing both public certificate and private key. Select your PFX/P12 file directly when signing - no import required."
                    features={[
                        'Select PFX file at signing time',
                        'Password requested on each use (never stored)',
                        'No certificate import or storage needed',
                        'Works on all platforms (.p12 and .pfx)',
                    ]}
                    securityNote="Your certificate password is never stored - enter it each time you sign"
                />

                <CertificateType
                    title="PKCS#11 Hardware Tokens"
                    description="USB security tokens and smart cards that store private keys in tamper-resistant hardware. Recommended for high-security applications."
                    features={[
                        'Private key never leaves hardware',
                        'PIN-protected access',
                        'Meets highest security standards',
                        'Required for government/legal documents',
                    ]}
                    recommended
                />

                <CertificateType
                    title="Windows Certificate Store"
                    description="Native Windows integration for certificates installed in the system certificate store. Useful in enterprise environments."
                    features={[
                        'Centralized certificate management',
                        'Active Directory integration',
                        'Single sign-on compatible',
                        'Windows only',
                    ]}
                    platformNote="Windows"
                />
            </div>
        </AnimatedSection>
    );
}
