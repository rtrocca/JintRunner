#!/bin/bash

# JintRunner Build Script
# Builds self-contained executables for Windows ARM64, Windows X86, and Linux ARM64

set -e  # Exit on any error

echo "=================================================="
echo "JintRunner Multi-Platform Build Script"
echo "=================================================="
echo

# Check if dotnet is available
if ! command -v dotnet &> /dev/null; then
    echo "❌ Error: .NET SDK not found. Please install .NET 8 SDK."
    exit 1
fi

echo "✅ .NET SDK found: $(dotnet --version)"
echo

# Clean previous builds
echo "🧹 Cleaning previous builds..."
dotnet clean --configuration Release --verbosity quiet
rm -rf bin/Release/net8.0/*/publish 2>/dev/null || true
echo "✅ Clean completed"
echo

# Build parameters
BUILD_PARAMS="--configuration Release --self-contained true -p:PublishSingleFile=true -p:PublishTrimmed=true"

# Function to build for a specific runtime
build_for_runtime() {
    local runtime=$1
    local platform_name=$2
    local executable_name=$3
    
    echo "🔨 Building $platform_name ($runtime)..."
    
    if dotnet publish -r $runtime $BUILD_PARAMS --verbosity quiet; then
        local output_path="bin/Release/net8.0/$runtime/publish/$executable_name"
        if [ -f "$output_path" ]; then
            local size=$(du -h "$output_path" | cut -f1)
            echo "✅ $platform_name build completed - Size: $size"
            echo "   📁 Location: $output_path"
        else
            echo "❌ $platform_name build failed - executable not found"
            return 1
        fi
    else
        echo "❌ $platform_name build failed"
        return 1
    fi
    echo
}

# Build for all platforms
echo "Starting builds..."
echo

# Windows ARM64
build_for_runtime "win-arm64" "Windows ARM64" "jr.exe"

# Windows X86
build_for_runtime "win-x86" "Windows X86" "jr.exe"

# Linux ARM64
build_for_runtime "linux-arm64" "Linux ARM64" "jr"

# Summary
echo "=================================================="
echo "Build Summary"
echo "=================================================="
echo

if [ -f "bin/Release/net8.0/win-arm64/publish/jr.exe" ] && \
   [ -f "bin/Release/net8.0/win-x86/publish/jr.exe" ] && \
   [ -f "bin/Release/net8.0/linux-arm64/publish/jr" ]; then
    
    echo "🎉 All builds completed successfully!"
    echo
    echo "📦 Generated executables:"
    echo
    
    # List all executables with sizes
    for target in "win-arm64/jr.exe" "win-x86/jr.exe" "linux-arm64/jr"; do
        path="bin/Release/net8.0/$target"
        if [ -f "publish/$path" ]; then
            size=$(du -h "bin/Release/net8.0/${target%/*}/publish/${target##*/}" | cut -f1)
            echo "   🔹 $target (${size})"
        fi
    done
    
    echo
    echo "📍 All executables are in their respective publish directories:"
    echo "   • bin/Release/net8.0/win-arm64/publish/"
    echo "   • bin/Release/net8.0/win-x86/publish/"
    echo "   • bin/Release/net8.0/linux-arm64/publish/"
    echo
    
    # Create distribution packages
    echo "📦 Creating distribution packages..."
    echo

    # Check if build directory exists, create if it doesn't
    if [ ! -d "build" ]; then
        echo "📁 Creating build directory..."
        mkdir -p build
        echo "✅ Build directory created"
    else
        echo "📁 Build directory already exists"
    fi

    # Get current date in YYYYMMDD format
    BUILD_DATE=$(date +%Y%m%d)

    echo "Creating zip packages for date: $BUILD_DATE"
    echo

    # Create Windows ARM64 package
    echo "🔨 Creating Windows ARM64 package..."
    PACKAGE_PATH="${PWD}/build/jr-win-arm64-${BUILD_DATE}.zip"
    cd bin/Release/net8.0/win-arm64/publish/
    zip -q "$PACKAGE_PATH" jr.exe
    cd - > /dev/null
    if [ -f "build/jr-win-arm64-${BUILD_DATE}.zip" ]; then
        ZIP_SIZE=$(du -h "build/jr-win-arm64-${BUILD_DATE}.zip" | cut -f1)
        echo "✅ Windows ARM64 package created - Size: $ZIP_SIZE"
        echo "   📁 Location: build/jr-win-arm64-${BUILD_DATE}.zip"
    else
        echo "❌ Failed to create Windows ARM64 package"
        exit 1
    fi

    # Create Windows X86 package
    echo "🔨 Creating Windows X86 package..."
    PACKAGE_PATH="${PWD}/build/jr-win-x86-${BUILD_DATE}.zip"
    cd bin/Release/net8.0/win-x86/publish/
    zip -q "$PACKAGE_PATH" jr.exe
    cd - > /dev/null
    if [ -f "build/jr-win-x86-${BUILD_DATE}.zip" ]; then
        ZIP_SIZE=$(du -h "build/jr-win-x86-${BUILD_DATE}.zip" | cut -f1)
        echo "✅ Windows X86 package created - Size: $ZIP_SIZE"
        echo "   📁 Location: build/jr-win-x86-${BUILD_DATE}.zip"
    else
        echo "❌ Failed to create Windows X86 package"
        exit 1
    fi

    # Create Linux ARM64 package
    echo "🔨 Creating Linux ARM64 package..."
    PACKAGE_PATH="${PWD}/build/jr-linux-arm64-${BUILD_DATE}.zip"
    cd bin/Release/net8.0/linux-arm64/publish/
    zip -q "$PACKAGE_PATH" jr
    cd - > /dev/null
    if [ -f "build/jr-linux-arm64-${BUILD_DATE}.zip" ]; then
        ZIP_SIZE=$(du -h "build/jr-linux-arm64-${BUILD_DATE}.zip" | cut -f1)
        echo "✅ Linux ARM64 package created - Size: $ZIP_SIZE"
        echo "   📁 Location: build/jr-linux-arm64-${BUILD_DATE}.zip"
    else
        echo "❌ Failed to create Linux ARM64 package"
        exit 1
    fi

    echo
    echo "🎉 Distribution packages created successfully!"
    echo
    echo "📦 Package Summary:"
    ls -la build/jr-*-${BUILD_DATE}.zip 2>/dev/null | awk '{print "   • " $9 " - " $5 " bytes"}'
    echo
    
    echo "💡 Usage examples:"
    echo "   Windows: jr.exe cli"
    echo "   Linux:   ./jr cli"
    echo
else
    echo "❌ Some builds failed. Check the output above for details."
    exit 1
fi

echo "=================================================="