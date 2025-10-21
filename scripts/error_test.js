// Quick test of ReadFile error behavior

write("=== read_file Error Test ===");

write("\\n✅ This will work:");
const content = read_file("scripts/hello.js");
write(`File content: "${content.trim()}"`);

write("\\n❌ This will throw an exception that can be caught by JS:");

try {
    const badContent = read_file("nonexistent-file.txt");
    write("This line should never be reached");
} catch (error) {
    write(`Caught error in JS: ${error.message}`);
}

write("\\n❌ This will throw an uncaught exception and terminate the script:");
const badContent = read_file("nonexistent-file.txt");
write("This line should never be reached");