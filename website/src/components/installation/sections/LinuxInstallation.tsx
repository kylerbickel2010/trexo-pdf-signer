
import React, { useState } from 'react';
import { Terminal, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/ui/button';
import { Step } from '@/components/ui/step';
import { CodeBlock } from '@/components/ui/code-block';
import { DOWNLOAD_URLS } from '@/utils/constants';
import { cn } from '@/utils/utils';

type LinuxTab = 'ubuntu' | 'fedora' | 'arch' | 'generic';

interface LinuxInstallationProps {
    id: string;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function LinuxInstallation({ id, isCompleted, onToggleComplete }: LinuxInstallationProps) {
    const [linuxTab, setLinuxTab] = useState<LinuxTab>('ubuntu');

    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader
                icon={Terminal}
                title="Linux Installation"
                time="5 min"
                isCompleted={isCompleted}
                onToggleComplete={onToggleComplete}
            />
            <div className="glass-card p-6">
                {/* Distribution Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 p-1 bg-secondary/50 rounded-xl border border-border">
                    {(['ubuntu', 'fedora', 'arch', 'generic'] as LinuxTab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setLinuxTab(tab)}
                            className={cn(
                                "flex-1 min-w-[100px] px-4 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer",
                                linuxTab === tab
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            {tab === 'ubuntu' && 'Ubuntu/Debian'}
                            {tab === 'fedora' && 'Fedora/RHEL'}
                            {tab === 'arch' && 'Arch Linux'}
                            {tab === 'generic' && 'Other'}
                        </button>
                    ))}
                </div>

                {/* Ubuntu/Debian */}
                {linuxTab === 'ubuntu' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                                <strong className="text-emerald-400">Java Included!</strong> The .deb package includes a bundled Java 8 runtime.
                                No separate Java installation is required.
                            </p>
                        </div>
                        <Step number={1} title="Download and Install .deb Package">
                            <CodeBlock code={`wget ${DOWNLOAD_URLS.linuxDeb}\nsudo dpkg -i trexo-pdf-signer-x64.deb`} />
                        </Step>
                        <Step number={2} title="Launch Trexo PDF Signer">
                            <p className="text-muted-foreground mb-3">
                                Run from terminal or find "Trexo PDF Signer" in your applications menu:
                            </p>
                            <CodeBlock code="emark" />
                            <p className="text-sm text-muted-foreground mt-3">
                                <strong>Memory Profiles:</strong> Use different commands for larger memory allocation:
                            </p>
                            <ul className="mt-2 space-y-1 text-xs text-muted-foreground font-mono">
                                <li>• emark (2GB)</li>
                                <li>• emark-large (4GB)</li>
                                <li>• emark-xlarge (8GB)</li>
                            </ul>
                        </Step>
                    </div>
                )}

                {/* Fedora/RHEL */}
                {linuxTab === 'fedora' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-2">
                            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                                <strong className="text-amber-400">Note:</strong> RPM package not yet available. Use the JAR file with Java 8 installed.
                            </p>
                        </div>
                        <Step number={1} title="Install Java 8">
                            <p className="text-sm text-red-400 mb-3">
                                ⚠️ You must install Java 8 specifically. Higher versions will not work.
                            </p>
                            <CodeBlock code="sudo dnf install java-1.8.0-openjdk" />
                        </Step>
                        <Step number={2} title="Download the JAR File">
                            <CodeBlock code={`wget ${DOWNLOAD_URLS.jar}`} />
                        </Step>
                        <Step number={3} title="Run Trexo PDF Signer">
                            <CodeBlock code="java -jar Trexo-PDF-Signer.jar" />
                        </Step>
                    </div>
                )}

                {/* Arch Linux */}
                {linuxTab === 'arch' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-2">
                            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                                <strong className="text-amber-400">Note:</strong> AUR package not yet available. Use the JAR file with Java 8 installed.
                            </p>
                        </div>
                        <Step number={1} title="Install Java 8 from AUR">
                            <p className="text-sm text-red-400 mb-3">
                                ⚠️ You must install Java 8 specifically. Higher versions will not work.
                            </p>
                            <CodeBlock code={`yay -S jdk8-openjdk\nsudo archlinux-java set java-8-openjdk`} />
                        </Step>
                        <Step number={2} title="Download the JAR File">
                            <CodeBlock code="wget https://github.com/trexolab-solution/trexo-pdf-signer/releases/latest/download/Trexo-PDF-Signer.jar" />
                        </Step>
                        <Step number={3} title="Run Trexo PDF Signer">
                            <CodeBlock code="java -jar Trexo-PDF-Signer.jar" />
                        </Step>
                    </div>
                )}

                {/* Generic */}
                {linuxTab === 'generic' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-2">
                            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                                <strong className="text-amber-400">Note:</strong> For other distributions, use the JAR file with Java 8 installed.
                            </p>
                        </div>
                        <Step number={1} title="Verify Java 8 is Installed">
                            <p className="text-muted-foreground mb-3">
                                Check your Java version:
                            </p>
                            <CodeBlock code="java -version" />
                            <p className="text-sm text-muted-foreground mt-3">
                                Output must show <code className="code-inline">1.8.x</code>.
                                If you see 11, 17, 21, or any other version, install Java 8 for your distribution.
                            </p>
                        </Step>
                        <Step number={2} title="Download JAR File">
                            <a href="https://github.com/trexolab-solution/trexo-pdf-signer/releases/latest/download/Trexo-PDF-Signer.jar">
                                <Button variant="outline" className="gap-2 cursor-pointer">
                                    <Download className="w-4 h-4" />
                                    Download Trexo-PDF-Signer.jar
                                </Button>
                            </a>
                        </Step>
                        <Step number={3} title="Run Trexo PDF Signer">
                            <CodeBlock code="java -jar Trexo-PDF-Signer.jar" />
                        </Step>
                    </div>
                )}
            </div>
        </AnimatedSection>
    );
}
