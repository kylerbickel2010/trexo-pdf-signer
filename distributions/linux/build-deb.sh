#!/bin/bash
# ============================================================================
# Trexo PDF Signer - DEB Package Builder Script
# TrexoLab - https://trexolab.com
# ============================================================================
#
# This script creates a .deb package for Debian/Ubuntu systems.
#
# Prerequisites:
#   - dpkg-deb (usually pre-installed on Debian/Ubuntu)
#   - The JAR file at ../../target/TrexoPDFSigner.jar
#   - The JRE at ./jre8-x64/
#
# Usage:
#   ./build-deb.sh
#
# Output:
#   ./output/trexo-pdf-signer-x64.deb
# ============================================================================

set -e

# Directories (defined first so VERSION file can be read)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Configuration
APP_NAME="trexo-pdf-signer"
# Read version from VERSION file
APP_VERSION=$(cat "$ROOT_DIR/VERSION" 2>/dev/null | tr -d '[:space:]' || echo "1.0.0")
MAINTAINER="TrexoLab <contact@trexolab.com>"
DESCRIPTION="Advanced PDF Signing Application"
ARCHITECTURE="amd64"
BUILD_DIR="$SCRIPT_DIR/build"
OUTPUT_DIR="$SCRIPT_DIR/output"
PACKAGE_DIR="$BUILD_DIR/${APP_NAME}_${APP_VERSION}_${ARCHITECTURE}"

# Clean previous build
rm -rf "$BUILD_DIR" "$OUTPUT_DIR"
mkdir -p "$PACKAGE_DIR"

echo "============================================================================"
echo " Building Trexo PDF Signer DEB Package"
echo "============================================================================"
echo " Version: $APP_VERSION"
echo " Architecture: $ARCHITECTURE"
echo "============================================================================"

# Create directory structure
echo "Creating directory structure..."
mkdir -p "$PACKAGE_DIR/DEBIAN"
mkdir -p "$PACKAGE_DIR/opt/trexo-pdf-signer"
mkdir -p "$PACKAGE_DIR/usr/share/applications"
mkdir -p "$PACKAGE_DIR/usr/share/icons/hicolor/256x256/apps"
mkdir -p "$PACKAGE_DIR/usr/share/icons/hicolor/48x48/apps"
mkdir -p "$PACKAGE_DIR/usr/bin"

# Copy application files
echo "Copying application files..."
cp "$ROOT_DIR/target/TrexoPDFSigner.jar" "$PACKAGE_DIR/opt/trexo-pdf-signer/"
cp "$SCRIPT_DIR/trexo-pdf-signer" "$PACKAGE_DIR/opt/trexo-pdf-signer/trexo-pdf-signer"
chmod +x "$PACKAGE_DIR/opt/trexo-pdf-signer/trexo-pdf-signer"

# Copy JRE
echo "Copying bundled JRE..."
cp -r "$SCRIPT_DIR/jre8-x64" "$PACKAGE_DIR/opt/trexo-pdf-signer/"
chmod +x "$PACKAGE_DIR/opt/trexo-pdf-signer/jre8-x64/bin/"*

# Copy desktop entries
echo "Copying desktop entries..."
cp "$SCRIPT_DIR/trexo-pdf-signer.desktop" "$PACKAGE_DIR/usr/share/applications/trexo-pdf-signer.desktop"
cp "$SCRIPT_DIR/trexo-pdf-signer-large.desktop" "$PACKAGE_DIR/usr/share/applications/trexo-pdf-signer-large.desktop"
cp "$SCRIPT_DIR/trexo-pdf-signer-xlarge.desktop" "$PACKAGE_DIR/usr/share/applications/trexo-pdf-signer-xlarge.desktop"

# Copy branding images
if [ -f "$SCRIPT_DIR/trexo-pdf-signer.png" ]; then
    echo "Copying app icon..."
    cp "$SCRIPT_DIR/trexo-pdf-signer.png" "$PACKAGE_DIR/opt/trexo-pdf-signer/trexo-pdf-signer.png"
    cp "$SCRIPT_DIR/trexo-pdf-signer.png" "$PACKAGE_DIR/usr/share/icons/hicolor/256x256/apps/trexo-pdf-signer.png"
else
    echo "WARNING: No icon found at $SCRIPT_DIR/trexo-pdf-signer.png, skipping icon installation..."
fi

# Create symlink script
cat > "$PACKAGE_DIR/usr/bin/trexo-pdf-signer" << 'EOF'
#!/bin/bash
exec /opt/trexo-pdf-signer/trexo-pdf-signer "$@"
EOF
chmod +x "$PACKAGE_DIR/usr/bin/trexo-pdf-signer"

# Create large profile symlink
cat > "$PACKAGE_DIR/usr/bin/trexo-pdf-signer-large" << 'EOF'
#!/bin/bash
exec /opt/trexo-pdf-signer/trexo-pdf-signer large "$@"
EOF
chmod +x "$PACKAGE_DIR/usr/bin/trexo-pdf-signer-large"

# Create xlarge profile symlink
cat > "$PACKAGE_DIR/usr/bin/trexo-pdf-signer-xlarge" << 'EOF'
#!/bin/bash
exec /opt/trexo-pdf-signer/trexo-pdf-signer xlarge "$@"
EOF
chmod +x "$PACKAGE_DIR/usr/bin/trexo-pdf-signer-xlarge"

# Calculate installed size (in KB)
INSTALLED_SIZE=$(du -sk "$PACKAGE_DIR" | cut -f1)

# Create control file
echo "Creating DEBIAN/control..."
cat > "$PACKAGE_DIR/DEBIAN/control" << EOF
Package: $APP_NAME
Version: $APP_VERSION
Section: utils
Priority: optional
Architecture: $ARCHITECTURE
Installed-Size: $INSTALLED_SIZE
Maintainer: $MAINTAINER
Homepage: https://trexolab.com
Description: $DESCRIPTION
 Trexo PDF Signer is an advanced PDF signing application that supports
 digital certificates, PKCS#11 tokens, and various signature types.
 .
 Features:
  - Sign PDFs with digital certificates
  - Support for USB tokens (PKCS#11)
  - Multiple memory profiles for large PDFs
  - Bundled Java 8 runtime (no system Java required)
EOF

# Create preinst script (version checking and clean install prep)
echo "Creating DEBIAN/preinst..."
cat > "$PACKAGE_DIR/DEBIAN/preinst" << 'EOF'
#!/bin/bash
set -e

# $1 status: install|upgrade|abort-upgrade
# $2 new-version (only for upgrade/abort-upgrade)

action="$1"
old_version="$2"

echo "Running preinst script with action: $action"

if [ "$action" = "upgrade" ]; then
    echo "Upgrading Trexo PDF Signer..."

    # CLEAN UP PREVIOUS INSTALLATION
    # The user wants a clean replacement of files to avoid conflicts

    echo "Preparing clean environment for new version..."

    # 1. Clean up /opt directory contents but keep the directory for new files
    if [ -d "/opt/trexo-pdf-signer" ]; then
        echo "Removing old application files..."
        rm -rf /opt/trexo-pdf-signer/* 2>/dev/null || true
    fi

    # 2. Clean up symlinks
    rm -f /usr/bin/trexo-pdf-signer 2>/dev/null || true
    rm -f /usr/bin/trexo-pdf-signer-large 2>/dev/null || true
    rm -f /usr/bin/trexo-pdf-signer-xlarge 2>/dev/null || true

    # 3. Clean up desktop entries and icons
    rm -f /usr/share/applications/trexo-pdf-signer.desktop 2>/dev/null || true
    rm -f /usr/share/applications/trexo-pdf-signer-large.desktop 2>/dev/null || true
    rm -f /usr/share/applications/trexo-pdf-signer-xlarge.desktop 2>/dev/null || true
    rm -f /usr/share/icons/hicolor/256x256/apps/trexo-pdf-signer.png 2>/dev/null || true
    rm -f /usr/share/icons/hicolor/48x48/apps/trexo-pdf-signer.png 2>/dev/null || true

    echo "Clean up complete. Proceeding with installation of new files..."
fi

exit 0
EOF
chmod +x "$PACKAGE_DIR/DEBIAN/preinst"

# Create prerm script (check if app is running before removal/upgrade)
echo "Creating DEBIAN/prerm..."
cat > "$PACKAGE_DIR/DEBIAN/prerm" << 'EOF'
#!/bin/bash
set -e

# $1 action: remove|upgrade|failed-upgrade|abort-install|abort-upgrade
action="$1"

if [ "$action" = "remove" ] || [ "$action" = "upgrade" ]; then
    echo "Checking for running instances of Trexo PDF Signer..."

    # Check if the process is running
    # We check for the jar file or the launcher script
    if pgrep -f "TrexoPDFSigner.jar" > /dev/null; then
        echo "============================================================================"
        echo " ERROR: Trexo PDF Signer is currently running."
        echo " Please close the application before proceeding with $action."
        echo "============================================================================"
        exit 1
    fi
fi

exit 0
EOF
chmod +x "$PACKAGE_DIR/DEBIAN/prerm"

# Create postinst script
echo "Creating DEBIAN/postinst..."
cat > "$PACKAGE_DIR/DEBIAN/postinst" << EOF
#!/bin/bash
set -e

# Save version info for future checks
echo "$APP_VERSION" > /opt/trexo-pdf-signer/version.txt

# Update desktop database
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database -q /usr/share/applications || true
fi

# Update icon cache
if command -v gtk-update-icon-cache &> /dev/null; then
    gtk-update-icon-cache -q /usr/share/icons/hicolor || true
fi

echo ""
echo "============================================================================"
echo " Trexo PDF Signer $APP_VERSION has been installed successfully!"
echo "============================================================================"
echo ""
echo " Launch from:"
echo "   - Applications menu: Trexo PDF Signer"
echo "   - Terminal: trexo-pdf-signer"
echo ""
echo " Memory profiles:"
echo "   - Normal (2GB):  trexo-pdf-signer"
echo "   - Large (4GB):   trexo-pdf-signer-large"
echo "   - XLarge (8GB):  trexo-pdf-signer-xlarge"
echo ""
echo "============================================================================"
EOF
chmod +x "$PACKAGE_DIR/DEBIAN/postinst"

# Create postrm script
echo "Creating DEBIAN/postrm..."
cat > "$PACKAGE_DIR/DEBIAN/postrm" << 'EOF'
#!/bin/bash
set -e

# Update desktop database
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database -q /usr/share/applications || true
fi

# Update icon cache
if command -v gtk-update-icon-cache &> /dev/null; then
    gtk-update-icon-cache -q /usr/share/icons/hicolor || true
fi

# COMPLETE CLEANUP
# Remove user config on removal or purge
if [ "$1" = "remove" ] || [ "$1" = "purge" ]; then
    echo "Cleaning up user configurations..."

    # More robust home directory discovery
    # Iterate through all users with a home directory in /home
    while IFS=: read -r user _ _ _ _ home _; do
        if [[ "$home" == /home/* ]] && [ -d "$home/.trexo-pdf-signer" ]; then
            echo "Removing config for user: $user ($home/.trexo-pdf-signer)"
            rm -rf "$home/.trexo-pdf-signer" 2>/dev/null || true
        fi
    done < /etc/passwd

    # Also check /root
    if [ -d "/root/.trexo-pdf-signer" ]; then
         echo "Removing config for user: root (/root/.trexo-pdf-signer)"
         rm -rf "/root/.trexo-pdf-signer" 2>/dev/null || true
    fi
fi
EOF
chmod +x "$PACKAGE_DIR/DEBIAN/postrm"

# Build the package
echo "Building DEB package..."
mkdir -p "$OUTPUT_DIR"
dpkg-deb --build --root-owner-group "$PACKAGE_DIR" "$OUTPUT_DIR/trexo-pdf-signer-x64.deb"

# Verify the package
echo ""
echo "============================================================================"
echo " Package built successfully!"
echo "============================================================================"
echo " Output: $OUTPUT_DIR/trexo-pdf-signer-x64.deb"
echo ""
echo " Package info:"
dpkg-deb --info "$OUTPUT_DIR/trexo-pdf-signer-x64.deb"
echo ""
echo " To install: sudo dpkg -i $OUTPUT_DIR/trexo-pdf-signer-x64.deb"
echo "============================================================================"