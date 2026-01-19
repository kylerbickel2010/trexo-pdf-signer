
import React from 'react';
import { BookOpen, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { FeatureCard } from '@/components/common/FeatureCard';

interface OverviewSectionProps {
    id: string;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function OverviewSection({ id, isCompleted, onToggleComplete }: OverviewSectionProps) {
    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader
                icon={BookOpen}
                title="Overview"
                time="2 min"
                isCompleted={isCompleted}
                onToggleComplete={onToggleComplete}
            />
            <div className="glass-card p-6 space-y-6">
                <p className="text-muted-foreground leading-relaxed text-lg">
                    Trexo PDF Signer is a professional PDF signing application that creates legally valid digital signatures
                    compatible with Adobe Reader and other major PDF applications. It supports multiple certificate
                    sources and complies with international standards.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                    <FeatureCard title="Cross-Platform" description="Works on Windows, Linux, and macOS with consistent features" />
                    <FeatureCard title="Multiple Certificate Sources" description="PKCS#12/PFX files, USB tokens, Windows Certificate Store" />
                    <FeatureCard title="Standards Compliant" description="PAdES-B, PAdES-T, PAdES-LT signature levels" />
                    <FeatureCard title="100% Offline" description="All processing happens locally, no cloud uploads" />
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                        <strong className="text-blue-400">Tip:</strong> For installation instructions, visit the{' '}
                        <Link to="/installation" className="text-primary hover:underline font-medium">Installation Guide</Link>.
                    </p>
                </div>
            </div>
        </AnimatedSection>
    );
}
