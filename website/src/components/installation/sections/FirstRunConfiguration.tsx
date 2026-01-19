
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Step } from '@/components/ui/step';

interface FirstRunConfigurationProps {
    id: string;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function FirstRunConfiguration({ id, isCompleted, onToggleComplete }: FirstRunConfigurationProps) {
    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader
                icon={CheckCircle}
                title="First Run & Configuration"
                time="2 min"
                isCompleted={isCompleted}
                onToggleComplete={onToggleComplete}
            />
            <div className="glass-card p-6">
                <div className="space-y-8">
                    <Step number={1} title="Launch Trexo PDF Signer">
                        <p className="text-muted-foreground">
                            Start Trexo PDF Signer from your applications menu, desktop shortcut, or terminal.
                        </p>
                    </Step>

                    <Step number={2} title="Configure Your Certificate">
                        <p className="text-muted-foreground">
                            Navigate to <strong>Settings → Security</strong> and configure your certificate source:
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-muted-foreground pl-4 border-l-2 border-border/50">
                            <li>• Select your .p12/.pfx file, or</li>
                            <li>• Configure PKCS#11 for USB tokens, or</li>
                            <li>• Enable Windows Certificate Store (Windows only)</li>
                        </ul>
                    </Step>

                    <Step number={3} title="Open a PDF Document">
                        <p className="text-muted-foreground">
                            Open a PDF file using <strong>File → Open</strong> or simply drag and drop a PDF onto the Trexo PDF Signer window.
                        </p>
                    </Step>

                    <Step number={4} title="Sign Your Document">
                        <p className="text-muted-foreground">
                            Click the signature tool in the toolbar, draw a signature box on the page,
                            select your certificate, and save the signed document.
                        </p>
                    </Step>
                </div>
            </div>
        </AnimatedSection>
    );
}
