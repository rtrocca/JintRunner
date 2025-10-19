// YamlDotNet Multi-Document YAML Analysis

write("=== How YamlDotNet Handles Multi-Document YAML ===");

write("\\n1. **Single Document Mode (Current Implementation)**");
write("   - Uses Deserializer.Deserialize<object>(yamlString)");
write("   - Can only parse the FIRST document in a multi-document YAML");
write("   - Throws error when it encounters '---' document separator");
write("   - Error: 'Expected StreamEnd, got DocumentStart'");

write("\\n2. **The Error Explained**");
write("   YamlDotNet's single-document deserializer expects:");
write("   - YAML content");
write("   - End of stream");
write("   ");
write("   When it encounters '---' after the first document:");
write("   - It has finished parsing the first document");
write("   - It expects the stream to end");
write("   - But instead finds another document starting (DocumentStart)");
write("   - This causes the 'Expected StreamEnd, got DocumentStart' error");

write("\\n3. **YamlDotNet Multi-Document Capabilities**");
write("   YamlDotNet DOES support multi-document YAML, but requires:");
write("   - YamlStream class instead of Deserializer");
write("   - Iterating through Documents collection");
write("   - Deserializing each document individually");

write("\\n4. **Code Example for True Multi-Document Support**");
write("   ```csharp");
write("   // This is what would be needed in BaseJavaScriptRunner.cs");
write("   public object[] ParseMultiDocumentYaml(string yamlContent) {");
write("       var yamlStream = new YamlStream();");
write("       yamlStream.Load(new StringReader(yamlContent));");
write("       ");
write("       var documents = new List<object>();");
write("       var deserializer = new DeserializerBuilder().Build();");
write("       ");
write("       foreach (var document in yamlStream.Documents) {");
write("           var obj = deserializer.Deserialize(document.RootNode);");
write("           documents.Add(ConvertYamlObjectToOrderedObject(obj));");
write("       }");
write("       ");
write("       return documents.ToArray();");
write("   }");
write("   ```");

write("\\n5. **Current Workaround (JavaScript-based)**");
write("   Since we can't modify the C# code right now, we use:");
write("   - String.split() to separate documents by '---'");
write("   - parse_yaml() on each individual document");
write("   - Manual combining of results");

// Demonstrate the workaround
const multiDocYaml = `name: Document 1
version: 1.0
---
name: Document 2  
version: 2.0
---
name: Document 3
version: 3.0`;

write("\\n6. **JavaScript Workaround Demonstration**");

function parseMultiDoc(yamlContent) {
    const docs = yamlContent.split(/^---$/m);
    const results = [];

    for (let i = 0; i < docs.length; i++) {
        const doc = docs[i].trim();
        if (doc.length > 0) {
            try {
                const parsed = parse_yaml(doc);
                results.push(parsed);
                write(`   Document ${i + 1}: ${parsed.name} v${parsed.version}`);
            } catch (error) {
                write(`   Document ${i + 1}: Error - ${error.message}`);
            }
        }
    }
    return results;
}

const results = parseMultiDoc(multiDocYaml);
write(`\\n   ✓ Successfully parsed ${results.length} documents using workaround`);

write("\\n7. **YamlDotNet Library Architecture**");
write("   YamlDotNet has different classes for different use cases:");
write("   ");
write("   **Deserializer** (what we currently use):");
write("   - Simple, single-document parsing");
write("   - Deserialize<T>(string) or Deserialize<T>(TextReader)");
write("   - Fast and straightforward");
write("   - Cannot handle multiple documents");
write("   ");
write("   **YamlStream** (for multi-document):");
write("   - Handles complete YAML streams");
write("   - Can contain multiple documents");
write("   - Provides Documents collection");
write("   - More complex but more capable");
write("   ");
write("   **Parser** (low-level):");
write("   - Event-based parsing");
write("   - Most flexible but most complex");
write("   - Handles streaming scenarios");

write("\\n8. **Multi-Document YAML Use Cases**");
write("   - **Configuration Files**: Different environments in one file");
write("   - **Kubernetes Manifests**: Multiple resources (Deployment, Service, ConfigMap)");
write("   - **CI/CD Pipelines**: Multiple stages or jobs");
write("   - **Data Sets**: Related but distinct data collections");
write("   - **AI Conversations**: Metadata + messages");

write("\\n9. **Performance Considerations**");
write("   **Single Document (current):**");
write("   ✓ Fast parsing");
write("   ✓ Low memory usage");
write("   ✓ Simple error handling");
write("   ");
write("   **Multi-Document (YamlStream):**");
write("   - Slightly slower parsing");
write("   - Higher memory usage (loads all documents)");
write("   - More complex error handling");
write("   ");
write("   **JavaScript Split (workaround):**");
write("   - Multiple parse operations");
write("   - Good for small-medium files");
write("   - Simple error isolation");

write("\\n10. **Recommendations**");
write("    For your current implementation:");
write("    ✓ Use single documents when possible");
write("    ✓ Use JavaScript split workaround for multi-document");
write("    ✓ Consider separate files for large datasets");
write("    ");
write("    For future enhancements:");
write("    • Add parse_yaml_multi() function using YamlStream");
write("    • Consider streaming API for very large files");
write("    • Add document validation and error recovery");

write("\\n=== Summary ===");
write("YamlDotNet supports multi-document YAML, but the current");
write("implementation uses the single-document Deserializer class.");
write("The JavaScript workaround effectively handles most real-world");
write("multi-document scenarios by splitting and parsing individually.");