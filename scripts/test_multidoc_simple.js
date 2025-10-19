// Simple test for simplified multi-document YAML support (always returns array)

write("=== Simplified Multi-Document YAML Test ===");

// Test 1: Single document (should return array with 1 element)
const single = parse_yaml("name: test\nvalue: 123");
write(`\\n1. Single document: Array with ${single.length} element(s)`);
write(`   First document: ${single[0].name} = ${single[0].value}`);

// Test 2: Multi-document (should return array with multiple elements)
const multi = parse_yaml(`
doc1: value1
---
doc2: value2
---  
doc3: value3
`);

write(`\\n2. Multi-document: Array with ${multi.length} element(s)`);
for (let i = 0; i < multi.length; i++) {
    const keys = Object.keys(multi[i]);
    write(`   Doc ${i + 1}: ${keys[0]} = ${multi[i][keys[0]]}`);
}

// Test 3: Previous test case that failed before
const previouslyFailing = `
name: Document 1
version: 1.0
---
name: Document 2  
version: 2.0
`;

try {
    const result = parse_yaml(previouslyFailing);
    write(`\\n3. Previously failing case: ✓ Success`);
    write(`   Array with ${result.length} document(s)`);
    write(`   ${result[0].name} v${result[0].version}`);
    write(`   ${result[1].name} v${result[1].version}`);
} catch (error) {
    write(`\\n3. Previously failing case: ✗ ${error.message}`);
}

write("\\n=== API Simplification Benefits ===");
write("✓ Consistent return type: always array");
write("✓ No type checking needed: if (Array.isArray(result))");
write("✓ Simple access: docs[0] for first document");
write("✓ Easy iteration: docs.forEach()");
write("✓ Natural destructuring: [first, ...rest] = parse_yaml()");

write("\\n=== Usage Examples ===");
write("// Single document access:");
write("const docs = parse_yaml(yaml);");
write("const data = docs[0];");
write("");
write("// Multi-document iteration:");
write("const docs = parse_yaml(yaml);");
write("docs.forEach((doc, i) => console.log(`Doc ${i}:`, doc));");
write("");
write("// Destructuring for known structure:");
write("const [metadata, ...messages] = parse_yaml(conversationYaml);");