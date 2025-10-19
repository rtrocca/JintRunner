// Test simplified parse_yaml that always returns array

write("=== Testing Simplified parse_yaml (Always Returns Array) ===");

// Test 1: Single document - should return array with 1 element
write("\\n1. Single Document Test:");
const singleDoc = `
name: Single Document
version: 1.0.0
features:
  - feature1
  - feature2
`;

const result1 = parse_yaml(singleDoc);
write(`Result type: ${Array.isArray(result1) ? 'Array' : typeof result1}`);
write(`Number of documents: ${result1.length}`);
write(`First document name: ${result1[0].name}`);
write(`First document version: ${result1[0].version}`);
write(`Features: [${result1[0].features.join(', ')}]`);

// Test 2: Multi-document - should return array with multiple elements
write("\\n2. Multi-Document Test:");
const multiDoc = `
# Document 1
app: MyApp
version: 2.0.0

---

# Document 2  
database:
  host: localhost
  port: 5432

---

# Document 3
features:
  auth: true
  cache: false
`;

const result2 = parse_yaml(multiDoc);
write(`Result type: ${Array.isArray(result2) ? 'Array' : typeof result2}`);
write(`Number of documents: ${result2.length}`);

write("Document details:");
for (let i = 0; i < result2.length; i++) {
    const doc = result2[i];
    const keys = Object.keys(doc);
    write(`  Document ${i + 1}: ${keys.join(', ')}`);
}

write(`\\nApp name: ${result2[0].app}`);
write(`Database host: ${result2[1].database.host}`);
write(`Auth enabled: ${result2[2].features.auth}`);

// Test 3: Empty document - should return array with 1 empty object
write("\\n3. Empty Document Test:");
const emptyDoc = ``;

const result3 = parse_yaml(emptyDoc);
write(`Result type: ${Array.isArray(result3) ? 'Array' : typeof result3}`);
write(`Number of documents: ${result3.length}`);
write(`First document keys: ${Object.keys(result3[0]).length}`);

// Test 4: Real-world example - OpenAI conversation
write("\\n4. OpenAI Conversation Example:");
const conversation = `
# Conversation metadata
conversation_id: "chat-001"
model: "gpt-4"
created_at: "2025-10-19T10:30:00Z"

---

# System message
role: system
content: "You are a helpful assistant."

---

# User message
role: user  
content: "What is JavaScript?"

---

# Assistant response
role: assistant
content: "JavaScript is a programming language for web development."
`;

const result4 = parse_yaml(conversation);
write(`Conversation documents: ${result4.length}`);

// Extract conversation data
const metadata = result4[0];
const messages = result4.slice(1); // All documents except the first

write(`\\nConversation ID: ${metadata.conversation_id}`);
write(`Model: ${metadata.model}`);
write(`Messages: ${messages.length}`);

write("\\nMessage flow:");
for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    write(`  ${msg.role}: ${msg.content.substring(0, 50)}...`);
}

// Test 5: Helper function for common usage patterns
write("\\n5. Helper Functions Example:");

// Helper to get single document (for backward compatibility)
function getSingleDocument(yamlString) {
    const docs = parse_yaml(yamlString);
    return docs[0]; // Always get first document
}

// Helper to get all documents  
function getAllDocuments(yamlString) {
    return parse_yaml(yamlString); // Already returns array
}

// Helper to check if multi-document
function isMultiDocument(yamlString) {
    const docs = parse_yaml(yamlString);
    return docs.length > 1;
}

const testYaml = `name: Test\n---\nother: Value`;
const single = getSingleDocument(singleDoc);
const all = getAllDocuments(testYaml);
const isMulti = isMultiDocument(testYaml);

write(`Single doc access: ${single.name}`);
write(`All docs count: ${all.length}`);
write(`Is multi-document: ${isMulti}`);

// Test 6: Integration with render_template
write("\\n6. Template Integration:");
const templateYaml = `
# Template data
user:
  name: "Alice"
  role: "developer"

---

# Template definition
template: |
  Hello {{ user.name }}!
  You are a {{ user.role }}.
  Welcome to the system.
`;

const templateResult = parse_yaml(templateYaml);
const templateData = templateResult[0]; // First document has data
const templateDef = templateResult[1];   // Second document has template

const rendered = render_template(templateDef.template, templateData);
write("Rendered template:");
write(rendered);

write("\\n=== Usage Patterns ===");
write("\\n1. **Single Document Access**:");
write("   const docs = parse_yaml(yaml);");
write("   const data = docs[0]; // Always first element");

write("\\n2. **Multi-Document Processing**:");
write("   const docs = parse_yaml(yaml);");
write("   docs.forEach((doc, index) => {");
write("     console.log(`Document ${index + 1}:`, doc);");
write("   });");

write("\\n3. **Conditional Processing**:");
write("   const docs = parse_yaml(yaml);");
write("   if (docs.length === 1) {");
write("     // Single document");
write("   } else {");
write("     // Multi-document");
write("   }");

write("\\n4. **Destructuring (Known Structure)**:");
write("   const [metadata, ...messages] = parse_yaml(conversationYaml);");

write("\\n=== Benefits of Always-Array API ===");
write("✓ Consistent return type (always array)");
write("✓ Simpler logic - no type checking needed");
write("✓ Easy to iterate over documents");
write("✓ Supports both single and multi-document scenarios");
write("✓ Forward compatible - can always add more documents");
write("✓ Natural destructuring patterns");

write("\\n=== Migration from Previous API ===");
write("// Before (inconsistent return types):");
write("// const result = parse_yaml(yaml);");
write("// if (Array.isArray(result)) { ... } else { ... }");
write("//");
write("// After (always array):");
write("// const docs = parse_yaml(yaml);");
write("// const firstDoc = docs[0];");
write("// docs.forEach(doc => { ... });");