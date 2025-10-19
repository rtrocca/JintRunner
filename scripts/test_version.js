// Test script for get_version function

write("=== Testing get_version Function ===");

try {
    const versionInfo = get_version();

    write("\\n📦 Assembly Version Information:");
    write(`Version: ${versionInfo.version}`);
    write(`Assembly Version: ${versionInfo.assembly_version}`);
    write(`File Version: ${versionInfo.file_version}`);
    write(`Informational Version: ${versionInfo.informational_version}`);

    write("\\n🏷️ Product Information:");
    write(`Product: ${versionInfo.product}`);
    write(`Description: ${versionInfo.description}`);
    write(`Company: ${versionInfo.company}`);
    write(`Copyright: ${versionInfo.copyright}`);

    write("\\n🔧 Runtime Information:");
    write(`Build Date: ${versionInfo.build_date}`);
    write(`Runtime Version: ${versionInfo.runtime_version}`);
    write(`Framework: ${versionInfo.framework_description}`);

    write("\\n📋 Full Version Object:");
    write(JSON.stringify(versionInfo, null, 2));

} catch (error) {
    write(`❌ Error getting version information: ${error.message}`);
}

write("\\n=== Usage Examples ===");

write("\\n// Basic version check:");
write("const version = get_version();");
write("if (version.version.startsWith('0.1')) {");
write("  console.log('Running development version');");
write("}");

write("\\n// Display version in UI:");
write("const info = get_version();");
write(`console.log(\`\${info.product} v\${info.version}\`);`);

write("\\n// Check for specific features by version:");
write("const ver = get_version();");
write("const [major, minor, patch] = ver.version.split('.').map(Number);");
write("if (major >= 1 || (major === 0 && minor >= 2)) {");
write("  console.log('Advanced features available');");
write("}");

write("\\n// Runtime environment info:");
write("const runtime = get_version();");
write("console.log(`Running on ${runtime.framework_description}`);");

write("\\n=== Integration Examples ===");

// Example: Version-aware script
write("\\n🔄 Version-Aware Script Example:");
try {
    const ver = get_version();
    write(`Currently running ${ver.product} ${ver.informational_version}`);
    write(`Built on: ${ver.build_date}`);

    // Parse version for feature detection
    const versionParts = ver.version.split('.');
    const major = parseInt(versionParts[0] || '0');
    const minor = parseInt(versionParts[1] || '0');

    if (major === 0 && minor === 1) {
        write("🚧 Development version detected - some features may be experimental");
    } else if (major >= 1) {
        write("✅ Stable version detected - all features available");
    }

} catch (error) {
    write(`Error in version-aware logic: ${error.message}`);
}

// Example: System information for debugging
write("\\n🐛 Debug Information:");
try {
    const debug = get_version();
    write("System Debug Info:");
    write(`- Product: ${debug.product}`);
    write(`- Version: ${debug.version}`);
    write(`- Runtime: ${debug.runtime_version}`);
    write(`- Build: ${debug.build_date}`);
    write(`- Framework: ${debug.framework_description}`);
} catch (error) {
    write(`Error getting debug info: ${error.message}`);
}

write("\\n=== Version Information Benefits ===");
write("✅ Feature detection based on version numbers");
write("✅ Debug information for troubleshooting");
write("✅ Runtime environment details");
write("✅ Build timestamp for deployment tracking");
write("✅ Copyright and licensing information");
write("✅ Product branding and description");

write("\\n=== Available Properties ===");
write("📊 version: Main semantic version (from <Version>)");
write("📊 assembly_version: .NET assembly version (from <AssemblyVersion>)");
write("📊 file_version: File version (from <FileVersion>)");
write("📊 informational_version: Full version string (from <InformationalVersion>)");
write("📊 product: Product name (from <Product>)");
write("📊 description: Product description (from <Description>)");
write("📊 company: Company name (from <Company>)");
write("📊 copyright: Copyright notice (from <Copyright>)");
write("📊 build_date: When the assembly was built");
write("📊 runtime_version: .NET runtime version");
write("📊 framework_description: Framework description (.NET 8.0, etc.)");

write("\\n=== Testing Complete ===");