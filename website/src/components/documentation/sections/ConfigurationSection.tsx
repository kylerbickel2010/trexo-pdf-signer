
import React from 'react';
import { Settings } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ConfigPath } from '../ConfigPath';

interface ConfigurationSectionProps {
    id: string;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function ConfigurationSection({ id, isCompleted, onToggleComplete }: ConfigurationSectionProps) {
    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader
                icon={Settings}
                title="Configuration"
                time="3 min"
                isCompleted={isCompleted}
                onToggleComplete={onToggleComplete}
            />
            <div className="glass-card p-6 space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Configuration File Location</h3>
                    <div className="space-y-3">
                        <ConfigPath os="Windows" path="C:\Users\YourName\.trexo-pdf-signer\config.yml" />
                        <ConfigPath os="Linux/macOS" path="~/.trexo-pdf-signer/config.yml" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Memory Profiles</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                        For large PDFs, use different memory profiles:
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Profile</th>
                                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Heap Size</th>
                                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">RAM Required</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr>
                                    <td className="py-2 px-3">Normal</td>
                                    <td className="py-2 px-3">2GB</td>
                                    <td className="py-2 px-3">4GB</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3">Large</td>
                                    <td className="py-2 px-3">4GB</td>
                                    <td className="py-2 px-3">8GB</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3">Extra Large</td>
                                    <td className="py-2 px-3">8GB</td>
                                    <td className="py-2 px-3">16GB</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}
