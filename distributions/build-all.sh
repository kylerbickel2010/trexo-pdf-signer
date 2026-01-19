#!/bin/bash
# ============================================================================
# Trexo PDF Signer - Cross-Platform Build Script (Linux/macOS Bash)
# TrexoLab - https://trexolab.com
# ============================================================================
#
# Usage:
#   ./build-all.sh              # Build all platforms
#   ./build-all.sh --windows    # Only Windows builds (requires Docker)
#   ./build-all.sh --linux      # Only Linux builds (native)
#   ./build-all.sh --macos      # Only macOS builds (hybrid installer)
#   ./build-all.sh --jar        # Only JAR file
#   ./build-all.sh --clean      # Clean all build artifacts and downloads
#   ./build-all.sh --clean-build # Clean then build all
#
# Examples:
#   ./build-all.sh --clean                    # Just clean everything
#   ./build-all.sh --linux --clean            # Clean Linux artifacts only
#   ./build-all.sh --clean-build              # Full clean rebuild
#   ./build-all.sh --linux                    # Build Linux packages natively
#
# ============================================================================

set -e

# ============================================================================
# Configuration
# ============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/build-output"
WINDOWS_DIR="$SCRIPT_DIR/windows"
LINUX_DIR="$SCRIPT_DIR/linux"
MACOS_INSTALLER_DIR="$SCRIPT_DIR/macos-installer"

# JRE URLs
declare -A JRE_URLS=(
    ["linux_x64"]="https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u432-b06/OpenJDK8U-jre_x64_linux_hotspot_8u432b06.tar.gz"
    ["linux_x86"]="https://cdn.azul.com/zulu/bin/zulu8.82.0.21-ca-jre8.0.432-linux_i686.tar.gz"
    ["windows_x64"]="https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u432-b06/OpenJDK8U-jre_x64_windows_hotspot_8u432b06.zip"
    ["windows_x86"]="https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u432-b06/OpenJDK8U-jre_x86-32_windows_hotspot_8u432b06.zip"
    ["macos_x64"]="https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u432-b06/OpenJDK8U-jre_x64_mac_hotspot_8u432b06.tar.gz"
)

# Parse command line arguments
BUILD_WINDOWS=false
BUILD_LINUX=false
BUILD_MACOS=false
BUILD_JAR=false
DO_CLEAN=false
CLEAN_BUILD=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --windows|-w)
            BUILD_WINDOWS=true
            shift
            ;;
        --linux|-l)
            BUILD_LINUX=true
            shift
            ;;
        --macos|-m)
            BUILD_MACOS=true
            shift
            ;;
        --jar|-j)
            BUILD_JAR=true
            shift
            ;;
        --clean|-c)
            DO_CLEAN=true
            shift
            ;;
        --clean-build)
            CLEAN_BUILD=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --windows, -w     Build Windows installers (requires Docker)"
            echo "  --linux, -l       Build Linux packages (native)"
            echo "  --macos, -m       Build macOS installers (hybrid)"
            echo "  --jar, -j         Build JAR file only"
            echo "  --clean, -c       Clean all build artifacts"
            echo "  --clean-build     Clean then build all"
            echo "  --help, -h        Show this help"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# ============================================================================
# Colors
# ============================================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# ============================================================================
# Helper Functions
# ============================================================================
write_banner() {
    echo ""
    echo -e "${CYAN}  ╔═══════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}  ║                                                                       ║${NC}"
    echo -e "${CYAN}  ║   ███████╗███╗   ███╗ █████╗ ██████╗ ██╗  ██╗                         ║${NC}"
    echo -e "${CYAN}  ║   ██╔════╝████╗ ████║██╔══██╗██╔══██╗██║ ██╔╝                         ║${NC}"
    echo -e "${CYAN}  ║   █████╗  ██╔████╔██║███████║██████╔╝█████╔╝                          ║${NC}"
    echo -e "${CYAN}  ║   ██╔══╝  ██║╚██╔╝██║██╔══██║██╔══██╗██╔═██╗                          ║${NC}"
    echo -e "${CYAN}  ║   ███████╗██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██╗                         ║${NC}"
    echo -e "${CYAN}  ║   ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝                         ║${NC}"
    echo -e "${CYAN}  ║                                                                       ║${NC}"
    echo -e "${CYAN}  ║   PDF Signer - Build System                                           ║${NC}"
    echo -e "${CYAN}  ║   TrexoLab - https://trexolab.com                                     ║${NC}"
    echo -e "${CYAN}  ║                                                                       ║${NC}"
    echo -e "${CYAN}  ╚═══════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

write_section() {
    local title="$1"
    echo ""
    echo -e "${BLUE}  ┌──────────────────────────────────────────────────────────────────────┐${NC}"
    printf "${BLUE}  │  %-68s│${NC}\n" "$title"
    echo -e "${BLUE}  └──────────────────────────────────────────────────────────────────────┘${NC}"
}

write_step() {
    echo -e "${WHITE}  ► $1${NC}"
}

write_substep() {
    echo -e "${GRAY}    • $1${NC}"
}

write_success() {
    echo -e "${GREEN}  ✓ $1${NC}"
}

write_warn() {
    echo -e "${YELLOW}  ⚠ $1${NC}"
}

write_err() {
    echo -e "${RED}  ✗ $1${NC}"
}

write_info() {
    local label="$1"
    local value="$2"
    echo -e "${GRAY}  $label : ${WHITE}$value${NC}"
}

get_file_size() {
    local path="$1"
    if [ -f "$path" ]; then
        local size=$(stat -c%s "$path" 2>/dev/null || stat -f%z "$path" 2>/dev/null)
        if [ "$size" -gt 1073741824 ]; then
            echo "$(echo "scale=2; $size/1073741824" | bc) GB"
        elif [ "$size" -gt 1048576 ]; then
            echo "$(echo "scale=2; $size/1048576" | bc) MB"
        elif [ "$size" -gt 1024 ]; then
            echo "$(echo "scale=2; $size/1024" | bc) KB"
        else
            echo "$size bytes"
        fi
    else
        echo "N/A"
    fi
}

# ============================================================================
# Clean Functions
# ============================================================================
clean_all() {
    write_section "CLEANING ALL BUILD ARTIFACTS"

    # Clean output directory
    if [ -d "$OUTPUT_DIR" ]; then
        rm -rf "$OUTPUT_DIR"
        write_success "Removed: build-output/"
    fi

    # Clean Maven target
    if [ -d "$PROJECT_ROOT/target" ]; then
        rm -rf "$PROJECT_ROOT/target"
        write_success "Removed: target/"
    fi

    # Clean dependency-reduced-pom.xml
    if [ -f "$PROJECT_ROOT/dependency-reduced-pom.xml" ]; then
        rm -f "$PROJECT_ROOT/dependency-reduced-pom.xml"
        write_success "Removed: dependency-reduced-pom.xml"
    fi

    clean_windows
    clean_linux
    clean_macos

    echo ""
    write_success "Cleanup complete!"
}

clean_windows() {
    write_step "Cleaning Windows artifacts..."

    # Clean JREs
    if [ -d "$WINDOWS_DIR/jre8-x64" ]; then
        rm -rf "$WINDOWS_DIR/jre8-x64"
        write_substep "Removed: windows/jre8-x64/"
    fi
    if [ -d "$WINDOWS_DIR/jre8-x86" ]; then
        rm -rf "$WINDOWS_DIR/jre8-x86"
        write_substep "Removed: windows/jre8-x86/"
    fi

    # Clean output
    if [ -d "$WINDOWS_DIR/Output" ]; then
        rm -rf "$WINDOWS_DIR/Output"
        write_substep "Removed: windows/Output/"
    fi
}

clean_linux() {
    write_step "Cleaning Linux artifacts..."

    # Clean JREs
    if [ -d "$LINUX_DIR/jre8-x64" ]; then
        rm -rf "$LINUX_DIR/jre8-x64"
        write_substep "Removed: linux/jre8-x64/"
    fi
    if [ -d "$LINUX_DIR/jre8-x86" ]; then
        rm -rf "$LINUX_DIR/jre8-x86"
        write_substep "Removed: linux/jre8-x86/"
    fi

    # Clean build directories
    if [ -d "$LINUX_DIR/build" ]; then
        rm -rf "$LINUX_DIR/build"
        write_substep "Removed: linux/build/"
    fi
    if [ -d "$LINUX_DIR/build-x86" ]; then
        rm -rf "$LINUX_DIR/build-x86"
        write_substep "Removed: linux/build-x86/"
    fi

    # Clean output
    if [ -d "$LINUX_DIR/output" ]; then
        rm -rf "$LINUX_DIR/output"
        write_substep "Removed: linux/output/"
    fi
}

clean_macos() {
    write_step "Cleaning macOS artifacts..."

    if [ -d "$MACOS_INSTALLER_DIR/build" ]; then
        rm -rf "$MACOS_INSTALLER_DIR/build"
        write_substep "Removed: macos-installer/build/"
    fi
    if [ -d "$MACOS_INSTALLER_DIR/output" ]; then
        rm -rf "$MACOS_INSTALLER_DIR/output"
        write_substep "Removed: macos-installer/output/"
    fi
}

# ============================================================================
# Build Functions
# ============================================================================
build_jar() {
    write_section "BUILDING JAR"

    if ! command -v mvn &> /dev/null; then
        write_err "Maven not found!"
        write_substep "Install: sudo apt install maven"
        write_substep "Or: brew install maven (macOS)"
        return 1
    fi

    write_step "Running Maven build..."
    cd "$PROJECT_ROOT"

    if mvn clean package -DskipTests -B -q 2>&1; then
        if [ -f "$PROJECT_ROOT/target/TrexoPDFSigner.jar" ]; then
            mkdir -p "$OUTPUT_DIR"
            cp "$PROJECT_ROOT/target/TrexoPDFSigner.jar" "$OUTPUT_DIR/"
            local size=$(get_file_size "$OUTPUT_DIR/TrexoPDFSigner.jar")
            write_success "JAR built successfully ($size)"
            return 0
        fi
    fi

    write_err "Maven build failed!"
    return 1
}

build_linux() {
    write_section "BUILDING LINUX PACKAGES (Native)"

    # Check for required tools
    if ! command -v dpkg-deb &> /dev/null; then
        write_warn "dpkg-deb not found. DEB packages will be skipped."
        write_substep "Install: sudo apt install dpkg-dev"
    fi

    # Download JRE x64
    write_step "Preparing JRE x64..."
    if [ ! -f "$LINUX_DIR/jre8-x64/bin/java" ]; then
        write_substep "Downloading JRE x64..."
        local temp_file=$(mktemp)
        curl -sL -o "$temp_file" "${JRE_URLS[linux_x64]}"
        rm -rf "$LINUX_DIR/jre8-x64"
        mkdir -p "$LINUX_DIR/jre8-x64"
        tar -xzf "$temp_file" -C "$LINUX_DIR/jre8-x64" --strip-components=1
        rm -f "$temp_file"
        chmod +x "$LINUX_DIR/jre8-x64/bin/"*
        write_substep "JRE x64 downloaded"
    else
        write_substep "JRE x64 already cached"
    fi

    # Download JRE x86
    write_step "Preparing JRE x86..."
    if [ ! -f "$LINUX_DIR/jre8-x86/bin/java" ]; then
        write_substep "Downloading JRE x86..."
        local temp_file=$(mktemp)
        curl -sL -o "$temp_file" "${JRE_URLS[linux_x86]}"
        rm -rf "$LINUX_DIR/jre8-x86"
        mkdir -p "$LINUX_DIR/jre8-x86"
        tar -xzf "$temp_file" -C "$LINUX_DIR/jre8-x86" --strip-components=1
        rm -f "$temp_file"
        chmod +x "$LINUX_DIR/jre8-x86/bin/"*
        write_substep "JRE x86 downloaded"
    else
        write_substep "JRE x86 already cached"
    fi

    # Ensure scripts have correct permissions and line endings
    write_step "Preparing build scripts..."
    cd "$LINUX_DIR"
    for f in *.sh trexo-pdf-signer trexo-pdf-signer-x86 *.desktop; do
        if [ -f "$f" ]; then
            sed -i 's/\r$//' "$f" 2>/dev/null || true
            chmod +x "$f" 2>/dev/null || true
        fi
    done

    # Clean previous builds
    rm -rf build build-x86 output
    mkdir -p output

    # Build DEB x64
    write_step "Building DEB package (x64)..."
    if command -v dpkg-deb &> /dev/null && [ -f "./build-deb.sh" ]; then
        if ./build-deb.sh > /dev/null 2>&1; then
            if [ -f "output/trexo-pdf-signer-x64.deb" ]; then
                local size=$(get_file_size "output/trexo-pdf-signer-x64.deb")
                write_success "trexo-pdf-signer-x64.deb ($size)"
            fi
        else
            write_err "DEB x64 build failed"
        fi
    else
        write_warn "Skipped (dpkg-deb not available)"
    fi

    # Build TAR.GZ x64
    write_step "Building TAR.GZ package (x64)..."
    if [ -f "./build-tar.sh" ]; then
        if ./build-tar.sh > /dev/null 2>&1; then
            if [ -f "output/trexo-pdf-signer-x64-linux.tar.gz" ]; then
                local size=$(get_file_size "output/trexo-pdf-signer-x64-linux.tar.gz")
                write_success "trexo-pdf-signer-x64-linux.tar.gz ($size)"
            fi
        else
            write_err "TAR.GZ x64 build failed"
        fi
    fi

    # Build DEB x86
    write_step "Building DEB package (x86)..."
    if command -v dpkg-deb &> /dev/null && [ -f "./build-deb-x86.sh" ]; then
        if ./build-deb-x86.sh > /dev/null 2>&1; then
            if [ -f "output/trexo-pdf-signer-x86.deb" ]; then
                local size=$(get_file_size "output/trexo-pdf-signer-x86.deb")
                write_success "trexo-pdf-signer-x86.deb ($size)"
            fi
        else
            write_err "DEB x86 build failed"
        fi
    else
        write_warn "Skipped (dpkg-deb not available)"
    fi

    # Build TAR.GZ x86
    write_step "Building TAR.GZ package (x86)..."
    if [ -f "./build-tar-x86.sh" ]; then
        if ./build-tar-x86.sh > /dev/null 2>&1; then
            if [ -f "output/trexo-pdf-signer-x86-linux.tar.gz" ]; then
                local size=$(get_file_size "output/trexo-pdf-signer-x86-linux.tar.gz")
                write_success "trexo-pdf-signer-x86-linux.tar.gz ($size)"
            fi
        else
            write_err "TAR.GZ x86 build failed"
        fi
    fi

    # Copy to main output
    write_step "Copying to output directory..."
    mkdir -p "$OUTPUT_DIR"
    for f in output/*.deb output/*.tar.gz; do
        if [ -f "$f" ]; then
            cp "$f" "$OUTPUT_DIR/"
            write_substep "Copied: $(basename "$f")"
        fi
    done

    cd "$SCRIPT_DIR"
}

build_windows() {
    write_section "BUILDING WINDOWS INSTALLERS (via Docker)"

    # Check Docker
    if ! command -v docker &> /dev/null; then
        write_err "Docker not installed!"
        write_substep "Install Docker to build Windows packages on Linux"
        return 1
    fi

    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        write_err "Docker is not running!"
        write_substep "Please start Docker and try again"
        return 1
    fi

    write_success "Docker is running"
    write_step "Building Windows installers in Docker container..."
    write_substep "This requires Wine and Inno Setup in Docker..."

    # Create Windows build script
    local temp_script=$(mktemp)
    cat > "$temp_script" << 'DOCKERSCRIPT'
#!/bin/bash
set -e

echo ''
echo '══════════════════════════════════════════════════════════════════════'
echo '  Windows Build Environment (Wine + Inno Setup)'
echo '══════════════════════════════════════════════════════════════════════'
echo ''

# Install dependencies
echo '► Installing dependencies...'
dpkg --add-architecture i386
apt-get update -qq
apt-get install -y -qq wine wine32 wine64 curl unzip xvfb > /dev/null 2>&1

# Setup Wine
export WINEARCH=win64
export WINEPREFIX=/root/.wine
export DISPLAY=:99

# Start Xvfb for Wine GUI
Xvfb :99 -screen 0 1024x768x16 &
sleep 2

# Initialize Wine
echo '► Initializing Wine...'
wineboot --init > /dev/null 2>&1 || true
sleep 3

# Download and install Inno Setup
echo '► Installing Inno Setup...'
curl -sL -o /tmp/innosetup.exe "https://jrsoftware.org/download.php/is.exe"
wine /tmp/innosetup.exe /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /DIR="C:\\InnoSetup" > /dev/null 2>&1 || true
sleep 5

ISCC="/root/.wine/drive_c/InnoSetup/ISCC.exe"

if [ ! -f "$ISCC" ]; then
    echo '✗ Inno Setup installation failed'
    exit 1
fi
echo '  ✓ Inno Setup installed'

# Download JREs for Windows
echo ''
echo '► Downloading Windows JRE x64...'
curl -sL -o /tmp/jre-x64.zip 'https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u432-b06/OpenJDK8U-jre_x64_windows_hotspot_8u432b06.zip'
rm -rf /app/distributions/windows/jre8-x64
mkdir -p /app/distributions/windows/jre8-x64
cd /tmp && unzip -q jre-x64.zip && mv jdk*/* /app/distributions/windows/jre8-x64/
echo '  ✓ JRE x64 ready'

echo ''
echo '► Downloading Windows JRE x86...'
curl -sL -o /tmp/jre-x86.zip 'https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u432-b06/OpenJDK8U-jre_x86-32_windows_hotspot_8u432b06.zip'
rm -rf /app/distributions/windows/jre8-x86
mkdir -p /app/distributions/windows/jre8-x86
cd /tmp && unzip -q jre-x86.zip && mv jdk*/* /app/distributions/windows/jre8-x86/
echo '  ✓ JRE x86 ready'

# Build installers
cd /app/distributions/windows
mkdir -p Output

echo ''
echo '► Building Windows x64 installer...'
wine "$ISCC" trexo-pdf-signer-x64.iss > /dev/null 2>&1 || true
if [ -f "Output/trexo-pdf-signer-x64-setup.exe" ]; then
    echo '  ✓ trexo-pdf-signer-x64-setup.exe'
else
    echo '  ✗ x64 build failed'
fi

echo ''
echo '► Building Windows x86 installer...'
wine "$ISCC" trexo-pdf-signer-x86.iss > /dev/null 2>&1 || true
if [ -f "Output/trexo-pdf-signer-x86-setup.exe" ]; then
    echo '  ✓ trexo-pdf-signer-x86-setup.exe'
else
    echo '  ✗ x86 build failed'
fi

echo ''
echo '══════════════════════════════════════════════════════════════════════'
echo '  Windows builds complete!'
echo '══════════════════════════════════════════════════════════════════════'
DOCKERSCRIPT

    # Run Docker with Wine
    docker run --rm \
        -v "$PROJECT_ROOT:/app" \
        -v "$temp_script:/build.sh" \
        -w /app \
        ubuntu:22.04 \
        bash /build.sh

    rm -f "$temp_script"

    # Copy outputs
    if [ -d "$WINDOWS_DIR/Output" ]; then
        mkdir -p "$OUTPUT_DIR"
        for f in "$WINDOWS_DIR/Output/"*.exe; do
            if [ -f "$f" ]; then
                cp "$f" "$OUTPUT_DIR/"
                local size=$(get_file_size "$f")
                write_success "Copied: $(basename "$f") ($size)"
            fi
        done
    fi
}

build_macos() {
    write_section "BUILDING MACOS INSTALLERS (Hybrid)"

    local JAR_FILE="$PROJECT_ROOT/target/TrexoPDFSigner.jar"
    if [ ! -f "$JAR_FILE" ]; then
        write_err "JAR file not found! Build JAR first."
        return 1
    fi

    # Get version
    local APP_VERSION="1.0.4"
    if [ -f "$PROJECT_ROOT/VERSION" ]; then
        APP_VERSION=$(cat "$PROJECT_ROOT/VERSION" | tr -d '[:space:]')
    fi

    local BUILD_DIR="$MACOS_INSTALLER_DIR/build"
    local MACOS_OUTPUT_DIR="$MACOS_INSTALLER_DIR/output"
    local INSTALLER_FOLDER_NAME="Trexo PDF Signer-Installer"

    # Output names
    local LITE_ZIP_NAME="Trexo PDF Signer-$APP_VERSION-macOS-Lite.zip"
    local FULL_ZIP_NAME="Trexo PDF Signer-$APP_VERSION-macOS-Full.zip"

    write_step "Preparing build directories..."
    rm -rf "$BUILD_DIR" "$MACOS_OUTPUT_DIR"
    mkdir -p "$BUILD_DIR/$INSTALLER_FOLDER_NAME/app-data"
    mkdir -p "$MACOS_OUTPUT_DIR"

    # Copy base files
    write_step "Copying installer files..."
    cp "$MACOS_INSTALLER_DIR/INSTALL.command" "$BUILD_DIR/$INSTALLER_FOLDER_NAME/"
    cp "$MACOS_INSTALLER_DIR/README.txt" "$BUILD_DIR/$INSTALLER_FOLDER_NAME/"
    cp "$JAR_FILE" "$BUILD_DIR/$INSTALLER_FOLDER_NAME/app-data/"
    write_substep "INSTALL.command, README.txt, JAR copied"

    # Copy icon
    local ICON_FILE=""
    for icon_loc in "$MACOS_INSTALLER_DIR/app-data/trexo-pdf-signer.icns" "$MACOS_INSTALLER_DIR/app-data/trexo-pdf-signer.png" "$LINUX_DIR/trexo-pdf-signer.png"; do
        if [ -f "$icon_loc" ]; then
            ICON_FILE="$icon_loc"
            cp "$icon_loc" "$BUILD_DIR/$INSTALLER_FOLDER_NAME/app-data/"
            write_substep "Icon copied: $(basename "$icon_loc")"
            break
        fi
    done

    # Create Lite version
    write_step "Creating Lite version (downloads JRE at install)..."
    local LITE_ZIP_PATH="$MACOS_OUTPUT_DIR/$LITE_ZIP_NAME"

    cd "$BUILD_DIR"
    zip -r -9 "$LITE_ZIP_PATH" "$INSTALLER_FOLDER_NAME" > /dev/null 2>&1
    cd "$SCRIPT_DIR"

    if [ -f "$LITE_ZIP_PATH" ]; then
        cp "$LITE_ZIP_PATH" "$OUTPUT_DIR/"
        local size=$(get_file_size "$LITE_ZIP_PATH")
        write_success "macOS Lite installer built ($size)"
    fi

    # Create Full version (with bundled JRE)
    write_step "Creating Full version (with bundled JRE)..."
    write_substep "Downloading macOS JRE x64 (~50 MB)..."

    local JRE_ARCHIVE="$BUILD_DIR/jre8.tar.gz"
    local JRE_EXTRACT_DIR="$BUILD_DIR/jre-extract"

    if curl -sL -o "$JRE_ARCHIVE" "${JRE_URLS[macos_x64]}"; then
        write_substep "JRE downloaded"

        # Extract JRE
        mkdir -p "$JRE_EXTRACT_DIR"
        tar -xzf "$JRE_ARCHIVE" -C "$JRE_EXTRACT_DIR"

        # Find and copy JRE
        local JRE_SOURCE_DIR=$(find "$JRE_EXTRACT_DIR" -maxdepth 1 -type d -name "jdk*" | head -1)
        if [ -n "$JRE_SOURCE_DIR" ]; then
            cp -R "$JRE_SOURCE_DIR" "$BUILD_DIR/$INSTALLER_FOLDER_NAME/app-data/jre8"
            write_substep "JRE extracted and bundled"

            # Create Full ZIP
            local FULL_ZIP_PATH="$MACOS_OUTPUT_DIR/$FULL_ZIP_NAME"

            cd "$BUILD_DIR"
            zip -r -9 "$FULL_ZIP_PATH" "$INSTALLER_FOLDER_NAME" > /dev/null 2>&1
            cd "$SCRIPT_DIR"

            if [ -f "$FULL_ZIP_PATH" ]; then
                cp "$FULL_ZIP_PATH" "$OUTPUT_DIR/"
                local size=$(get_file_size "$FULL_ZIP_PATH")
                write_success "macOS Full installer built ($size)"
            fi
        else
            write_warn "Could not find JRE after extraction, Full version skipped"
        fi
    else
        write_warn "Failed to download JRE, Full version skipped"
        write_substep "Lite version is available"
    fi

    # Cleanup build directory
    write_step "Cleaning up build artifacts..."
    rm -rf "$BUILD_DIR"
    write_substep "Removed: macos-installer/build/"
}

show_summary() {
    echo ""
    echo -e "${GREEN}  ╔═══════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}  ║                         BUILD COMPLETE                                ║${NC}"
    echo -e "${GREEN}  ╚═══════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""

    write_info "Output Directory" "$OUTPUT_DIR"
    echo ""

    if [ -d "$OUTPUT_DIR" ]; then
        local files=("$OUTPUT_DIR"/*)
        if [ ${#files[@]} -gt 0 ] && [ -e "${files[0]}" ]; then
            echo -e "${GRAY}  ┌────────────────────────────────────────────────────────────────────┐${NC}"
            echo -e "${GRAY}  │  Generated Files                                                  │${NC}"
            echo -e "${GRAY}  ├────────────────────────────────────────────────────────────────────┤${NC}"

            for f in "$OUTPUT_DIR"/*; do
                if [ -f "$f" ]; then
                    local name=$(basename "$f")
                    local size=$(get_file_size "$f")
                    printf "${WHITE}  │  %-45s %12s │${NC}\n" "$name" "$size"
                fi
            done

            echo -e "${GRAY}  └────────────────────────────────────────────────────────────────────┘${NC}"
        else
            write_warn "No files in output directory"
        fi
    fi

    echo ""
}

# ============================================================================
# Main Execution
# ============================================================================

# Show banner
write_banner

# Get version
VERSION="unknown"
if [ -f "$PROJECT_ROOT/VERSION" ]; then
    VERSION=$(cat "$PROJECT_ROOT/VERSION" | tr -d '[:space:]')
fi

# Detect platform
PLATFORM="Linux"
if [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macOS"
fi

write_info "Version" "$VERSION"
write_info "Project Root" "$PROJECT_ROOT"
write_info "Platform" "$PLATFORM (Bash)"
echo ""

# Handle CleanBuild
if $CLEAN_BUILD; then
    DO_CLEAN=true
    if ! $BUILD_WINDOWS && ! $BUILD_LINUX && ! $BUILD_MACOS && ! $BUILD_JAR; then
        BUILD_WINDOWS=true
        BUILD_LINUX=true
        BUILD_MACOS=true
        BUILD_JAR=true
    fi
fi

# If only Clean flag, clean everything and exit
if $DO_CLEAN && ! $BUILD_WINDOWS && ! $BUILD_LINUX && ! $BUILD_MACOS && ! $BUILD_JAR && ! $CLEAN_BUILD; then
    clean_all
    echo ""
    exit 0
fi

# Clean if requested
if $DO_CLEAN; then
    if $BUILD_WINDOWS && ! $BUILD_LINUX && ! $BUILD_MACOS && ! $BUILD_JAR; then
        clean_windows
    elif $BUILD_LINUX && ! $BUILD_WINDOWS && ! $BUILD_MACOS && ! $BUILD_JAR; then
        clean_linux
    elif $BUILD_MACOS && ! $BUILD_WINDOWS && ! $BUILD_LINUX && ! $BUILD_JAR; then
        clean_macos
    else
        clean_all
    fi
fi

# Default: build all if no specific flags
if ! $BUILD_WINDOWS && ! $BUILD_LINUX && ! $BUILD_MACOS && ! $BUILD_JAR; then
    BUILD_WINDOWS=true
    BUILD_LINUX=true
    BUILD_MACOS=true
    BUILD_JAR=true
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Build JAR (required for all builds)
if $BUILD_JAR || $BUILD_WINDOWS || $BUILD_LINUX || $BUILD_MACOS; then
    if ! build_jar; then
        write_err "JAR build failed. Cannot continue."
        exit 1
    fi
fi

# Build Linux
if $BUILD_LINUX; then
    build_linux
fi

# Build Windows
if $BUILD_WINDOWS; then
    build_windows
fi

# Build macOS
if $BUILD_MACOS; then
    build_macos
fi

# Post-build cleanup
write_section "POST-BUILD CLEANUP"
if $BUILD_LINUX; then
    write_step "Cleaning up Linux build artifacts..."
    if [ -d "$LINUX_DIR/jre8-x64" ]; then
        rm -rf "$LINUX_DIR/jre8-x64"
        write_substep "Removed: linux/jre8-x64/ (JRE)"
    fi
    if [ -d "$LINUX_DIR/jre8-x86" ]; then
        rm -rf "$LINUX_DIR/jre8-x86"
        write_substep "Removed: linux/jre8-x86/ (JRE)"
    fi
    if [ -d "$LINUX_DIR/build" ]; then
        rm -rf "$LINUX_DIR/build"
        write_substep "Removed: linux/build/ (temp)"
    fi
    if [ -d "$LINUX_DIR/build-x86" ]; then
        rm -rf "$LINUX_DIR/build-x86"
        write_substep "Removed: linux/build-x86/ (temp)"
    fi
    if [ -d "$LINUX_DIR/output" ]; then
        rm -rf "$LINUX_DIR/output"
        write_substep "Removed: linux/output/ (packages)"
    fi
fi
if $BUILD_WINDOWS; then
    write_step "Cleaning up Windows build artifacts..."
    if [ -d "$WINDOWS_DIR/jre8-x64" ]; then
        rm -rf "$WINDOWS_DIR/jre8-x64"
        write_substep "Removed: windows/jre8-x64/ (JRE)"
    fi
    if [ -d "$WINDOWS_DIR/jre8-x86" ]; then
        rm -rf "$WINDOWS_DIR/jre8-x86"
        write_substep "Removed: windows/jre8-x86/ (JRE)"
    fi
    if [ -d "$WINDOWS_DIR/Output" ]; then
        rm -rf "$WINDOWS_DIR/Output"
        write_substep "Removed: windows/Output/ (installers)"
    fi
fi
if $BUILD_MACOS; then
    write_step "Cleaning up macOS build artifacts..."
    if [ -d "$MACOS_INSTALLER_DIR/build" ]; then
        rm -rf "$MACOS_INSTALLER_DIR/build"
        write_substep "Removed: macos-installer/build/ (temp)"
    fi
fi
write_success "Build artifacts cleaned"

# Final cleanup - remove intermediate output folders after successful build
write_section "FINAL CLEANUP"
cleanup_performed=false

if $BUILD_WINDOWS && [ -d "$WINDOWS_DIR/Output" ]; then
    # Verify files exist in build-output before cleaning
    if ls "$OUTPUT_DIR"/*setup*.exe 1> /dev/null 2>&1; then
        rm -rf "$WINDOWS_DIR/Output"
        write_substep "Removed: windows/Output/"
        cleanup_performed=true
    fi
fi

if $BUILD_LINUX && [ -d "$LINUX_DIR/output" ]; then
    # Verify files exist in build-output before cleaning
    if ls "$OUTPUT_DIR"/*.deb 1> /dev/null 2>&1 || ls "$OUTPUT_DIR"/trexo-pdf-signer-*-linux.tar.gz 1> /dev/null 2>&1; then
        rm -rf "$LINUX_DIR/output"
        write_substep "Removed: linux/output/"
        cleanup_performed=true
    fi
fi

if $BUILD_MACOS && [ -d "$MACOS_INSTALLER_DIR/output" ]; then
    # Verify files exist in build-output before cleaning
    if ls "$OUTPUT_DIR"/*macOS*.zip 1> /dev/null 2>&1; then
        rm -rf "$MACOS_INSTALLER_DIR/output"
        write_substep "Removed: macos-installer/output/"
        cleanup_performed=true
    fi
fi

if $cleanup_performed; then
    write_success "Intermediate output folders cleaned"
else
    write_substep "No cleanup needed"
fi

# Show summary
show_summary

echo -e "${GREEN}  Done!${NC}"
echo ""