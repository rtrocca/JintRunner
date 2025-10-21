// ReadFile demonstration - successful cases only

write("=== ReadFile Function Demonstration ===");

write("\\n📁 Reading hello.js:");
const hello = ReadFile("scripts/hello.js");
write(`✅ Content: "${hello.trim()}"`);
write(`📊 Size: ${hello.length} characters`);

write("\\n📁 Reading version_display.js (preview):");
const version = ReadFile("scripts/version_display.js");
write(`✅ First 150 characters: "${version.substring(0, 150)}..."`);
write(`📊 Size: ${version.length} characters`);

write("\\n📁 Reading README.md (analysis):");
const readme = ReadFile("README.md");
const lines = readme.split('\\n');
const nonEmptyLines = lines.filter(line => line.trim().length > 0);
const headingLines = lines.filter(line => line.trim().startsWith('#'));

write(`✅ README.md analysis:`);
write(`   📊 Total lines: ${lines.length}`);
write(`   📊 Non-empty lines: ${nonEmptyLines.length}`);
write(`   📊 Headings: ${headingLines.length}`);
write(`   📊 File size: ${readme.length} bytes`);

// Show some headings
write("\\n📋 Headings found:");
headingLines.slice(0, 5).forEach((line, index) => {
    write(`   ${index + 1}. ${line.trim()}`);
});

write("\\n📁 Reading JintRunner.csproj (project info):");
const csproj = ReadFile("JintRunner.csproj");
write(`✅ Project file loaded (${csproj.length} characters)`);

// Extract version info from project file
const versionMatch = csproj.match(/<Version>(.*?)<\/Version>/);
if (versionMatch) {
    write(`📦 Project version: ${versionMatch[1]}`);
}

write("\\n=== ReadFile Function Summary ===");
write("✅ Synchronous file reading");
write("✅ Returns string content immediately");
write("✅ Throws exceptions for errors");
write("✅ Perfect for configuration files");
write("✅ No async/await complexity");

write("\\n📖 **Usage Pattern:**");
write("```javascript");
write("// For files that should exist:");
write("const content = ReadFile('myfile.txt');");
write("");
write("// For files that might not exist:");
write("// Handle at application level or use try-catch");
write("// in a wrapper function if needed");
write("```");

write("\\n⚠️  **Error Handling:**");
write("Exceptions thrown by ReadFile will terminate script execution.");
write("This is by design for a synchronous function - errors should be");
write("handled at the application level or prevented by checking file");
write("existence beforehand if needed.");

write("\\n🎉 ReadFile demonstration completed successfully!");