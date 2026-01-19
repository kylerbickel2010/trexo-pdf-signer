
import React from 'react';
import { Trash2, Monitor, Terminal, Apple, Info } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Step } from '@/components/ui/step';
import { CodeBlock } from '@/components/ui/code-block';
import { Coffee } from 'lucide-react';

interface UninstallGuideProps {
    id: string;
    isCompleted: boolean;
    onToggleComplete: () => void;
}

export function UninstallGuide({ id, isCompleted, onToggleComplete }: UninstallGuideProps) {
    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader
                icon={Trash2}
                title="Clean Uninstall Guide"
                time="2 min"
                isCompleted={isCompleted}
                onToggleComplete={onToggleComplete}
            />
            <div className="glass-card p-6 space-y-6">
                <p className="text-muted-foreground">
                    Follow these instructions to completely remove Trexo PDF Signer and all associated data from your system.
                </p>

                {/* Windows Uninstall */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Monitor className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold">Windows</h3>
                    </div>
                    <div className="pl-4 border-l-2 border-border/50 ml-5 space-y-6">
                        <Step number={1} title="Uninstall via Windows Settings">
                            <p className="text-muted-foreground mb-3">
                                Open Windows Settings and uninstall Trexo PDF Signer:
                            </p>
                            <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4">
                                <li>Open <strong>Settings</strong> → <strong>Apps</strong> → <strong>Installed Apps</strong></li>
                                <li>Search for "Trexo PDF Signer"</li>
                                <li>Click the three dots menu → <strong>Uninstall</strong></li>
                            </ul>
                            <p className="text-sm text-muted-foreground mt-3 mb-2">
                                <strong>Alternative:</strong> Run the uninstaller directly from:
                            </p>
                            <CodeBlock code="C:\Program Files\Trexo PDF Signer\unins000.exe" />
                        </Step>
                        <Step number={2} title="Remove User Data (Optional)">
                            <p className="text-muted-foreground mb-3">
                                Delete the configuration folder to remove all settings and preferences:
                            </p>
                            <CodeBlock code={`rmdir /s /q "%USERPROFILE%\\.trexo-pdf-signer"`} />
                            <p className="text-xs text-muted-foreground mt-2 opacity-70">
                                This folder contains: config.yml, logs, and cached data.
                            </p>
                        </Step>
                        <Step number={3} title="Remove Registry Entries (Optional)">
                            <p className="text-muted-foreground mb-3">
                                The uninstaller removes registry entries automatically. If needed, manually check:
                            </p>
                            <CodeBlock code={`HKEY_CURRENT_USER\\Software\\Trexo PDF Signer\nHKEY_LOCAL_MACHINE\\SOFTWARE\\Trexo PDF Signer`} />
                        </Step>
                    </div>
                </div>

                {/* Linux Uninstall */}
                <div className="space-y-4 pt-8 border-t border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                            <Terminal className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="text-lg font-semibold">Linux</h3>
                    </div>
                    <div className="pl-4 border-l-2 border-border/50 ml-5 space-y-6">
                        <Step number={1} title="Uninstall Package">
                            <p className="text-muted-foreground mb-3">
                                Remove the installed package:
                            </p>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Debian/Ubuntu (.deb):</p>
                                    <CodeBlock code="sudo dpkg -r trexo-pdf-signer" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Or using apt:</p>
                                    <CodeBlock code="sudo apt remove trexo-pdf-signer" />
                                </div>
                            </div>
                        </Step>
                        <Step number={2} title="Manual Cleanup (Complete Removal)">
                            <p className="text-muted-foreground mb-3">
                                To completely remove all traces of the application, including system files and user preferences:
                            </p>
                            <CodeBlock code={`# 1. Remove application files\nsudo rm -rf /opt/trexo-pdf-signer\n\n# 2. Remove user configuration\nrm -rf ~/.trexo-pdf-signer\n\n# 3. Remove Java user preferences for Trexo PDF Signer\nrm -rf ~/.java/.userPrefs/Trexo_PDF_Signer`} />
                        </Step>
                        <Step number={3} title="Remove Desktop Entry (If Exists)">
                            <p className="text-muted-foreground mb-3">
                                Remove any leftover desktop shortcuts:
                            </p>
                            <CodeBlock code={`rm -f ~/.local/share/applications/emark*.desktop\nsudo rm -f /usr/share/applications/emark*.desktop`} />
                        </Step>
                    </div>
                </div>

                {/* macOS Uninstall */}
                <div className="space-y-4 pt-8 border-t border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center">
                            <Apple className="w-5 h-5 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold">macOS</h3>
                    </div>
                    <div className="pl-4 border-l-2 border-border/50 ml-5 space-y-6">
                        <Step number={1} title="Remove Application">
                            <p className="text-muted-foreground mb-3">
                                Move Trexo PDF Signer to Trash:
                            </p>
                            <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-4 mb-3">
                                <li>Open <strong>Finder</strong> → <strong>Applications</strong></li>
                                <li>Right-click on <strong>Trexo PDF Signer</strong> → <strong>Move to Trash</strong></li>
                                <li>Empty Trash to complete removal</li>
                            </ul>
                            <p className="text-sm text-muted-foreground mb-2">
                                <strong>Or via Terminal:</strong>
                            </p>
                            <CodeBlock code="sudo rm -rf /Applications/Trexo\\ PDF\\ Signer.app" />
                        </Step>
                        <Step number={2} title="Remove User Data (Optional)">
                            <p className="text-muted-foreground mb-3">
                                Delete configuration and cache files:
                            </p>
                            <CodeBlock code={`rm -rf ~/.trexo-pdf-signer\nrm -rf ~/Library/Application\\ Support/Trexo\\ PDF\\ Signer\nrm -rf ~/Library/Caches/Trexo\\ PDF\\ Signer\nrm -rf ~/Library/Preferences/com.trexolab.trexo-pdf-signer.plist`} />
                        </Step>
                    </div>
                </div>

                {/* JAR File Users */}
                <div className="space-y-4 pt-8 border-t border-border/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Coffee className="w-5 h-5 text-amber-400" />
                        </div>
                        <h3 className="text-lg font-semibold">JAR File Users</h3>
                    </div>
                    <div className="pl-4 border-l-2 border-border/50 ml-5">
                        <p className="text-muted-foreground mb-3">
                            If you used the standalone JAR file:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground list-decimal pl-4">
                            <li>Delete the <code className="code-inline">Trexo-PDF-Signer.jar</code> file</li>
                            <li>Remove configuration: <code className="code-inline">~/.trexo-pdf-signer</code> (Linux/macOS) or <code className="code-inline">%USERPROFILE%\.trexo-pdf-signer</code> (Windows)</li>
                        </ul>
                    </div>
                </div>

                {/* Info Note */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-blue-400 mb-1">What Gets Removed?</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            <strong>Application files:</strong> Program binaries, bundled JRE, resources<br />
                            <strong>User data (~/.trexo-pdf-signer):</strong> config.yml, logs, signature preferences, timestamp server settings<br />
                            <strong className="text-foreground">Note:</strong> Your signed PDF files are NOT affected by uninstalling Trexo PDF Signer.
                        </p>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}
