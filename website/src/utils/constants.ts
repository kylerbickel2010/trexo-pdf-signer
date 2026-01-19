/**
 * Application Constants
 *
 * Centralized constants for the Trexo PDF Signer website.
 * Trexo PDF Signer is a product of TrexoLab.
 */

// Organization (TrexoLab)
export const ORG = {
  name: 'TrexoLab',
  website: 'https://trexolab.com',
  github: 'https://github.com/trexolab-solution',
  email: 'contact@trexolab.com',
} as const;

// Repository Configuration - SINGLE SOURCE OF TRUTH
export const REPO = {
  owner: 'trexolab-solution',
  name: 'trexo-pdf-signer',
} as const;

// Product URLs (Trexo PDF Signer)
export const GITHUB_URL = `https://github.com/${REPO.owner}/${REPO.name}`;
export const API_URLS = {
  repo: `https://api.github.com/repos/${REPO.owner}/${REPO.name}`,
  latestRelease: `https://api.github.com/repos/${REPO.owner}/${REPO.name}/releases/latest`,
  allReleases: `https://api.github.com/repos/${REPO.owner}/${REPO.name}/releases?per_page=100`,
} as const;

export const RELEASES_URL = `${GITHUB_URL}/releases`;
export const WIKI_URL = `${GITHUB_URL}/wiki`;
export const ISSUES_URL = `${GITHUB_URL}/issues`;

// SourceForge Configuration
export const SOURCEFORGE = {
  projectUrl: 'https://sourceforge.net/projects/trexo-pdf-signer/',
  downloadUrl: 'https://sourceforge.net/projects/trexo-pdf-signer/files/latest/download',
  statsApi: 'https://sourceforge.net/projects/trexo-pdf-signer/files/stats/json',
  badgeUrl: 'https://img.shields.io/sourceforge/dt/trexo-pdf-signer.svg',
} as const;

// Social Links
export const SOCIAL_LINKS = {
  github: GITHUB_URL,
  stargazers: `${GITHUB_URL}/stargazers`,
  sourceforge: SOURCEFORGE.projectUrl,
  orgWebsite: ORG.website,
  email: `mailto:${ORG.email}`,
} as const;

// Animation timing constants (in milliseconds)
export const ANIMATION = {
  // Transition durations
  transitionFast: 150,
  transitionNormal: 300,
  transitionBase: 300,
  transitionSlow: 500,
  transitionVerySlow: 700,

  // Counter animation
  counterDuration: 2000,

  // Stagger delays for list animations
  staggerDelayFast: 50,
  staggerDelay: 75,
  staggerDelaySlow: 150,
  staggerDelayVerySlow: 200,

  // Debounce times
  debounceShort: 100,
  debounceBase: 300,

  // Scroll animation threshold
  scrollThreshold: 0.1,
} as const;

// Application metadata
export const APP_NAME = 'Trexo PDF Signer';
export const APP_TAGLINE = 'Professional PDF Signing Made Simple';
export const APP_DESCRIPTION = 'Free, open-source PDF signing software for Windows, macOS, and Linux. Sign PDF documents with digital certificates using PKCS#12, PFX files, or USB security tokens.';
export const APP_SHORT_DESCRIPTION = 'A free alternative to Adobe Reader DC for professional PDF signing.';

export const APP_META = {
  name: APP_NAME,
  tagline: APP_TAGLINE,
  description: APP_DESCRIPTION,
  shortDescription: APP_SHORT_DESCRIPTION,
  version: '1.0.0',
} as const;

// Author/Organization information
export const AUTHOR = {
  name: ORG.name,
  github: ORG.github,
  email: ORG.email,
  website: ORG.website,
} as const;

// License information
export const LICENSE = {
  name: 'AGPL-3.0',
  url: 'https://github.com/trexolab-solution/trexo-pdf-signer/blob/main/LICENSE',
} as const;

// Gallery configuration
export const GALLERY_CONFIG = {
  autoPlayInterval: 5000,
  transitionDuration: 700,
  thumbnailSize: { width: 96, height: 56 },
} as const;

// Section IDs for navigation
export const SECTIONS = {
  features: 'features',
  download: 'download',
  usage: 'usage',
  faq: 'faq',
  compatibility: 'compatibility',
  gallery: 'gallery',
} as const;

export const SCROLL_SECTIONS = Object.values(SECTIONS);

// Navigation Configuration
export interface NavLink {
  name: string;
  href: string;
  isSection?: boolean;
}

export interface NavGroup {
  name: string;
  items: NavLink[];
}

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: SECTIONS.features, isSection: true },
  { name: 'Gallery', href: SECTIONS.gallery, isSection: true },
  { name: 'FAQ', href: SECTIONS.faq, isSection: true },
];

export const MORE_LINKS: NavGroup = {
  name: 'More',
  items: [
    { name: 'Compatibility', href: SECTIONS.compatibility, isSection: true },
    { name: 'How It Works', href: SECTIONS.usage, isSection: true },
  ],
};

export const PAGE_LINKS: NavLink[] = [
  { name: 'Installation', href: '/installation' },
  { name: 'Documentation', href: '/documentation' },
  { name: 'Diagrams', href: '/diagrams' },
];

// Application Configuration
export const APP_CONFIG = {
  baseUrl: `https://${REPO.owner}.github.io/${REPO.name}`,
} as const;

// Download Configuration
export const DOWNLOAD_URLS = {
  latestRelease: `${GITHUB_URL}/releases/latest`,
  windowsInstaller: `${GITHUB_URL}/releases/latest/download/trexo-pdf-signer-windows-x64-installer.exe`,
  windowsPortable: `${GITHUB_URL}/releases/latest/download/trexo-pdf-signer-windows-x64.zip`,
  linuxDeb: `${GITHUB_URL}/releases/latest/download/trexo-pdf-signer-linux-x64-deb.deb`,
  linuxTar: `${GITHUB_URL}/releases/latest/download/trexo-pdf-signer-linux-x64-tar.tar.gz`,
  macDmg: `${GITHUB_URL}/releases/latest/download/trexo-pdf-signer-macos-x64-dmg.dmg`,
  jar: `${GITHUB_URL}/releases/latest/download/TrexoPDFSigner.jar`,
} as const;

