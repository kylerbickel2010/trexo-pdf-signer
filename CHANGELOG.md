# Changelog

All notable changes to Trexo PDF Signer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.1.0] - 2025-01-19

### Added

#### Digital Signature Capabilities
- X.509 certificate-based PDF signing with industry-standard compliance
- Visual signature placement with drag-and-drop positioning
- Support for multiple signatures on a single document
- Signature validation and verification with detailed status reporting
- Adobe Acrobat Reader compatible signatures

#### Certificate & Token Support
- **PKCS#11 Hardware Tokens**: SafeNet eToken, Gemalto, ProxKey, mToken, Watchdata, Feitian, and other compliant devices
- **PKCS#12/PFX Files**: Standard `.pfx` and `.p12` certificate file support
- **Windows Certificate Store**: Full integration with Windows personal certificate store
- **Smart Card Support**: Any PKCS#11 compliant smart card reader

#### Security & Compliance
- RFC 3161 compliant trusted timestamping
- Hash algorithm support: SHA-256, SHA-384, SHA-512
- Full certificate chain verification with OCSP/CRL support
- Custom trust store management for certificate validation

#### User Interface
- Modern UI powered by FlatLaf look and feel
- Real-time PDF preview and page navigation
- Customizable signature appearance (text, images, logos)
- Signature appearance profiles for quick reuse
- Signature image library for managing custom signatures
- Certificate details viewer with chain information
- Onboarding overlay for first-time users
- Keyboard shortcuts for common operations
- Recent files management

#### PDF Handling
- PDF document loading and rendering via Apache PDFBox
- Existing signature field detection and overlay display
- Signature verification banner with validity status
- Collapsible signature panel for document inspection

#### Platform Support
- Windows (x64 and x86) with bundled JRE installer
- Linux (x64 and x86) with DEB packages and TAR.GZ archives
- macOS with DMG installer `Beta`

#### Configuration
- Persistent settings management
- Keystore configuration persistence
- TSA (Time Stamping Authority) server configuration
- Signature appearance profile storage

---