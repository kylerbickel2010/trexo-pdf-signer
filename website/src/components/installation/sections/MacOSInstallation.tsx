
import React from 'react';
import { Apple, CheckCircle, Download } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/ui/button';
import { Step } from '@/components/ui/step';
import { CodeBlock } from '@/components/ui/code-block';
import { DOWNLOAD_URLS } from '@/utils/constants';

interface MacOSInstallationProps {
    id: string;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function MacOSInstallation({ id, isCompleted, onToggleComplete }: MacOSInstallationProps) {
    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader
                icon={Apple}
                title="macOS Installation"
                time="2 min"
                isCompleted={isCompleted}
                onToggleComplete={onToggleComplete}
            />
            <div className="glass-card p-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                        <strong className="text-emerald-400">Java Included!</strong> The macOS DMG installer includes a bundled Java 8 runtime.
                        No separate Java installation is required.
                    </p>
                </div>

                <div className="space-y-8">
                    <Step number={1} title="Download the DMG Installer">
                        <p className="text-muted-foreground mb-4">
                            Download the latest macOS installer (.dmg) from GitHub releases.
                        </p>
                        <a href={DOWNLOAD_URLS.macDmg}>
                            <Button className="gap-2 btn-gradient text-white border-0 cursor-pointer">
                                <Download className="w-4 h-4" />
                                Download trexo-pdf-signer-x64-macos.dmg
                            </Button>
                        </a>
                    </Step>
                    <Step number={2} title="Install the Application">
                        <p className="text-muted-foreground">
                            Open the downloaded DMG file and drag Trexo PDF Signer to your Applications folder.
                        </p>
                    </Step>
                    <Step number={3} title="Launch Trexo PDF Signer">
                        <p className="text-muted-foreground">
                            Open Trexo PDF Signer from your Applications folder or Spotlight.
                        </p>
                        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                            <p className="text-sm text-amber-500">
                                <strong>Gatekeeper Note:</strong> On first launch, you may need to right-click and select "Open" to bypass Gatekeeper,
                                or go to System Preferences → Security & Privacy and click "Open Anyway".
                            </p>
                        </div>
                    </Step>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border">
                    <p className="text-sm text-muted-foreground">
                        <strong>Alternative:</strong> If you prefer to use the JAR file with your own Java 8 installation:
                    </p>
                    <CodeBlock code="java -jar Trexo-PDF-Signer.jar" className="mt-3" />
                </div>
            </div>
        </AnimatedSection>
    );
}
