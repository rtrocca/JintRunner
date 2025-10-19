// YamlDotNet Multi-Document YAML Handling Demo

write("=== YamlDotNet Multi-Document YAML Handling Demo ===");

// The current parse_yaml function only handles single documents
// Let's demonstrate this and show how to work around it

const singleDocumentYaml = `
name: Single Document
version: 1.0.0
features:
  - feature1
  - feature2
`;

const multiDocumentYaml = `
# Document 1: Configuration
name: Multi-Doc Example
version: 2.0.0

---

# Document 2: Database Settings
database:
  host: localhost
  port: 5432
  name: myapp

---

# Document 3: Feature Flags
features:
  - authentication: true
  - logging: false
  - caching: true
`;

write("\\n1. Testing Single Document Parsing:");
write("✓ This works with the current parse_yaml function");

try {
    const singleResult = parse_yaml(singleDocumentYaml);
    write("Single document parsed successfully:");
    write(JSON.stringify(singleResult, null, 2));
} catch (error) {
    write(`✗ Error: ${error.message}`);
}

write("\\n2. Testing Multi-Document YAML with current parse_yaml:");
write("✗ This will fail because parse_yaml only handles single documents");

try {
    const multiResult = parse_yaml(multiDocumentYaml);
    write("Multi-document parsed (unexpected):");
    write(JSON.stringify(multiResult, null, 2));
} catch (error) {
    write(`✗ Expected error: ${error.message}`);
    write("This error occurs because YamlDotNet's single-document deserializer");
    write("encounters a second document separator (---) and doesn't know what to do with it.");
}

write("\\n3. Manual Multi-Document Processing:");
write("✓ Splitting by '---' and parsing each document individually");

function parseMultiDocumentYaml(yamlContent) {
    try {
        // Split by YAML document separator
        const documents = yamlContent.split(/^---$/m);
        const parsedDocs = [];

        for (let i = 0; i < documents.length; i++) {
            const doc = documents[i].trim();
            if (doc.length > 0) {
                try {
                    const parsed = parse_yaml(doc);
                    parsedDocs.push({
                        index: i,
                        content: parsed
                    });
                    write(`  Document ${i + 1}: ✓ Parsed successfully`);
                } catch (docError) {
                    write(`  Document ${i + 1}: ✗ Parse error: ${docError.message}`);
                }
            }
        }

        return parsedDocs;
    } catch (error) {
        write(`Multi-document parsing error: ${error.message}`);
        return [];
    }
}

const multiDocResults = parseMultiDocumentYaml(multiDocumentYaml);
write(`\\nParsed ${multiDocResults.length} documents:`);

for (let i = 0; i < multiDocResults.length; i++) {
    const doc = multiDocResults[i];
    write(`\\nDocument ${doc.index + 1}:`);
    write(JSON.stringify(doc.content, null, 2));
}

write("\\n\\n=== YamlDotNet Library Capabilities ===");

write("\\n📚 YamlDotNet Multi-Document Support:");
write("\\n1. **Single Document Mode** (Current Implementation):");
write("   - Uses Deserializer.Deserialize<T>(yamlString)");
write("   - Parses only the first document");
write("   - Simple and fast for single documents");
write("   - Order preservation through Dictionary<string, object>");

write("\\n2. **Stream-Based Multi-Document Mode** (Not Implemented):");
write("   - Uses YamlStream and YamlDocument classes");
write("   - Can parse multiple documents in sequence");
write("   - More complex but handles full YAML specification");

write("\\n3. **Manual Splitting Approach** (Demonstrated Above):");
write("   - Split YAML content by '---' separators");
write("   - Parse each document individually with parse_yaml()");
write("   - Works well for most use cases");
write("   - Preserves order within each document");

write("\\n\\n=== YamlDotNet Multi-Document Processing Options ===");

write("**Option 1: Enhanced parse_yaml function**");
write("```csharp");
write("// Could add to BaseJavaScriptRunner.cs");
write("_jsEngine.SetValue('parse_yaml_multi', new Func<JsValue, object[]>((yamlArg) => {");
write("    var yamlString = yamlArg.AsString();");
write("    var yamlStream = new YamlStream();");
write("    yamlStream.Load(new StringReader(yamlString));");
write("    ");
write("    var documents = new List<object>();");
write("    foreach (var document in yamlStream.Documents) {");
write("        var deserializer = new DeserializerBuilder().Build();");
write("        var obj = deserializer.Deserialize(document.RootNode);");
write("        documents.Add(ConvertYamlObjectToOrderedObject(obj));");
write("    }");
write("    return documents.ToArray();");
write("}));");
write("```");

write("\\n**Option 2: JavaScript-based splitting (Current Approach)**");
write("```javascript");
write("function parseMultiDocYaml(yamlContent) {");
write("    const docs = yamlContent.split(/^---$/m);");
write("    return docs");
write("        .map(doc => doc.trim())");
write("        .filter(doc => doc.length > 0)");
write("        .map(doc => parse_yaml(doc));");
write("}");
write("```");

write("\\n**Option 3: Streaming approach for large files**");
write("```csharp");
write("// For very large YAML files with many documents");
write("public IEnumerable<object> ParseYamlDocuments(string yamlContent) {");
write("    using var reader = new StringReader(yamlContent);");
write("    var yamlStream = new YamlStream();");
write("    yamlStream.Load(reader);");
write("    ");
write("    foreach (var document in yamlStream.Documents) {");
write("        yield return ConvertYamlDocument(document);");
write("    }");
write("}");
write("```");

write("\\n\\n=== Real-World Multi-Document Patterns ===");

// Example: Configuration with multiple environments
const configExample = `
# Production Environment
environment: production
debug: false
log_level: error
database:
  host: prod-db.example.com
  port: 5432
  name: myapp_prod

---

# Development Environment  
environment: development
debug: true
log_level: debug
database:
  host: localhost
  port: 5432
  name: myapp_dev

---

# Testing Environment
environment: testing
debug: true
log_level: info
database:
  host: test-db.example.com
  port: 5432
  name: myapp_test
`;

write("\\n4. Real-World Example - Multiple Environments:");
const envConfigs = parseMultiDocumentYaml(configExample);
write(`Parsed ${envConfigs.length} environment configurations:`);

for (let i = 0; i < envConfigs.length; i++) {
    const config = envConfigs[i];
    write(`\\n${config.content.environment.toUpperCase()} Environment:`);
    write(`  Debug: ${config.content.debug}`);
    write(`  Database: ${config.content.database.host}:${config.content.database.port}`);
    write(`  Log Level: ${config.content.log_level}`);
}

write("\\n\\n=== Summary: YamlDotNet Multi-Document Handling ===");

write("\\n🔍 **Current Implementation**:");
write("   ✓ Single documents work perfectly");
write("   ✓ Order preservation within documents");
write("   ✓ Type preservation (strings, numbers, booleans)");
write("   ✗ No built-in multi-document support");

write("\\n🛠️ **Workaround Solutions**:");
write("   ✓ Manual splitting by '---' separators");
write("   ✓ Individual parsing with existing parse_yaml()");
write("   ✓ Works for most real-world scenarios");
write("   ✓ Maintains order within each document");

write("\\n🚀 **Enhancement Opportunities**:");
write("   • Add parse_yaml_multi() function using YamlStream");
write("   • Streaming support for large multi-document files");
write("   • Better error handling for malformed documents");
write("   • Document metadata preservation (comments, line numbers)");

write("\\n💡 **Best Practices**:");
write("   1. Use single documents when possible for simplicity");
write("   2. Use multi-document for logically grouped but distinct data");
write("   3. Consider separate files vs. multi-document for large datasets");
write("   4. Always validate each document individually");
write("   5. Handle parsing errors gracefully");

write("\\n📖 **YamlDotNet Features Used**:");
write("   • DeserializerBuilder for configuration");
write("   • UnderscoredNamingConvention for property names");
write("   • IgnoreUnmatchedProperties for flexibility");
write("   • Dictionary<object, object> for order preservation");
write("   • Type conversion to JavaScript-friendly objects");

write("\\n=== Demo completed! ===");