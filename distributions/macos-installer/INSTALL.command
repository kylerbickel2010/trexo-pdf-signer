#!/bin/bash
# ============================================================================
# Trexo PDF Signer - macOS Installer (Hybrid)
# TrexoLab - https://trexolab.com
# ============================================================================
# Double-click this file to install Trexo PDF Signer
#
# Hybrid Mode:
#   - If jre8/ folder exists in app-data/ → Uses bundled JRE (offline)
#   - If jre8/ folder is missing → Downloads JRE from Adoptium (online)
# ============================================================================

set -e

# ============================================================================
# Configuration
# ============================================================================
APP_NAME="Trexo PDF Signer"
APP_BUNDLE_NAME="TrexoPDFSigner.app"
INSTALL_DIR="/Applications"
BUNDLE_ID="com.trexolab.trexo-pdf-signer"
APP_VERSION="1.0.4"

# JRE Download URL (Adoptium Temurin 8 for macOS x64)
JRE_URL="https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u432-b06/OpenJDK8U-jre_x64_mac_hotspot_8u432b06.tar.gz"
JRE_FOLDER_NAME="jdk8u432-b06-jre"

# Get installer directory
INSTALLER_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DATA_DIR="$INSTALLER_DIR/app-data"
TARGET_APP="$INSTALL_DIR/$APP_BUNDLE_NAME"
TEMP_DIR="$INSTALLER_DIR/.install-temp"

# ============================================================================
# UI Functions
# ============================================================================

show_error() {
    osascript -e "display dialog \"$1\" buttons {\"OK\"} default button \"OK\" with icon stop with title \"Trexo PDF Signer - Error\""
    cleanup
    exit 1
}

show_info() {
    osascript -e "display dialog \"$1\" buttons {\"OK\"} default button \"OK\" with icon note with title \"Trexo PDF Signer\""
}

show_success() {
    local result
    result=$(osascript -e "display dialog \"$1\" buttons {\"Open App\", \"Close\"} default button \"Open App\" with icon note with title \"Trexo PDF Signer - Installed!\"" 2>/dev/null || echo "")
    if [[ "$result" == *"Open App"* ]]; then
        open "$TARGET_APP"
    fi
}

show_progress() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  $1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

cleanup() {
    rm -rf "$TEMP_DIR" 2>/dev/null || true
}

# ============================================================================
# Download Function with Progress
# ============================================================================

download_with_progress() {
    local url="$1"
    local output="$2"
    local description="$3"

    echo "  Downloading: $description"
    echo "  URL: $url"
    echo ""

    # Use curl with progress bar
    if ! curl -L --progress-bar -o "$output" "$url"; then
        return 1
    fi

    # Verify download
    if [ ! -f "$output" ] || [ ! -s "$output" ]; then
        return 1
    fi

    return 0
}

# ============================================================================
# Main Installation Script
# ============================================================================

clear
echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║           Trexo PDF Signer - macOS Installer                     ║"
echo "║                      Version $APP_VERSION                            ║"
echo "║                                                                  ║"
echo "║                    TrexoLab - trexolab.com                       ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# Pre-installation Checks
# ============================================================================

show_progress "Step 1/5: Checking System"

# Check if running from DMG (read-only)
if [[ "$INSTALLER_DIR" == /Volumes/* ]]; then
    show_error "Cannot install from disk image!

Please:
1. Copy this folder to your Desktop or Downloads
2. Eject the disk image
3. Run INSTALL.command again from the copied folder"
fi

# Check if app-data folder exists
if [ ! -d "$APP_DATA_DIR" ]; then
    show_error "Installation files not found!

The 'app-data' folder is missing.
Please re-download Trexo PDF Signer."
fi

# Check required files
if [ ! -f "$APP_DATA_DIR/TrexoPDFSigner.jar" ]; then
    show_error "Application JAR not found!

Please re-download Trexo PDF Signer."
fi

echo "  ✓ System check passed"
echo "  ✓ Application JAR found"

# ============================================================================
# JRE Handling (Hybrid Logic)
# ============================================================================

show_progress "Step 2/5: Java Runtime Setup"

JRE_SOURCE=""
NEED_DOWNLOAD=false

# Check if JRE is bundled
if [ -d "$APP_DATA_DIR/jre8" ]; then
    # Verify bundled JRE has java executable
    if [ -x "$APP_DATA_DIR/jre8/Contents/Home/bin/java" ] || [ -x "$APP_DATA_DIR/jre8/bin/java" ]; then
        echo "  ✓ Bundled Java 8 runtime found (offline mode)"
        JRE_SOURCE="$APP_DATA_DIR/jre8"
    else
        echo "  ⚠ Bundled JRE incomplete, will download"
        NEED_DOWNLOAD=true
    fi
else
    echo "  ℹ No bundled JRE found, will download from Adoptium"
    NEED_DOWNLOAD=true
fi

# Download JRE if needed
if [ "$NEED_DOWNLOAD" = true ]; then
    echo ""
    echo "  ┌────────────────────────────────────────────────────────────┐"
    echo "  │  Downloading Java 8 Runtime (~50 MB)                       │"
    echo "  │  Source: Adoptium (Eclipse Temurin)                        │"
    echo "  │  This is required only once during installation.           │"
    echo "  └────────────────────────────────────────────────────────────┘"
    echo ""

    # Check internet connectivity
    if ! ping -c 1 github.com &>/dev/null; then
        show_error "No Internet Connection!

Java 8 runtime needs to be downloaded but you appear to be offline.

Options:
1. Connect to the internet and try again
2. Download the 'Full Offline' version which includes Java"
    fi

    # Create temp directory
    mkdir -p "$TEMP_DIR"

    # Download JRE
    JRE_ARCHIVE="$TEMP_DIR/jre8.tar.gz"
    if ! download_with_progress "$JRE_URL" "$JRE_ARCHIVE" "Java 8 Runtime"; then
        show_error "Download Failed!

Could not download Java 8 runtime.

Please check your internet connection and try again.
If the problem persists, download the 'Full Offline' version."
    fi

    echo ""
    echo "  ✓ Download complete"

    # Extract JRE
    echo "  Extracting Java runtime..."
    cd "$TEMP_DIR"
    if ! tar -xzf jre8.tar.gz; then
        show_error "Extraction Failed!

Could not extract Java 8 runtime.
Please try again or download the 'Full Offline' version."
    fi

    # Find extracted folder and rename
    if [ -d "$TEMP_DIR/$JRE_FOLDER_NAME" ]; then
        mv "$TEMP_DIR/$JRE_FOLDER_NAME" "$TEMP_DIR/jre8"
        JRE_SOURCE="$TEMP_DIR/jre8"
        echo "  ✓ Java runtime extracted"
    else
        # Try to find any jdk folder
        JRE_EXTRACTED=$(find "$TEMP_DIR" -maxdepth 1 -type d -name "jdk*" | head -1)
        if [ -n "$JRE_EXTRACTED" ]; then
            mv "$JRE_EXTRACTED" "$TEMP_DIR/jre8"
            JRE_SOURCE="$TEMP_DIR/jre8"
            echo "  ✓ Java runtime extracted"
        else
            show_error "Extraction Failed!

Could not locate extracted Java runtime.
Please try again or download the 'Full Offline' version."
        fi
    fi

    cd "$INSTALLER_DIR"
fi

# ============================================================================
# Remove Old Installation
# ============================================================================

show_progress "Step 3/5: Preparing Installation"

if [ -d "$TARGET_APP" ]; then
    echo "  Removing previous installation..."
    rm -rf "$TARGET_APP"
    echo "  ✓ Previous version removed"
else
    echo "  ✓ Fresh installation"
fi

# ============================================================================
# Create App Bundle
# ============================================================================

show_progress "Step 4/5: Creating Application Bundle"

echo "  Creating directory structure..."

# Create .app bundle structure
mkdir -p "$TARGET_APP/Contents/MacOS"
mkdir -p "$TARGET_APP/Contents/Resources"

# Create Info.plist
echo "  Creating Info.plist..."
cat > "$TARGET_APP/Contents/Info.plist" << PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleExecutable</key>
    <string>trexo-pdf-signer-launcher</string>
    <key>CFBundleIconFile</key>
    <string>trexo-pdf-signer.icns</string>
    <key>CFBundleIdentifier</key>
    <string>$BUNDLE_ID</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>$APP_NAME</string>
    <key>CFBundleDisplayName</key>
    <string>$APP_NAME</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>$APP_VERSION</string>
    <key>CFBundleVersion</key>
    <string>$APP_VERSION</string>
    <key>CFBundleSignature</key>
    <string>TRXS</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.13</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>NSSupportsAutomaticGraphicsSwitching</key>
    <true/>
    <key>LSApplicationCategoryType</key>
    <string>public.app-category.productivity</string>
    <key>NSHumanReadableCopyright</key>
    <string>Copyright 2024-2025 TrexoLab. All rights reserved.</string>
    <key>NSPrincipalClass</key>
    <string>NSApplication</string>
    <key>CFBundleDocumentTypes</key>
    <array>
        <dict>
            <key>CFBundleTypeName</key>
            <string>PDF Document</string>
            <key>CFBundleTypeRole</key>
            <string>Editor</string>
            <key>LSItemContentTypes</key>
            <array>
                <string>com.adobe.pdf</string>
            </array>
        </dict>
    </array>
    <key>LSMultipleInstancesProhibited</key>
    <true/>
</dict>
</plist>
PLIST

# Create PkgInfo
echo "APPL????" > "$TARGET_APP/Contents/PkgInfo"

# Create Launcher Script
echo "  Creating launcher..."
cat > "$TARGET_APP/Contents/MacOS/trexo-pdf-signer-launcher" << 'LAUNCHER'
#!/bin/bash
# ============================================================================
# Trexo PDF Signer - macOS Launcher
# TrexoLab - https://trexolab.com
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RESOURCES_DIR="$(cd "$SCRIPT_DIR/../Resources" && pwd)"

# Java paths (try macOS structure first, then standard)
JAVA_EXE="$RESOURCES_DIR/jre8/Contents/Home/bin/java"
if [ ! -x "$JAVA_EXE" ]; then
    JAVA_EXE="$RESOURCES_DIR/jre8/bin/java"
fi

JAR_FILE="$RESOURCES_DIR/TrexoPDFSigner.jar"

# Validate Java
if [ ! -x "$JAVA_EXE" ]; then
    osascript -e 'display dialog "Java Runtime not found!

The bundled Java 8 runtime is missing or corrupted.

Please reinstall Trexo PDF Signer from:
https://github.com/trexolab-solution/trexo-pdf-signer/releases" buttons {"OK"} default button "OK" with icon stop with title "Trexo PDF Signer - Error"'
    exit 1
fi

# Validate JAR
if [ ! -f "$JAR_FILE" ]; then
    osascript -e 'display dialog "Application not found!

TrexoPDFSigner.jar is missing.

Please reinstall Trexo PDF Signer from:
https://github.com/trexolab-solution/trexo-pdf-signer/releases" buttons {"OK"} default button "OK" with icon stop with title "Trexo PDF Signer - Error"'
    exit 1
fi

# Remove macOS quarantine attribute (fixes Gatekeeper blocks)
xattr -dr com.apple.quarantine "$RESOURCES_DIR" 2>/dev/null || true

# Ensure Java is executable
chmod +x "$JAVA_EXE" 2>/dev/null || true

# Create log directory
mkdir -p "$HOME/.trexo-pdf-signer" 2>/dev/null || true

# Launch application with optimized settings
exec "$JAVA_EXE" \
    -Xms512m \
    -Xmx4g \
    -XX:+UseG1GC \
    -Dapple.laf.useScreenMenuBar=true \
    -Dapple.awt.application.name="Trexo PDF Signer" \
    -Dapple.awt.application.appearance=system \
    -Xdock:name="Trexo PDF Signer" \
    -Xdock:icon="$RESOURCES_DIR/trexo-pdf-signer.icns" \
    -jar "$JAR_FILE" "$@"
LAUNCHER

chmod +x "$TARGET_APP/Contents/MacOS/trexo-pdf-signer-launcher"
echo "  ✓ Launcher created"

# ============================================================================
# Copy Application Files
# ============================================================================

show_progress "Step 5/5: Installing Files"

# Copy JAR
echo "  Copying application..."
cp "$APP_DATA_DIR/TrexoPDFSigner.jar" "$TARGET_APP/Contents/Resources/"
echo "  ✓ Application JAR installed"

# Copy JRE
echo "  Copying Java runtime (this may take a moment)..."
cp -R "$JRE_SOURCE" "$TARGET_APP/Contents/Resources/jre8"
echo "  ✓ Java runtime installed"

# Copy icon (supports both .icns and .png)
ICON_COPIED=false
for icon_file in "$APP_DATA_DIR/trexo-pdf-signer.icns" "$APP_DATA_DIR/trexo-pdf-signer.png" "$INSTALLER_DIR/../linux/trexo-pdf-signer.png"; do
    if [ -f "$icon_file" ]; then
        # Copy as trexo-pdf-signer.icns (macOS will use it regardless of actual format for PNG)
        cp "$icon_file" "$TARGET_APP/Contents/Resources/trexo-pdf-signer.icns"
        echo "  ✓ Application icon installed"
        ICON_COPIED=true
        break
    fi
done
if [ "$ICON_COPIED" = false ]; then
    echo "  ⚠ No icon found (app will use default icon)"
fi

# ============================================================================
# Set Permissions
# ============================================================================

echo "  Setting permissions..."

# Make all Java executables executable
find "$TARGET_APP/Contents/Resources/jre8" -type f \( -name "java" -o -name "java*" \) -exec chmod +x {} \; 2>/dev/null || true

if [ -d "$TARGET_APP/Contents/Resources/jre8/Contents/Home/bin" ]; then
    chmod +x "$TARGET_APP/Contents/Resources/jre8/Contents/Home/bin/"* 2>/dev/null || true
fi
if [ -d "$TARGET_APP/Contents/Resources/jre8/bin" ]; then
    chmod +x "$TARGET_APP/Contents/Resources/jre8/bin/"* 2>/dev/null || true
fi

# Remove quarantine from entire app bundle
xattr -dr com.apple.quarantine "$TARGET_APP" 2>/dev/null || true

echo "  ✓ Permissions set"

# ============================================================================
# Cleanup
# ============================================================================

cleanup

# ============================================================================
# Verify Installation
# ============================================================================

echo ""
echo "  Verifying installation..."

VERIFY_FAILED=false

if [ ! -d "$TARGET_APP" ]; then
    VERIFY_FAILED=true
    echo "  ✗ App bundle not created"
fi

if [ ! -f "$TARGET_APP/Contents/Resources/TrexoPDFSigner.jar" ]; then
    VERIFY_FAILED=true
    echo "  ✗ Application JAR missing"
fi

if [ ! -d "$TARGET_APP/Contents/Resources/jre8" ]; then
    VERIFY_FAILED=true
    echo "  ✗ Java runtime missing"
fi

if [ "$VERIFY_FAILED" = true ]; then
    show_error "Installation verification failed!

Some components were not installed correctly.
Please try again or contact support at:
https://github.com/trexolab-solution/trexo-pdf-signer/issues"
fi

echo "  ✓ All components verified"

# ============================================================================
# Success!
# ============================================================================

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║              ✓ Installation Complete!                            ║"
echo "║                                                                  ║"
echo "╠══════════════════════════════════════════════════════════════════╣"
echo "║                                                                  ║"
echo "║  Trexo PDF Signer has been installed to:                         ║"
echo "║  /Applications/TrexoPDFSigner.app                                ║"
echo "║                                                                  ║"
echo "║  You can now:                                                    ║"
echo "║  • Press Cmd+Space, type 'Trexo' → Launch from Spotlight         ║"
echo "║  • Open from Applications folder                                 ║"
echo "║  • Drag to Dock for quick access                                 ║"
echo "║                                                                  ║"
echo "║  You may safely delete this installer folder.                    ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Show success dialog with option to open app
show_success "Trexo PDF Signer installed successfully!

Location: /Applications/TrexoPDFSigner.app

You can now:
• Press Cmd+Space and type 'Trexo' to launch
• Open from Applications folder
• Drag to Dock for quick access

You may delete this installer folder."

exit 0
