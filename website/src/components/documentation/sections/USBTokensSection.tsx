
import React from 'react';
import { HardDrive } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { TokenCard } from '../TokenCard';

interface USBTokensSectionProps {
    id: string;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function USBTokensSection({ id, isCompleted, onToggleComplete }: USBTokensSectionProps) {
    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader
                icon={HardDrive}
                title="Supported USB Tokens"
                time="3 min"
                isCompleted={isCompleted}
                onToggleComplete={onToggleComplete}
            />
            <div className="glass-card p-6 space-y-6">
                <p className="text-muted-foreground">
                    Trexo PDF Signer supports most PKCS#11 compatible USB tokens and hardware security modules.
                </p>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Tested Devices</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <TokenCard name="HYP2003" vendor="HyperPKI" />
                        <TokenCard name="ProxKey Token" vendor="Watchdata" />
                        <TokenCard name="mToken CryptoID" vendor="Longmai" />
                        <TokenCard name="SOFT HSM" vendor="Software HSM" />
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <h4 className="font-medium text-blue-400 mb-2">Setup Instructions</h4>
                    <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                        <li>Install token driver from manufacturer</li>
                        <li>Configure PKCS#11 library path in Trexo PDF Signer Settings → Security</li>
                        <li>Insert token and enter PIN when prompted</li>
                        <li>Select certificate and sign</li>
                    </ol>
                </div>
            </div>
        </AnimatedSection>
    );
}
