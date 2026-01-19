
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowUp, Sparkles, BookOpen, Clock, Zap } from 'lucide-react';
import { SEO, structuredDataGenerators } from '@/components/common';
import { Sidebar } from '@/components/common/Sidebar';
import { documentationSections } from '@/data/documentation-data';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useScrollSpy } from '@/hooks/useScrollSpy';

// Import Sections
import { OverviewSection } from '@/components/documentation/sections/OverviewSection';
import { CertificateTypesSection } from '@/components/documentation/sections/CertificateTypesSection';
import { DigitalSigningSection } from '@/components/documentation/sections/DigitalSigningSection';
import { SecurityStandardsSection } from '@/components/documentation/sections/SecurityStandardsSection';
import { TimestampingSection } from '@/components/documentation/sections/TimestampingSection';
import { PrivacySection } from '@/components/documentation/sections/PrivacySection';
import { USBTokensSection } from '@/components/documentation/sections/USBTokensSection';
import { ConfigurationSection } from '@/components/documentation/sections/ConfigurationSection';

export default function Documentation() {
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();

  // Use scroll spy specifically for documentation sections
  // Adding a slight offset to account for the header
  const sectionIds = documentationSections.map(s => s.id);
  const activeSection = useScrollSpy(sectionIds, 150);

  const toggleSectionComplete = useCallback((sectionId: string) => {
    setCompletedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const breadcrumbStructuredData = structuredDataGenerators.breadcrumb([
    { name: 'Home', url: 'https://trexolab-solution.github.io/trexo-pdf-signer/' },
    { name: 'Documentation', url: 'https://trexolab-solution.github.io/trexo-pdf-signer/#/documentation' },
  ]);

  return (
    <>
      <SEO
        title="Documentation - Trexo PDF Signer"
        description="Complete documentation for Trexo PDF Signer. Learn about digital certificates, PKCS#11 tokens, signature standards, timestamping, and security features."
        keywords="Trexo PDF Signer documentation, PDF signing guide, digital certificate tutorial, PKCS#11 guide, PAdES signatures, RFC 3161 timestamp, USB token signing"
        url="https://trexolab-solution.github.io/trexo-pdf-signer/#/documentation"
        structuredData={breadcrumbStructuredData}
      />
      <article className="min-h-screen">
        {/* API-Like Hero Section */}
        <header
          ref={heroRef}
          className={`relative py-20 border-b border-border overflow-hidden transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] opacity-30 pointer-events-none" />

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">Documentation</span>
            </nav>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="flex-1 max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary text-primary border border-primary/20 uppercase tracking-wider">
                    Official Guide
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-foreground">
                  Documentation
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Comprehensive guide to Trexo PDF Signer's features, security architecture, certificate management,
                  and advanced configuration options.
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
                  <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>~20 min read time</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>{documentationSections.length} sections</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12 relative">
            {/* Sidebar Navigation */}
            <Sidebar
              sections={documentationSections}
              activeSection={activeSection || 'overview'}
              completedSections={completedSections}
              onSectionClick={scrollToSection}
              onToggleComplete={toggleSectionComplete}
            />

            {/* Main Content */}
            <main className="flex-1 min-w-0 space-y-16 lg:pt-2">
              <OverviewSection
                id="overview"
                isCompleted={completedSections.has('overview')}
                onToggleComplete={() => toggleSectionComplete('overview')}
              />

              <CertificateTypesSection
                id="certificates"
                isCompleted={completedSections.has('certificates')}
                onToggleComplete={() => toggleSectionComplete('certificates')}
              />

              <DigitalSigningSection
                id="signing"
                isCompleted={completedSections.has('signing')}
                onToggleComplete={() => toggleSectionComplete('signing')}
              />

              <SecurityStandardsSection
                id="security"
                isCompleted={completedSections.has('security')}
                onToggleComplete={() => toggleSectionComplete('security')}
              />

              <TimestampingSection
                id="timestamping"
                isCompleted={completedSections.has('timestamping')}
                onToggleComplete={() => toggleSectionComplete('timestamping')}
              />

              <PrivacySection
                id="privacy"
                isCompleted={completedSections.has('privacy')}
                onToggleComplete={() => toggleSectionComplete('privacy')}
              />

              <USBTokensSection
                id="usb-tokens"
                isCompleted={completedSections.has('usb-tokens')}
                onToggleComplete={() => toggleSectionComplete('usb-tokens')}
              />

              <ConfigurationSection
                id="configuration"
                isCompleted={completedSections.has('configuration')}
                onToggleComplete={() => toggleSectionComplete('configuration')}
              />

              {/* Scroll to top (Float) */}
              <div className="fixed bottom-8 right-8 z-40 transition-opacity duration-300" style={{ opacity: activeSection ? 1 : 0, pointerEvents: activeSection ? 'auto' : 'none' }}>
                <button
                  onClick={scrollToTop}
                  className="p-4 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 cursor-pointer hover:bg-primary/90 hover:scale-110 transition-all"
                  aria-label="Scroll to top"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </main>
          </div>
        </div>
      </article>
    </>
  );
}
