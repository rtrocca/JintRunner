// Test synchronous ReadFile function

write("=== Testing ReadFile (Synchronous) Function ===");

// Test 1: Read an existing file
write("\\n1. Testing with existing file (hello.js):");
try {
    const content = ReadFile("scripts/hello.js");
    write("✅ File read successfully!");
    write(`📊 File size: ${content.length} characters`);
    write("📄 Content:");
    write("─".repeat(40));
    write(content);
    write("─".repeat(40));
} catch (error) {
    write(`❌ Error reading file: ${error.message}`);
}

// Test 2: Read another file
write("\\n2. Testing with version_display.js:");
try {
    const versionContent = ReadFile("scripts/version_display.js");
    write("✅ Version file read successfully!");
    write(`📊 File size: ${versionContent.length} characters`);
    write("📄 First 100 characters:");
    write(versionContent.substring(0, 100) + "...");
} catch (error) {
    write(`❌ Error reading version file: ${error.message}`);
}

// Test 3: Try to read a non-existent file
write("\\n3. Testing with non-existent file:");
try {
    const nonExistentContent = ReadFile("does-not-exist.txt");
    write("❌ This should not succeed!");
} catch (error) {
    write(`✅ Correctly threw error: ${error.message}`);
}

// Test 4: Try with empty path
write("\\n4. Testing with empty path:");
try {
    const emptyContent = ReadFile("");
    write("❌ This should not succeed!");
} catch (error) {
    write(`✅ Correctly threw error: ${error.message}`);
}

// Test 5: Try with null path
write("\\n5. Testing with null path:");
try {
    const nullContent = ReadFile(null);
    write("❌ This should not succeed!");
} catch (error) {
    write(`✅ Correctly threw error: ${error.message}`);
}

// Test 6: Read a project file
write("\\n6. Testing with project file (README.md):");
try {
    const readme = ReadFile("README.md");
    write("✅ README.md read successfully!");
    write(`📊 File size: ${readme.length} characters`);
    write("📄 First 200 characters:");
    write(readme.substring(0, 200) + "...");
} catch (error) {
    write(`❌ Error reading README: ${error.message}`);
}

write("\\n=== Usage Examples ===");
write("\\n📖 **Basic File Reading:**");
write("```javascript");
write("try {");
write("    const content = ReadFile('myfile.txt');");
write("    console.log('File content:', content);");
write("} catch (error) {");
write("    console.error('Error reading file:', error.message);");
write("}");
write("```");

write("\\n📖 **Reading Configuration Files:**");
write("```javascript");
write("try {");
write("    const yamlContent = ReadFile('config.yaml');");
write("    const config = parse_yaml(yamlContent)[0];");
write("    console.log('App name:', config.app_name);");
write("} catch (error) {");
write("    console.error('Config error:', error.message);");
write("}");
write("```");

write("\\n📖 **Processing Text Files:**");
write("```javascript");
write("try {");
write("    const text = ReadFile('data.txt');");
write("    const lines = text.split('\\n');");
write("    const nonEmptyLines = lines.filter(line => line.trim().length > 0);");
write("    console.log(`Found ${nonEmptyLines.length} non-empty lines`);");
write("} catch (error) {");
write("    console.error('Processing error:', error.message);");
write("}");
write("```");

write("\\n=== Function Features ===");
write("✅ Synchronous file reading (blocking operation)");
write("✅ Returns file content as string");
write("✅ Throws specific exceptions for different error cases");
write("✅ UTF-8 text file reading");
write("✅ Path validation and error handling");
write("✅ Immediate results (no promises or callbacks needed)");

write("\\n=== Error Handling ===");
write("The function throws these exceptions:");
write("• ArgumentException: Empty or null file paths");
write("• FileNotFoundException: File does not exist");
write("• DirectoryNotFoundException: Directory does not exist");
write("• UnauthorizedAccessException: Access denied (permissions)");
write("• IOException: IO errors during reading");
write("• Exception: General errors");

write("\\n⚠️  **Note**: This is a synchronous function that blocks until complete.");
write("   Use try-catch blocks to handle errors properly.");

write("\\n=== Test completed ===");