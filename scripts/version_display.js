// Simple version display example

write("=== JintRunner Version Information ===");

const version = get_version();

// Create a nice header with version info
write("");
write("┌─────────────────────────────────────────────────┐");
write(`│ ${version.product.padEnd(47)} │`);
write(`│ Version: ${version.informational_version.padEnd(38)} │`);
write(`│ Build: ${version.build_date.padEnd(40)} │`);
write(`│ Runtime: ${version.framework_description.padEnd(36)} │`);
write("└─────────────────────────────────────────────────┘");
write("");

// Version-based feature detection
const [major, minor] = version.version.split('.').map(Number);

if (major === 0 && minor === 1) {
    write("🚧 DEVELOPMENT VERSION");
    write("   • Multi-document YAML parsing ✅");
    write("   • Template rendering with Fluid ✅");
    write("   • Environment variables support ✅");
    write("   • Version information access ✅");
    write("");
    write("⚠️  This is an alpha release - some features may be experimental.");
} else if (major >= 1) {
    write("✅ STABLE RELEASE");
    write("   All features are production-ready.");
}

write("");
write(`Copyright: ${version.copyright}`);
write(`Build timestamp: ${version.build_date}`);