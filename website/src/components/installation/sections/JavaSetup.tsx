
import React from 'react';
import { Settings, AlertTriangle, Info } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { CodeBlock } from '@/components/ui/code-block';

interface JavaSetupProps {
    id: string;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function JavaSetup({ id, isCompleted, onToggleComplete }: JavaSetupProps) {
    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader
                icon={Settings}
                title="Java 8 Setup Guide"
                time="3 min"
                isCompleted={isCompleted}
                onToggleComplete={onToggleComplete}
            />
            <div className="glass-card p-6 space-y-6">
                {/* Warning */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-red-400">Java 8 Only — No Higher Versions</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Trexo PDF Signer is compiled for Java 8 and uses APIs specific to that version.
                            Java 11, 17, 21, and newer versions will cause runtime errors.
                        </p>
                    </div>
                </div>

                {/* Verify Version */}
                <div>
                    <h3 className="font-semibold mb-3">Verify Your Java Version</h3>
                    <p className="text-muted-foreground mb-3">Run this command to check:</p>
                    <CodeBlock code="java -version" />

                    <div className="mt-4 grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <p className="text-sm font-medium text-emerald-400 mb-2">✓ Correct Output</p>
                            <code className="text-xs text-muted-foreground">openjdk version "1.8.0_XXX"</code>
                        </div>
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <p className="text-sm font-medium text-red-400 mb-2">✗ Wrong Version</p>
                            <code className="text-xs text-muted-foreground">openjdk version "17.0.X" or "21.0.X"</code>
                        </div>
                    </div>
                </div>

                {/* Multiple Java Versions */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-blue-400 mb-1">Multiple Java Versions?</p>
                        <p className="text-sm text-muted-foreground">
                            If you have multiple Java versions installed, set <code className="code-inline">JAVA_HOME</code> to Java 8,
                            or use a version manager like <strong>SDKMAN</strong>:
                        </p>
                        <CodeBlock code="sdk use java 8.0.XXX-open" className="mt-3" />
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}
