# ============================================================================
# Trexo PDF Signer - Cross-Platform Build Script (Windows PowerShell)
# TrexoLab - https://trexolab.com
# ============================================================================
#
# Usage:
#   .\build-all.ps1              # Build all platforms
#   .\build-all.ps1 -Windows     # Only Windows builds
#   .\build-all.ps1 -Linux       # Only Linux builds (requires Docker)
#   .\build-all.ps1 -MacOS       # Only macOS builds (hybrid installer)
#   .\build-all.ps1 -Jar         # Only JAR file
#   .\build-all.ps1 -Clean       # Clean all build artifacts and downloads
#   .\build-all.ps1 -CleanBuild  # Clean then build all
#
# ============================================================================

param(
    [switch]$Windows,
    [switch]$Linux,
    [switch]$MacOS,
    [switch]$Jar,
    [switch]$Clean,
    [switch]$CleanBuild
)

# ============================================================================
# Configuration
# ============================================================================
$ErrorActionPreference = "Stop"
$ProgressPreference = 'SilentlyContinue'

$DistributionsDir = $PSScriptRoot
$ProjectRoot = (Get-Item $DistributionsDir).Parent.FullName
$OutputDir = "$ProjectRoot\build-output"
$WindowsDir = "$DistributionsDir\windows"
$LinuxDir = "$DistributionsDir\linux"
$MacosInstallerDir = "$DistributionsDir\macos-installer"

# JRE URLs
$JRE_URLS = @{
    "windows_x64" = "https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u432-b06/OpenJDK8U-jre_x64_windows_hotspot_8u432b06.zip"
    "windows_x86" = "https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u432-b06/OpenJDK8U-jre_x86-32_windows_hotspot_8u432b06.zip"
    "linux_x64"   = "https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u432-b06/OpenJDK8U-jre_x64_linux_hotspot_8u432b06.tar.gz"
    "linux_x86"   = "https://cdn.azul.com/zulu/bin/zulu8.82.0.21-ca-jre8.0.432-linux_i686.tar.gz"
    "macos_x64"   = "https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u432-b06/OpenJDK8U-jre_x64_mac_hotspot_8u432b06.tar.gz"
}

# ============================================================================
# Helper Functions
# ============================================================================
function Write-Banner {
    Write-Host ""
    Write-Host "  +=========================================================================+" -ForegroundColor Cyan
    Write-Host "  |                                                                         |" -ForegroundColor Cyan
    Write-Host "  |   Trexo PDF Signer - Build System                                       |" -ForegroundColor Cyan
    Write-Host "  |   TrexoLab - https://trexolab.com                                       |" -ForegroundColor Cyan
    Write-Host "  |                                                                         |" -ForegroundColor Cyan
    Write-Host "  +=========================================================================+" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Section {
    param($title)
    Write-Host ""
    Write-Host "  +------------------------------------------------------------------------+" -ForegroundColor Blue
    Write-Host "  |  $($title.PadRight(68))|" -ForegroundColor Blue
    Write-Host "  +------------------------------------------------------------------------+" -ForegroundColor Blue
}

function Write-Step {
    param($msg)
    Write-Host "  >> $msg" -ForegroundColor White
}

function Write-SubStep {
    param($msg)
    Write-Host "     - $msg" -ForegroundColor DarkGray
}

function Write-Success {
    param($msg)
    Write-Host "  [OK] $msg" -ForegroundColor Green
}

function Write-Warn {
    param($msg)
    Write-Host "  [!!] $msg" -ForegroundColor Yellow
}

function Write-Err {
    param($msg)
    Write-Host "  [XX] $msg" -ForegroundColor Red
}

function Write-Info {
    param($label, $value)
    Write-Host "  $label : " -ForegroundColor DarkGray -NoNewline
    Write-Host $value -ForegroundColor White
}

function Get-FileSize {
    param($path)
    if (Test-Path $path) {
        $size = (Get-Item $path).Length
        if ($size -gt 1GB) { return "{0:N2} GB" -f ($size / 1GB) }
        if ($size -gt 1MB) { return "{0:N2} MB" -f ($size / 1MB) }
        if ($size -gt 1KB) { return "{0:N2} KB" -f ($size / 1KB) }
        return "$size bytes"
    }
    return "N/A"
}

# ============================================================================
# Clean Functions
# ============================================================================
function Clean-All {
    Write-Section "CLEANING ALL BUILD ARTIFACTS"

    $totalCleaned = 0

    # Clean output directory
    if (Test-Path $OutputDir) {
        $size = (Get-ChildItem $OutputDir -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        Remove-Item -Path $OutputDir -Recurse -Force -ErrorAction SilentlyContinue
        $totalCleaned += $size
        Write-Success "Removed: build-output/"
    }

    # Clean Maven target
    if (Test-Path "$ProjectRoot\target") {
        $size = (Get-ChildItem "$ProjectRoot\target" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        Remove-Item -Path "$ProjectRoot\target" -Recurse -Force -ErrorAction SilentlyContinue
        $totalCleaned += $size
        Write-Success "Removed: target/"
    }

    # Clean dependency-reduced-pom.xml
    if (Test-Path "$ProjectRoot\dependency-reduced-pom.xml") {
        Remove-Item "$ProjectRoot\dependency-reduced-pom.xml" -Force -ErrorAction SilentlyContinue
        Write-Success "Removed: dependency-reduced-pom.xml"
    }

    Clean-Windows
    Clean-Linux
    Clean-MacOS

    $cleanedMB = [math]::Round($totalCleaned / 1MB, 2)
    Write-Host ""
    Write-Success "Total space freed: $cleanedMB MB"
}

function Clean-Windows {
    Write-Step "Cleaning Windows artifacts..."

    if (Test-Path "$WindowsDir\jre8-x64") {
        Remove-Item -Path "$WindowsDir\jre8-x64" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: windows/jre8-x64/"
    }
    if (Test-Path "$WindowsDir\jre8-x86") {
        Remove-Item -Path "$WindowsDir\jre8-x86" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: windows/jre8-x86/"
    }
    if (Test-Path "$WindowsDir\Output") {
        Remove-Item -Path "$WindowsDir\Output" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: windows/Output/"
    }
}

function Clean-Linux {
    Write-Step "Cleaning Linux artifacts..."

    if (Test-Path "$LinuxDir\jre8-x64") {
        Remove-Item -Path "$LinuxDir\jre8-x64" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: linux/jre8-x64/"
    }
    if (Test-Path "$LinuxDir\jre8-x86") {
        Remove-Item -Path "$LinuxDir\jre8-x86" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: linux/jre8-x86/"
    }
    if (Test-Path "$LinuxDir\build") {
        Remove-Item -Path "$LinuxDir\build" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: linux/build/"
    }
    if (Test-Path "$LinuxDir\build-x86") {
        Remove-Item -Path "$LinuxDir\build-x86" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: linux/build-x86/"
    }
    if (Test-Path "$LinuxDir\output") {
        Remove-Item -Path "$LinuxDir\output" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: linux/output/"
    }
}

function Clean-MacOS {
    Write-Step "Cleaning macOS artifacts..."

    if (Test-Path "$MacosInstallerDir\build") {
        Remove-Item -Path "$MacosInstallerDir\build" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: macos-installer/build/"
    }
    if (Test-Path "$MacosInstallerDir\output") {
        Remove-Item -Path "$MacosInstallerDir\output" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: macos-installer/output/"
    }
}

# ============================================================================
# Build Functions
# ============================================================================
function Build-Jar {
    Write-Section "BUILDING JAR"

    if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
        Write-Err "Maven not found!"
        Write-SubStep "Install: choco install maven"
        return $false
    }

    Write-Step "Running Maven build..."
    Push-Location $ProjectRoot

    $mvnOutput = mvn clean package -DskipTests -B -q 2>&1
    $success = $LASTEXITCODE -eq 0

    Pop-Location

    if ($success -and (Test-Path "$ProjectRoot\target\TrexoPDFSigner.jar")) {
        New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
        Copy-Item "$ProjectRoot\target\TrexoPDFSigner.jar" "$OutputDir\"
        $jarSize = Get-FileSize "$OutputDir\TrexoPDFSigner.jar"
        Write-Success "JAR built successfully ($jarSize)"
        return $true
    } else {
        Write-Err "Maven build failed!"
        Write-Host $mvnOutput -ForegroundColor Red
        return $false
    }
}

function Build-Windows {
    Write-Section "BUILDING WINDOWS INSTALLERS"

    $ISCC = "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
    if (-not (Test-Path $ISCC)) {
        Write-Warn "Inno Setup not found. Attempting to install..."
        choco install innosetup -y 2>&1 | Out-Null
        if (-not (Test-Path $ISCC)) {
            Write-Err "Failed to install Inno Setup"
            return
        }
    }

    # Build x64
    Write-Step "Building Windows x64 installer..."
    $jreDir = "$WindowsDir\jre8-x64"

    if (-not (Test-Path "$jreDir\bin\java.exe")) {
        Write-SubStep "Downloading JRE x64..."
        $tempZip = "$env:TEMP\jre8-x64-$([guid]::NewGuid().ToString().Substring(0,8)).zip"

        try {
            Invoke-WebRequest -Uri $JRE_URLS["windows_x64"] -OutFile $tempZip -UseBasicParsing

            $tempExtract = "$env:TEMP\jre_extract_$([guid]::NewGuid().ToString().Substring(0,8))"
            Expand-Archive -Path $tempZip -DestinationPath $tempExtract -Force

            $extractedDir = Get-ChildItem -Path $tempExtract -Directory | Select-Object -First 1
            Remove-Item -Path $jreDir -Recurse -Force -ErrorAction SilentlyContinue
            New-Item -ItemType Directory -Path $jreDir -Force | Out-Null
            Move-Item -Path "$($extractedDir.FullName)\*" -Destination $jreDir -Force

            Remove-Item -Path $tempZip -Force -ErrorAction SilentlyContinue
            Remove-Item -Path $tempExtract -Recurse -Force -ErrorAction SilentlyContinue
            Write-SubStep "JRE x64 downloaded"
        } catch {
            Write-Err "Failed to download JRE x64: $_"
            return
        }
    } else {
        Write-SubStep "JRE x64 already cached"
    }

    $result = & $ISCC "$WindowsDir\trexo-pdf-signer-x64.iss" 2>&1
    if (Test-Path "$WindowsDir\Output\trexo-pdf-signer-x64-setup.exe") {
        Copy-Item "$WindowsDir\Output\trexo-pdf-signer-x64-setup.exe" "$OutputDir\"
        $size = Get-FileSize "$OutputDir\trexo-pdf-signer-x64-setup.exe"
        Write-Success "Windows x64 installer built ($size)"
    } else {
        Write-Err "Windows x64 build failed"
    }

    # Build x86
    Write-Step "Building Windows x86 installer..."
    $jreDir = "$WindowsDir\jre8-x86"

    if (-not (Test-Path "$jreDir\bin\java.exe")) {
        Write-SubStep "Downloading JRE x86..."
        $tempZip = "$env:TEMP\jre8-x86-$([guid]::NewGuid().ToString().Substring(0,8)).zip"

        try {
            Invoke-WebRequest -Uri $JRE_URLS["windows_x86"] -OutFile $tempZip -UseBasicParsing

            $tempExtract = "$env:TEMP\jre_extract_$([guid]::NewGuid().ToString().Substring(0,8))"
            Expand-Archive -Path $tempZip -DestinationPath $tempExtract -Force

            $extractedDir = Get-ChildItem -Path $tempExtract -Directory | Select-Object -First 1
            Remove-Item -Path $jreDir -Recurse -Force -ErrorAction SilentlyContinue
            New-Item -ItemType Directory -Path $jreDir -Force | Out-Null
            Move-Item -Path "$($extractedDir.FullName)\*" -Destination $jreDir -Force

            Remove-Item -Path $tempZip -Force -ErrorAction SilentlyContinue
            Remove-Item -Path $tempExtract -Recurse -Force -ErrorAction SilentlyContinue
            Write-SubStep "JRE x86 downloaded"
        } catch {
            Write-Err "Failed to download JRE x86: $_"
            return
        }
    } else {
        Write-SubStep "JRE x86 already cached"
    }

    $result = & $ISCC "$WindowsDir\trexo-pdf-signer-x86.iss" 2>&1
    if (Test-Path "$WindowsDir\Output\trexo-pdf-signer-x86-setup.exe") {
        Copy-Item "$WindowsDir\Output\trexo-pdf-signer-x86-setup.exe" "$OutputDir\"
        $size = Get-FileSize "$OutputDir\trexo-pdf-signer-x86-setup.exe"
        Write-Success "Windows x86 installer built ($size)"
    } else {
        Write-Err "Windows x86 build failed"
    }
}

function Build-Linux {
    Write-Section "BUILDING LINUX PACKAGES (via Docker)"

    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Err "Docker not installed!"
        Write-SubStep "Install from: https://docker.com/products/docker-desktop"
        return
    }

    # Check if Docker is running (PowerShell 5.1 compatible)
    $dockerRunning = $false
    try {
        $dockerVersion = docker version --format '{{.Server.Version}}' 2>$null
        if ($dockerVersion) {
            $dockerRunning = $true
        }
    } catch {
        $dockerRunning = $false
    }

    if (-not $dockerRunning) {
        Write-Err "Docker is not running!"
        Write-SubStep "Please start Docker Desktop and try again"
        return
    }

    Write-Success "Docker is running"
    Write-Step "Building in Docker container..."
    Write-SubStep "This may take a few minutes on first run..."

    # Create build script with Unix line endings
    $TempScript = "$env:TEMP\docker-build-linux-$([guid]::NewGuid().ToString().Substring(0,8)).sh"
    $ScriptContent = @'
#!/bin/bash
set -e

echo ''
echo '========================================================================'
echo '  Linux Build Environment'
echo '========================================================================'
echo ''

echo '>> Installing build dependencies...'
apt-get update -qq
apt-get install -y -qq curl tar gzip dpkg-dev fakeroot sed > /dev/null 2>&1
echo '   [OK] Dependencies installed'

echo ''
echo '>> Downloading JRE x64...'
curl -sL -o jre8-x64.tar.gz 'https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u432-b06/OpenJDK8U-jre_x64_linux_hotspot_8u432b06.tar.gz'
rm -rf distributions/linux/jre8-x64
mkdir -p distributions/linux/jre8-x64
tar -xzf jre8-x64.tar.gz -C distributions/linux/jre8-x64 --strip-components=1
rm jre8-x64.tar.gz
chmod +x distributions/linux/jre8-x64/bin/*
echo '   [OK] JRE x64 ready'

echo ''
echo '>> Downloading JRE x86...'
curl -sL -o jre8-x86.tar.gz 'https://cdn.azul.com/zulu/bin/zulu8.82.0.21-ca-jre8.0.432-linux_i686.tar.gz'
rm -rf distributions/linux/jre8-x86
mkdir -p distributions/linux/jre8-x86
tar -xzf jre8-x86.tar.gz -C distributions/linux/jre8-x86 --strip-components=1
rm jre8-x86.tar.gz
chmod +x distributions/linux/jre8-x86/bin/*
echo '   [OK] JRE x86 ready'

echo ''
echo '>> Preparing build scripts...'
cd distributions/linux

# Fix Windows line endings (CRLF -> LF)
for f in *.sh trexo-pdf-signer trexo-pdf-signer-x86 *.desktop; do
    if [ -f "$f" ]; then
        sed -i 's/\r$//' "$f" 2>/dev/null || true
        chmod +x "$f" 2>/dev/null || true
    fi
done
echo '   [OK] Scripts prepared'

# Clean previous builds
rm -rf build build-x86 output
mkdir -p output

echo ''
echo '>> Building DEB package (x64)...'
./build-deb.sh > /dev/null 2>&1
if [ -f "output/trexo-pdf-signer-x64.deb" ]; then
    echo '   [OK] trexo-pdf-signer-x64.deb'
fi

echo ''
echo '>> Building TAR.GZ package (x64)...'
./build-tar.sh > /dev/null 2>&1
if [ -f "output/trexo-pdf-signer-x64-linux.tar.gz" ]; then
    echo '   [OK] trexo-pdf-signer-x64-linux.tar.gz'
fi

echo ''
echo '>> Building DEB package (x86)...'
./build-deb-x86.sh > /dev/null 2>&1
if [ -f "output/trexo-pdf-signer-x86.deb" ]; then
    echo '   [OK] trexo-pdf-signer-x86.deb'
fi

echo ''
echo '>> Building TAR.GZ package (x86)...'
./build-tar-x86.sh > /dev/null 2>&1
if [ -f "output/trexo-pdf-signer-x86-linux.tar.gz" ]; then
    echo '   [OK] trexo-pdf-signer-x86-linux.tar.gz'
fi

echo ''
echo '========================================================================'
echo '  Linux builds complete!'
echo '========================================================================'
echo ''
ls -lh output/
'@

    # Convert to Unix line endings and save
    $ScriptContent = $ScriptContent -replace "`r`n", "`n"
    [System.IO.File]::WriteAllText($TempScript, $ScriptContent, [System.Text.UTF8Encoding]::new($false))

    # Run Docker
    docker run --rm -v "${ProjectRoot}:/app" -v "${TempScript}:/build.sh" -w /app ubuntu:22.04 bash /build.sh

    # Clean up temp script
    Remove-Item $TempScript -Force -ErrorAction SilentlyContinue

    if ($LASTEXITCODE -eq 0) {
        # Copy outputs
        if (Test-Path "$LinuxDir\output") {
            $files = Get-ChildItem "$LinuxDir\output\*" -Include "*.deb", "*.tar.gz" -ErrorAction SilentlyContinue
            foreach ($file in $files) {
                Copy-Item $file.FullName "$OutputDir\" -Force
                $size = Get-FileSize $file.FullName
                Write-Success "Copied: $($file.Name) ($size)"
            }
        }
    } else {
        Write-Err "Docker build failed with exit code: $LASTEXITCODE"
    }
}

function Build-MacOS {
    Write-Section "BUILDING MACOS INSTALLERS (Hybrid)"

    $JarFile = "$ProjectRoot\target\TrexoPDFSigner.jar"
    if (-not (Test-Path $JarFile)) {
        Write-Err "JAR file not found! Build JAR first."
        return
    }

    # Get version
    $AppVersion = "1.0.4"
    if (Test-Path "$ProjectRoot\VERSION") {
        $AppVersion = (Get-Content "$ProjectRoot\VERSION" -Raw).Trim()
    }

    $BuildDir = "$MacosInstallerDir\build"
    $MacosOutputDir = "$MacosInstallerDir\output"
    $InstallerFolderName = "TrexoPDFSigner-Installer"

    # Output names
    $LiteZipName = "TrexoPDFSigner-$AppVersion-macOS-Lite.zip"
    $FullZipName = "TrexoPDFSigner-$AppVersion-macOS-Full.zip"

    Write-Step "Preparing build directories..."
    Remove-Item -Path $BuildDir -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path $MacosOutputDir -Recurse -Force -ErrorAction SilentlyContinue
    New-Item -ItemType Directory -Path "$BuildDir\$InstallerFolderName\app-data" -Force | Out-Null
    New-Item -ItemType Directory -Path $MacosOutputDir -Force | Out-Null

    # Copy base files
    Write-Step "Copying installer files..."
    Copy-Item "$MacosInstallerDir\INSTALL.command" "$BuildDir\$InstallerFolderName\" -Force
    Copy-Item "$MacosInstallerDir\README.txt" "$BuildDir\$InstallerFolderName\" -Force
    Copy-Item $JarFile "$BuildDir\$InstallerFolderName\app-data\" -Force
    Write-SubStep "INSTALL.command, README.txt, JAR copied"

    # Copy icon
    $IconFile = $null
    $IconLocations = @(
        "$MacosInstallerDir\app-data\trexo-pdf-signer.icns",
        "$MacosInstallerDir\app-data\trexo-pdf-signer.png",
        "$LinuxDir\trexo-pdf-signer.png"
    )
    foreach ($loc in $IconLocations) {
        if (Test-Path $loc) {
            $IconFile = $loc
            Copy-Item $loc "$BuildDir\$InstallerFolderName\app-data\" -Force
            Write-SubStep "Icon copied: $(Split-Path $loc -Leaf)"
            break
        }
    }

    # Check for 7-Zip
    $Use7Zip = $false
    $7ZipPath = "C:\Program Files\7-Zip\7z.exe"
    if (Test-Path $7ZipPath) {
        $Use7Zip = $true
    }

    # Create Lite version
    Write-Step "Creating Lite version (downloads JRE at install)..."
    $LiteZipPath = "$MacosOutputDir\$LiteZipName"

    if ($Use7Zip) {
        Push-Location $BuildDir
        & $7ZipPath a -tzip -mx=9 $LiteZipPath $InstallerFolderName 2>&1 | Out-Null
        Pop-Location
    } else {
        Compress-Archive -Path "$BuildDir\$InstallerFolderName" -DestinationPath $LiteZipPath -CompressionLevel Optimal
    }

    if (Test-Path $LiteZipPath) {
        Copy-Item $LiteZipPath "$OutputDir\" -Force
        $size = Get-FileSize $LiteZipPath
        Write-Success "macOS Lite installer built ($size)"
    }

    # Create Full version (with bundled JRE)
    Write-Step "Creating Full version (with bundled JRE)..."
    Write-SubStep "Downloading macOS JRE x64 (~50 MB)..."

    $JreArchive = "$BuildDir\jre8.tar.gz"
    $JreExtractDir = "$BuildDir\jre-extract"

    try {
        Invoke-WebRequest -Uri $JRE_URLS["macos_x64"] -OutFile $JreArchive -UseBasicParsing
        Write-SubStep "JRE downloaded"

        # Extract JRE
        New-Item -ItemType Directory -Path $JreExtractDir -Force | Out-Null

        if ($Use7Zip) {
            & $7ZipPath x $JreArchive -o"$JreExtractDir" -y 2>&1 | Out-Null
            $TarFile = Get-ChildItem "$JreExtractDir\*.tar" -ErrorAction SilentlyContinue | Select-Object -First 1
            if ($TarFile) {
                & $7ZipPath x $TarFile.FullName -o"$JreExtractDir" -y 2>&1 | Out-Null
                Remove-Item $TarFile.FullName -Force -ErrorAction SilentlyContinue
            }
        } else {
            tar -xzf $JreArchive -C $JreExtractDir
        }

        # Find and copy JRE
        $JreSourceDir = Get-ChildItem $JreExtractDir -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "jdk*" } | Select-Object -First 1
        if ($JreSourceDir) {
            Copy-Item $JreSourceDir.FullName "$BuildDir\$InstallerFolderName\app-data\jre8" -Recurse -Force
            Write-SubStep "JRE extracted and bundled"

            # Create Full ZIP
            $FullZipPath = "$MacosOutputDir\$FullZipName"

            if ($Use7Zip) {
                Push-Location $BuildDir
                & $7ZipPath a -tzip -mx=9 $FullZipPath $InstallerFolderName 2>&1 | Out-Null
                Pop-Location
            } else {
                # Remove existing if any
                Remove-Item $FullZipPath -Force -ErrorAction SilentlyContinue
                Compress-Archive -Path "$BuildDir\$InstallerFolderName" -DestinationPath $FullZipPath -CompressionLevel Optimal
            }

            if (Test-Path $FullZipPath) {
                Copy-Item $FullZipPath "$OutputDir\" -Force
                $size = Get-FileSize $FullZipPath
                Write-Success "macOS Full installer built ($size)"
            }
        } else {
            Write-Warn "Could not find JRE after extraction, Full version skipped"
        }
    } catch {
        Write-Warn "Failed to download JRE for Full version: $_"
        Write-SubStep "Full version skipped, Lite version is available"
    }

    # Cleanup build directory
    Write-Step "Cleaning up build artifacts..."
    Remove-Item -Path $BuildDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-SubStep "Removed: macos-installer/build/"
}

function Show-Summary {
    Write-Host ""
    Write-Host "  +=========================================================================+" -ForegroundColor Green
    Write-Host "  |                         BUILD COMPLETE                                  |" -ForegroundColor Green
    Write-Host "  +=========================================================================+" -ForegroundColor Green
    Write-Host ""

    Write-Info "Output Directory" $OutputDir
    Write-Host ""

    if (Test-Path $OutputDir) {
        $files = Get-ChildItem $OutputDir -ErrorAction SilentlyContinue
        if ($files.Count -gt 0) {
            Write-Host "  +----------------------------------------------------------------------+" -ForegroundColor DarkGray
            Write-Host "  |  Generated Files                                                    |" -ForegroundColor DarkGray
            Write-Host "  +----------------------------------------------------------------------+" -ForegroundColor DarkGray

            foreach ($file in $files) {
                $size = Get-FileSize $file.FullName
                $name = $file.Name.PadRight(45)
                $sizeStr = $size.PadLeft(12)
                Write-Host "  |  $name $sizeStr |" -ForegroundColor White
            }

            Write-Host "  +----------------------------------------------------------------------+" -ForegroundColor DarkGray
        } else {
            Write-Warn "No files in output directory"
        }
    }

    Write-Host ""
}

# ============================================================================
# Main Execution
# ============================================================================

Write-Banner

# Get version
$Version = "unknown"
if (Test-Path "$ProjectRoot\VERSION") {
    $Version = (Get-Content "$ProjectRoot\VERSION" -Raw).Trim()
}

Write-Info "Version" $Version
Write-Info "Project Root" $ProjectRoot
Write-Info "Platform" "Windows (PowerShell)"
Write-Host ""

# Handle CleanBuild
if ($CleanBuild) {
    $Clean = $true
    if (-not $Windows -and -not $Linux -and -not $MacOS -and -not $Jar) {
        $Windows = $true
        $Linux = $true
        $MacOS = $true
        $Jar = $true
    }
}

# If only Clean flag, clean everything and exit
if ($Clean -and -not $Windows -and -not $Linux -and -not $MacOS -and -not $Jar -and -not $CleanBuild) {
    Clean-All
    Write-Host ""
    exit 0
}

# Clean if requested
if ($Clean) {
    if ($Windows -and -not $Linux -and -not $MacOS -and -not $Jar) {
        Clean-Windows
    } elseif ($Linux -and -not $Windows -and -not $MacOS -and -not $Jar) {
        Clean-Linux
    } elseif ($MacOS -and -not $Windows -and -not $Linux -and -not $Jar) {
        Clean-MacOS
    } else {
        Clean-All
    }
}

# Default: build all if no specific flags
if (-not $Windows -and -not $Linux -and -not $MacOS -and -not $Jar) {
    $Windows = $true
    $Linux = $true
    $MacOS = $true
    $Jar = $true
}

# Create output directory
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

# Build JAR (required for all builds)
if ($Jar -or $Windows -or $Linux -or $MacOS) {
    $jarSuccess = Build-Jar
    if (-not $jarSuccess) {
        Write-Err "JAR build failed. Cannot continue."
        exit 1
    }
}

# Build Windows
if ($Windows) {
    Build-Windows
}

# Build Linux
if ($Linux) {
    Build-Linux
}

# Build macOS
if ($MacOS) {
    Build-MacOS
}

# Final cleanup - remove JRE downloads and intermediate output folders
Write-Section "FINAL CLEANUP"
$cleanupPerformed = $false

# Clean Windows JRE and Output
if ($Windows) {
    if (Test-Path "$WindowsDir\jre8-x64") {
        Remove-Item -Path "$WindowsDir\jre8-x64" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: windows/jre8-x64/ (JRE)"
        $cleanupPerformed = $true
    }
    if (Test-Path "$WindowsDir\jre8-x86") {
        Remove-Item -Path "$WindowsDir\jre8-x86" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: windows/jre8-x86/ (JRE)"
        $cleanupPerformed = $true
    }
    if (Test-Path "$WindowsDir\Output") {
        Remove-Item -Path "$WindowsDir\Output" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: windows/Output/"
        $cleanupPerformed = $true
    }
}

# Clean Linux JRE and Output
if ($Linux) {
    if (Test-Path "$LinuxDir\jre8-x64") {
        Remove-Item -Path "$LinuxDir\jre8-x64" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: linux/jre8-x64/ (JRE)"
        $cleanupPerformed = $true
    }
    if (Test-Path "$LinuxDir\jre8-x86") {
        Remove-Item -Path "$LinuxDir\jre8-x86" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: linux/jre8-x86/ (JRE)"
        $cleanupPerformed = $true
    }
    if (Test-Path "$LinuxDir\build") {
        Remove-Item -Path "$LinuxDir\build" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: linux/build/"
        $cleanupPerformed = $true
    }
    if (Test-Path "$LinuxDir\build-x86") {
        Remove-Item -Path "$LinuxDir\build-x86" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: linux/build-x86/"
        $cleanupPerformed = $true
    }
    if (Test-Path "$LinuxDir\output") {
        Remove-Item -Path "$LinuxDir\output" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: linux/output/"
        $cleanupPerformed = $true
    }
}

# Clean macOS Output
if ($MacOS) {
    if (Test-Path "$MacosInstallerDir\build") {
        Remove-Item -Path "$MacosInstallerDir\build" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: macos-installer/build/"
        $cleanupPerformed = $true
    }
    if (Test-Path "$MacosInstallerDir\output") {
        Remove-Item -Path "$MacosInstallerDir\output" -Recurse -Force -ErrorAction SilentlyContinue
        Write-SubStep "Removed: macos-installer/output/"
        $cleanupPerformed = $true
    }
}

if ($cleanupPerformed) {
    Write-Success "JRE downloads and intermediate folders cleaned"
} else {
    Write-SubStep "No cleanup needed"
}

# Show summary
Show-Summary

Write-Host "  Done!" -ForegroundColor Green
Write-Host ""
