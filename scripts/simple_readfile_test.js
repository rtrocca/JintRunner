// Simple ReadFile test with proper error handling

write("=== ReadFile Function Test ===");

// Test 1: Successful file read
write("\\n1. Reading hello.js:");
try {
    const content = ReadFile("scripts/hello.js");
    write(`✅ Success! Content: "${content.trim()}"`);
    write(`📊 Length: ${content.length} characters`);
} catch (error) {
    write(`❌ Error: ${error.message}`);
}

// Test 2: Another successful read
write("\\n2. Reading README.md (first 100 chars):");
try {
    const readme = ReadFile("README.md");
    write(`✅ Success! Preview: "${readme.substring(0, 100)}..."`);
    write(`📊 Length: ${readme.length} characters`);
} catch (error) {
    write(`❌ Error: ${error.message}`);
}

write("\\n=== Error Cases ===");

// Test 3: File not found (handled)
write("\\n3. Non-existent file:");
try {
    const content = ReadFile("does-not-exist.txt");
    write("❌ This should not succeed");
} catch (error) {
    write(`✅ Correctly caught: ${error.message}`);
}

// Test 4: Empty path (handled)
write("\\n4. Empty path:");
try {
    const content = ReadFile("");
    write("❌ This should not succeed");
} catch (error) {
    write(`✅ Correctly caught: ${error.message}`);
}

write("\\n=== Practical Usage Example ===");

// Example: Reading and processing a file
write("\\n📖 Reading and analyzing version_display.js:");
try {
    const code = ReadFile("scripts/version_display.js");
    const lines = code.split('\\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    const commentLines = lines.filter(line => line.trim().startsWith('//'));

    write(`✅ File analysis complete:`);
    write(`   Total lines: ${lines.length}`);
    write(`   Non-empty lines: ${nonEmptyLines.length}`);
    write(`   Comment lines: ${commentLines.length}`);
    write(`   File size: ${code.length} bytes`);
} catch (error) {
    write(`❌ Analysis failed: ${error.message}`);
}

write("\\n🎉 ReadFile function test completed successfully!");

write("\\n📝 **Summary:**");
write("• ReadFile(path) reads text files synchronously");
write("• Returns string content immediately");
write("• Throws exceptions for errors (use try-catch)");
write("• Perfect for configuration files, templates, data files");
write("• No promises or async handling needed");