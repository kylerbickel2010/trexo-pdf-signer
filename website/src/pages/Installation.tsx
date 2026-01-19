
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowUp, Download, BookOpen, Clock, Zap } from 'lucide-react';
import { SEO, structuredDataGenerators } from '@/components/common';
import { Sidebar } from '@/components/common/Sidebar';
import { installationSections } from '@/data/installation-data';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { PrerequisitesSection } from '@/components/installation/sections/PrerequisitesSection';
import { WindowsInstallation } from '@/components/installation/sections/WindowsInstallation';
import { LinuxInstallation } from '@/components/installation/sections/LinuxInstallation';
import { MacOSInstallation } from '@/components/installation/sections/MacOSInstallation';
import { JavaSetup } from '@/components/installation/sections/JavaSetup';
import { CertificateSetup } from '@/components/installation/sections/CertificateSetup';
import { FirstRunConfiguration } from '@/components/installation/sections/FirstRunConfiguration';
import { UninstallGuide } from '@/components/installation/sections/UninstallGuide';
import { TroubleshootingSection } from '@/components/installation/sections/TroubleshootingSection';

export default function Installation() {
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();

  // Use scroll spy for installation sections
  const sectionIds = installationSections.map(s => s.id);
  const activeSection = useScrollSpy(sectionIds, 150);

  // Handle section completion toggle
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

  // Handle manual navigation
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
    { name: 'Installation', url: 'https://trexolab-solution.github.io/trexo-pdf-signer/#/installation' },
  ]);

  return (
    <>
      <SEO
        title="Installation Guide - Trexo PDF Signer"
        description="Step-by-step installation instructions for Windows, Linux, and macOS. Get started with Trexo PDF Signer securely."
        keywords="Trexo PDF Signer installation, PDF signer setup, Windows installer, Linux installer, macOS installer, Java 8 setup"
        url="https://trexolab-solution.github.io/trexo-pdf-signer/#/installation"
        structuredData={breadcrumbStructuredData}
      />

      <article className="min-h-screen">
        {/* Hero Section */}
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
              <span className="text-foreground font-medium">Installation</span>
            </nav>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="flex-1 max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <Download className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary text-primary border border-primary/20 uppercase tracking-wider">
                    Setup Guide
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-foreground">
                  Installation Guide
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Step-by-step instructions to install Trexo PDF Signer on Windows, Linux, and macOS.
                  Most installers include a bundled Java runtime for easier setup.
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
                  <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>~10 min setup</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>{installationSections.length} sections</span>
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
              sections={installationSections}
              activeSection={activeSection || 'prerequisites'}
              completedSections={completedSections}
              onSectionClick={scrollToSection}
              onToggleComplete={toggleSectionComplete}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-16 lg:pt-2">
              <PrerequisitesSection
                id="prerequisites"
                isCompleted={completedSections.has('prerequisites')}
                onToggleComplete={() => toggleSectionComplete('prerequisites')}
              />

              <WindowsInstallation
                id="windows"
                isCompleted={completedSections.has('windows')}
                onToggleComplete={() => toggleSectionComplete('windows')}
              />

              <LinuxInstallation
                id="linux"
                isCompleted={completedSections.has('linux')}
                onToggleComplete={() => toggleSectionComplete('linux')}
              />

              <MacOSInstallation
                id="macos"
                isCompleted={completedSections.has('macos')}
                onToggleComplete={() => toggleSectionComplete('macos')}
              />

              <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              <JavaSetup
                id="java-setup"
                isCompleted={completedSections.has('java-setup')}
                onToggleComplete={() => toggleSectionComplete('java-setup')}
              />

              <CertificateSetup
                id="certificate-setup"
                isCompleted={completedSections.has('certificate-setup')}
                onToggleComplete={() => toggleSectionComplete('certificate-setup')}
              />

              <FirstRunConfiguration
                id="first-run"
                isCompleted={completedSections.has('first-run')}
                onToggleComplete={() => toggleSectionComplete('first-run')}
              />

              <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              <UninstallGuide
                id="uninstall"
                isCompleted={completedSections.has('uninstall')}
                onToggleComplete={() => toggleSectionComplete('uninstall')}
              />

              <TroubleshootingSection id="troubleshooting" />

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
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
