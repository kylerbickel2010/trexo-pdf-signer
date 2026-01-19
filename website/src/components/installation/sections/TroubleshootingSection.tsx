
import React, { useState } from 'react';
import { HelpCircle, Search, BookOpen, ExternalLink, RefreshCw } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionHeader } from '@/components/common/SectionHeader';
import { TroubleshootItem } from '../TroubleshootItem';

interface TroubleshootingSectionProps {
    id: string;
}

export function TroubleshootingSection({ id }: TroubleshootingSectionProps) {
    const [filter, setFilter] = useState('');

    const clearFilter = () => setFilter('');

    const troubleshootingItems = [
        {
            title: "Java not found / 'java' is not recognized",
            solution: "Java 8 is not installed or not in your PATH. Install Java 8 and ensure JAVA_HOME is set correctly. Run 'java -version' to verify — you must see version 1.8.x.",
            category: "java" as const
        },
        {
            title: "Application won't start or crashes immediately",
            solution: "This usually means wrong Java version. Trexo PDF Signer requires EXACTLY Java 8. If 'java -version' shows 11, 17, 21, or anything other than 1.8.x, install Java 8 and set it as your default.",
            category: "java" as const
        },
        {
            title: "UnsupportedClassVersionError",
            solution: "This error confirms you're using a Java version other than 8. Install Java 8 (OpenJDK 8 or Oracle JDK 8) and make sure it's the active version.",
            category: "java" as const
        },
        {
            title: "Certificate not detected",
            solution: "For USB tokens, ensure the manufacturer's drivers are installed. For file-based certificates (.p12/.pfx), verify the file path is correct and you have the right password.",
            category: "certificate" as const
        },
        {
            title: "Signature validation fails",
            solution: "The signing certificate may not be trusted by the PDF reader. Import the CA certificate into your trust store, or use a certificate from a recognized Certificate Authority.",
            category: "certificate" as const
        },
        {
            title: "PDF won't open / displays incorrectly",
            solution: "Verify the PDF is not corrupted. Try opening it in another PDF viewer first. Some heavily encrypted or DRM-protected PDFs may not be supported.",
            category: "pdf" as const
        },
        {
            title: "Token PIN is locked",
            solution: "When a token PIN is locked after multiple failed attempts, you must use the token manufacturer's management software to unlock or reset it. Trexo PDF Signer cannot unlock hardware tokens - this is a security feature. Contact your token vendor for specific instructions.",
            category: "certificate" as const
        },
        {
            title: "PKCS#11 library not found",
            solution: "The PKCS#11 library path may be incorrect. Common paths: Windows: C:\\Windows\\System32\\*.dll, Linux: /usr/lib/*.so, macOS: /usr/local/lib/*.dylib. Check your token manufacturer's documentation for the exact library location.",
            category: "certificate" as const
        },
        {
            title: "Timestamp server connection failed",
            solution: "Ensure you have internet connection. Check if a proxy is required (Settings → Network). The default TSA server (timestamp.comodoca.com) may be temporarily unavailable - try alternative servers like DigiCert or Sectigo.",
            category: "pdf" as const
        },
        {
            title: "Signature appears valid but 'untrusted'",
            solution: "The signing certificate's Certificate Authority (CA) is not in your PDF reader's trust store. In Trexo PDF Signer: Settings → Trust Certificates, add the CA certificate. In Adobe Reader: Edit → Preferences → Signatures → Identities & Trusted Certificates.",
            category: "certificate" as const
        },
        {
            title: "Configuration file location",
            solution: "Trexo PDF Signer configuration is stored in ~/.trexo-pdf-signer/config.yml (your home directory). On Windows: C:\\Users\\YourName\\.trexo-pdf-signer\\config.yml. You can edit this YAML file to configure timestamp servers, proxy settings, and PKCS#11 paths.",
            category: "java" as const
        },
        {
            title: "macOS: 'App is damaged and can't be opened'",
            solution: "This is a known macOS Gatekeeper issue. Open Terminal and run: xattr -cr /Applications/Trexo\\ PDF\\ Signer.app to clear the quarantine attribute. Then try opening the app again.",
            category: "java" as const
        },
        {
            title: "macOS: App opens and closes immediately (Silent Failure)",
            solution: "If the app fails to launch silently, it might be due to line-ending issues in the launcher script or Java permission errors. Open Terminal and run: /Applications/Trexo\\ PDF\\ Signer.app/Contents/MacOS/run-trexo to see the actual error message.",
            category: "java" as const
        },
    ];

    return (
        <AnimatedSection id={id} className="scroll-mt-24" threshold={0.1}>
            <SectionHeader icon={HelpCircle} title="Troubleshooting" description="Common issues and how to fix them." />
            <div className="glass-card p-6 space-y-6">
                {/* Search/Filter */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search issues (e.g., 'java', 'token', 'error')..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-secondary/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground"
                    />
                    {filter && (
                        <button
                            onClick={clearFilter}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-border/50 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {troubleshootingItems.map((item, index) => (
                        <TroubleshootItem
                            key={index}
                            title={item.title}
                            solution={item.solution}
                            filter={filter}
                            category={item.category}
                        />
                    ))}
                    {/* Empty State */}
                    {filter && !troubleshootingItems.some(i =>
                        i.title.toLowerCase().includes(filter.toLowerCase()) ||
                        i.solution.toLowerCase().includes(filter.toLowerCase()) ||
                        i.category?.toLowerCase().includes(filter.toLowerCase())
                    ) && (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No issues found matching "{filter}"</p>
                                <button onClick={clearFilter} className="text-primary hover:underline text-sm mt-2">Clear search</button>
                            </div>
                        )}
                </div>

                {/* Help Links */}
                <div className="mt-8 p-6 rounded-2xl bg-linear-to-r from-primary/10 via-cyan-500/5 to-transparent border border-primary/20">
                    <div className="flex items-start gap-5">
                        <div className="p-3 rounded-xl bg-primary/20 text-primary">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-semibold text-lg mb-2 text-foreground">Still having issues?</p>
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                We're here to help! Our team and community are active on GitHub.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="https://github.com/trexolab-solution/trexo-pdf-signer/wiki"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-border border border-border text-sm transition-colors font-medium"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Read Documentation
                                </a>
                                <a
                                    href="https://github.com/trexolab-solution/trexo-pdf-signer/issues"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 text-sm transition-all font-medium"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Report an Issue
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}
