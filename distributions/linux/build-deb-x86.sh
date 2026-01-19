#!/bin/bash
# ============================================================================
# Trexo PDF Signer - DEB Package Builder Script (x86/i386)
# TrexoLab - https://trexolab.com
# ============================================================================
#
# This script creates a .deb package for Debian/Ubuntu 32-bit systems.
#
# Prerequisites:
#   - dpkg-deb (usually pre-installed on Debian/Ubuntu)
#   - The JAR file at ../../target/TrexoPDFSigner.jar
#   - The JRE at ./jre8-x86/
#
# Usage:
#   ./build-deb-x86.sh
#
# Output:
#   ./output/trexo-pdf-signer-x86.deb
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
DESCRIPTION="Advanced PDF Signing Application (32-bit)"
ARCHITECTURE="i386"
BUILD_DIR="$SCRIPT_DIR/build-x86"
OUTPUT_DIR="$SCRIPT_DIR/output"
PACKAGE_DIR="$BUILD_DIR/${APP_NAME}_${APP_VERSION}_${ARCHITECTURE}"

# Clean previous build
rm -rf "$BUILD_DIR"
mkdir -p "$PACKAGE_DIR"

echo "============================================================================"
echo " Building Trexo PDF Signer DEB Package (x86/i386)"
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
cp "$SCRIPT_DIR/trexo-pdf-signer-x86" "$PACKAGE_DIR/opt/trexo-pdf-signer/trexo-pdf-signer"
chmod +x "$PACKAGE_DIR/opt/trexo-pdf-signer/trexo-pdf-signer"

# Copy JRE (x86 version)
echo "Copying bundled JRE (x86)..."
cp -r "$SCRIPT_DIR/jre8-x86" "$PACKAGE_DIR/opt/trexo-pdf-signer/"
chmod +x "$PACKAGE_DIR/opt/trexo-pdf-signer/jre8-x86/bin/"*

# Copy desktop entries
echo "Copying desktop entries..."
cp "$SCRIPT_DIR/trexo-pdf-signer.desktop" "$PACKAGE_DIR/usr/share/applications/"
cp "$SCRIPT_DIR/trexo-pdf-signer-large.desktop" "$PACKAGE_DIR/usr/share/applications/"
cp "$SCRIPT_DIR/trexo-pdf-signer-xlarge.desktop" "$PACKAGE_DIR/usr/share/applications/"

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
 This is the 32-bit (i386) version.
 .
 Features:
  - Sign PDFs with digital certificates
  - Support for USB tokens (PKCS#11)
  - Multiple memory profiles for large PDFs
  - Bundled Java 8 runtime (no system Java required)
EOF

# Create preinst script (version checking)
echo "Creating DEBIAN/preinst..."
cat > "$PACKAGE_DIR/DEBIAN/preinst" << EOF
#!/bin/bash
set -e

NEW_VERSION="$APP_VERSION"

# Function to compare version strings
# Returns: 0 if equal, 1 if v1 > v2, 2 if v1 < v2
compare_versions() {
    if [ "\$1" = "\$2" ]; then
        return 0
    fi

    local IFS=.
    local i v1=(\$1) v2=(\$2)

    # Fill empty positions with zeros
    for ((i=\${#v1[@]}; i<\${#v2[@]}; i++)); do
        v1[i]=0
    done
    for ((i=\${#v2[@]}; i<\${#v1[@]}; i++)); do
        v2[i]=0
    done

    for ((i=0; i<\${#v1[@]}; i++)); do
        if ((10#\${v1[i]} > 10#\${v2[i]})); then
            return 1
        fi
        if ((10#\${v1[i]} < 10#\${v2[i]})); then
            return 2
        fi
    done
    return 0
}

# Check if Trexo PDF Signer is already installed
INSTALLED_VERSION=""

# Check dpkg for installed version
if dpkg -l trexo-pdf-signer 2>/dev/null | grep -q "^ii"; then
    INSTALLED_VERSION=\$(dpkg-query -W -f='\${Version}' trexo-pdf-signer 2>/dev/null || echo "")
fi

# Also check for manual installation in /opt/trexo-pdf-signer
if [ -z "\$INSTALLED_VERSION" ] && [ -f "/opt/trexo-pdf-signer/version.txt" ]; then
    INSTALLED_VERSION=\$(cat /opt/trexo-pdf-signer/version.txt 2>/dev/null | tr -d '[:space:]')
fi

if [ -n "\$INSTALLED_VERSION" ]; then
    echo ""
    echo "============================================================================"
    echo " Trexo PDF Signer Installation Check (x86/i386)"
    echo "============================================================================"
    echo " Installed version: \$INSTALLED_VERSION"
    echo " New version:       \$NEW_VERSION"
    echo "============================================================================"

    compare_versions "\$INSTALLED_VERSION" "\$NEW_VERSION"
    result=\$?

    if [ \$result -eq 1 ]; then
        # Installed version is newer
        echo ""
        echo " WARNING: A newer version (\$INSTALLED_VERSION) is already installed!"
        echo ""
        echo " You are trying to install an older version (\$NEW_VERSION)."
        echo " Installation will be aborted to protect your newer installation."
        echo ""
        echo " If you want to downgrade, please uninstall the current version first:"
        echo "   sudo apt remove trexo-pdf-signer"
        echo ""
        echo "============================================================================"
        exit 1
    elif [ \$result -eq 0 ]; then
        # Same version
        echo ""
        echo " The same version (\$INSTALLED_VERSION) is already installed."
        echo " Proceeding with reinstallation..."
        echo ""
        echo "============================================================================"
    else
        # Installed version is older
        echo ""
        echo " Upgrading from version \$INSTALLED_VERSION to \$NEW_VERSION..."
        echo " Your user data and settings will be preserved."
        echo ""
        echo "============================================================================"
    fi
fi

exit 0
EOF
chmod +x "$PACKAGE_DIR/DEBIAN/preinst"

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
echo " Trexo PDF Signer $APP_VERSION (x86/i386) has been installed successfully!"
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

# Remove user config on purge
if [ "$1" = "purge" ]; then
    rm -rf /home/*/.trexo-pdf-signer 2>/dev/null || true
fi
EOF
chmod +x "$PACKAGE_DIR/DEBIAN/postrm"

# Build the package
echo "Building DEB package..."
mkdir -p "$OUTPUT_DIR"
dpkg-deb --build --root-owner-group "$PACKAGE_DIR" "$OUTPUT_DIR/trexo-pdf-signer-x86.deb"

# Verify the package
echo ""
echo "============================================================================"
echo " Package built successfully!"
echo "============================================================================"
echo " Output: $OUTPUT_DIR/trexo-pdf-signer-x86.deb"
echo ""
echo " Package info:"
dpkg-deb --info "$OUTPUT_DIR/trexo-pdf-signer-x86.deb"
echo ""
echo " To install: sudo dpkg -i $OUTPUT_DIR/trexo-pdf-signer-x86.deb"
echo "============================================================================"
