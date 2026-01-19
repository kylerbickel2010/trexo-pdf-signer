
import React from 'react';
import { Monitor, CheckCircle, Download } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/ui/button';
import { Step } from '@/components/ui/step';
import { DOWNLOAD_URLS } from '@/utils/constants';

interface WindowsInstallationProps {
    id: string;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function WindowsInstallation({ id, isCompleted, onToggleComplete }: WindowsInstallationProps) {
    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader
                icon={Monitor}
                title="Windows Installation"
                time="2 min"
                isCompleted={isCompleted}
                onToggleComplete={onToggleComplete}
            />
            <div className="glass-card p-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                        <strong className="text-emerald-400">Java Included!</strong> The Windows installer includes a bundled Java 8 runtime.
                        No separate Java installation is required.
                    </p>
                </div>

                <div className="space-y-8">
                    <Step number={1} title="Download the Installer">
                        <p className="text-muted-foreground mb-4">
                            Download the latest Windows installer (.exe) from GitHub releases.
                        </p>
                        <a href={DOWNLOAD_URLS.windowsInstaller}>
                            <Button className="gap-2 btn-gradient text-white border-0 cursor-pointer w-full sm:w-auto">
                                <Download className="w-4 h-4" />
                                Download trexo-pdf-signer-x64-setup.exe
                            </Button>
                        </a>
                    </Step>

                    <Step number={2} title="Run the Installer">
                        <p className="text-muted-foreground">
                            Double-click the downloaded installer file.
                            If Windows SmartScreen appears, click "More info" → "Run anyway".
                            Follow the installation wizard to complete the setup.
                        </p>
                        <ul className="mt-3 space-y-1 text-sm text-muted-foreground pl-4 border-l-2 border-border/50">
                            <li>• Choose installation type: Per-user (current user) or Per-machine (all users)</li>
                        </ul>
                    </Step>

                    <Step number={3} title="Launch Trexo PDF Signer">
                        <p className="text-muted-foreground">
                            After installation completes, launch Trexo PDF Signer from:
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-muted-foreground mb-4">
                            <li>• Start Menu → Trexo PDF Signer</li>
                            <li>• Desktop shortcut (if created)</li>
                        </ul>
                        <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                            <p className="text-xs font-semibold text-foreground mb-1">
                                Memory Profiles:
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Three shortcuts are available for different memory needs: Normal (2GB), Large (4GB), Extra Large (8GB).
                            </p>
                        </div>
                    </Step>
                </div>
            </div>
        </AnimatedSection>
    );
}
