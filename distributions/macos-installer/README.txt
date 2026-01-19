╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                     Trexo PDF Signer - macOS Installer                       ║
║                                                                              ║
║                         TrexoLab - trexolab.com                              ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

================================================================================
 INSTALLATION INSTRUCTIONS
================================================================================

 1. Double-click "INSTALL.command"

 2. If macOS shows a security warning:
    - Right-click on INSTALL.command
    - Select "Open"
    - Click "Open" in the dialog

 3. Wait for installation to complete
    - If Java runtime is not bundled, it will be downloaded (~50 MB)
    - This requires an internet connection

 4. After installation:
    - Find "Trexo PDF Signer" in Spotlight (Cmd+Space)
    - Or open from /Applications folder
    - Drag to Dock for quick access

================================================================================
 SYSTEM REQUIREMENTS
================================================================================

 • macOS 10.13 (High Sierra) or later
 • 200 MB free disk space
 • Internet connection (only if Java not bundled)

================================================================================
 FIRST LAUNCH
================================================================================

 On first launch, macOS may show a security warning because the app
 is from an "unidentified developer". To open:

 1. Go to System Preferences > Security & Privacy
 2. Click "Open Anyway" next to the Trexo PDF Signer message

 OR

 1. Right-click on the app in Applications
 2. Select "Open"
 3. Click "Open" in the dialog

================================================================================
 UNINSTALLATION
================================================================================

 To uninstall Trexo PDF Signer:

 1. Drag /Applications/Trexo PDF Signer.app to Trash

 2. (Optional) Remove configuration:
    - Open Terminal
    - Run: rm -rf ~/.trexo-pdf-signer

================================================================================
 TROUBLESHOOTING
================================================================================

 Problem: "INSTALL.command" won't open
 Solution: Right-click > Open > Click "Open" in dialog

 Problem: Installation fails with "No Internet"
 Solution: Connect to internet or download the "Full Offline" version

 Problem: App won't start after installation
 Solution: Run in Terminal:
   xattr -dr com.apple.quarantine "/Applications/Trexo PDF Signer.app"

 Problem: "Java Runtime not found" error
 Solution: Reinstall using the installer

================================================================================
 SUPPORT
================================================================================

 • Documentation: https://trexolab-solution.github.io/trexo-pdf-signer/
 • Issues: https://github.com/trexolab-solution/trexo-pdf-signer/issues
 • Email: contact@trexolab.com

================================================================================
 LICENSE
================================================================================

 Trexo PDF Signer is open source software licensed under AGPL v3.0
 https://github.com/trexolab-solution/trexo-pdf-signer

 Copyright 2024-2025 TrexoLab. All rights reserved.

================================================================================