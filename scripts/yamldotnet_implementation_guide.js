// Enhanced Multi-Document YAML Implementation Example

write("=== Enhanced Multi-Document YAML Support Implementation ===");

write("\\nThis script shows how to add proper multi-document YAML support");
write("to the JintRunner by enhancing the BaseJavaScriptRunner.cs file.");

write("\\n🔧 **Step 1: Add Required Imports**");
write("```csharp");
write("using YamlDotNet.Core;");
write("using YamlDotNet.RepresentationModel;");
write("using System.IO;");
write("```");

write("\\n🔧 **Step 2: Add Multi-Document Parse Function**");
write("```csharp");
write("// Add this method to BaseJavaScriptRunner.cs");
write("private object[] ParseMultiDocumentYaml(string yamlContent)");
write("{");
write("    try");
write("    {");
write("        var documents = new List<object>();");
write("        var yamlStream = new YamlStream();");
write("        ");
write("        using (var reader = new StringReader(yamlContent))");
write("        {");
write("            yamlStream.Load(reader);");
write("        }");
write("        ");
write("        var deserializer = new DeserializerBuilder()");
write("            .WithNamingConvention(UnderscoredNamingConvention.Instance)");
write("            .IgnoreUnmatchedProperties()");
write("            .Build();");
write("        ");
write("        foreach (var document in yamlStream.Documents)");
write("        {");
write("            if (document.RootNode != null)");
write("            {");
write("                var obj = deserializer.Deserialize(document.RootNode);");
write("                var converted = ConvertYamlObjectToOrderedObject(obj);");
write("                documents.Add(converted ?? new Dictionary<string, object>());");
write("            }");
write("        }");
write("        ");
write("        return documents.ToArray();");
write("    }");
write("    catch (Exception ex)");
write("    {");
write("        throw new Exception($'Multi-document YAML parsing failed: {ex.Message}');");
write("    }");
write("}");
write("```");

write("\\n🔧 **Step 3: Register the Function in InitializeJsEngine()**");
write("```csharp");
write("// Add this to the InitializeJsEngine() method");
write("_jsEngine.SetValue('parse_yaml_multi', new Func<JsValue, object>((yamlArg) =>");
write("{");
write("    try");
write("    {");
write("        if (!yamlArg.IsString())");
write("        {");
write("            throw new ArgumentException('parse_yaml_multi: Argument must be a string');");
write("        }");
write("        ");
write("        var yamlString = yamlArg.AsString();");
write("        return ParseMultiDocumentYaml(yamlString);");
write("    }");
write("    catch (ArgumentException)");
write("    {");
write("        throw;");
write("    }");
write("    catch (Exception ex)");
write("    {");
write("        throw new Exception($'parse_yaml_multi: {ex.Message}');");
write("    }");
write("}));");
write("```");

write("\\n🔧 **Step 4: Enhanced Single Document Function (Optional)**");
write("```csharp");
write("// Enhanced version that auto-detects single vs multi-document");
write("private object ParseYamlAutoDetect(string yamlContent)");
write("{");
write("    // Check if content contains document separators");
write("    if (yamlContent.Contains('---'))");
write("    {");
write("        var docs = ParseMultiDocumentYaml(yamlContent);");
write("        // Return array for multi-document, single object for single document");
write("        return docs.Length == 1 ? docs[0] : docs;");
write("    }");
write("    else");
write("    {");
write("        // Use existing single-document parsing");
write("        return ParseYamlToObject(yamlContent);");
write("    }");
write("}");
write("```");

write("\\n📚 **Key YamlDotNet Classes for Multi-Document Support**");

write("\\n1. **YamlStream**");
write("   - Main class for handling YAML streams");
write("   - Can contain multiple documents");
write("   - Load(TextReader) method to parse content");
write("   - Documents property returns collection");

write("\\n2. **YamlDocument**");
write("   - Represents a single document in a YAML stream");
write("   - RootNode property contains the document content");
write("   - Can be null for empty documents");

write("\\n3. **YamlNode Hierarchy**");
write("   - YamlScalarNode: Single values (strings, numbers, booleans)");
write("   - YamlSequenceNode: Arrays/lists");
write("   - YamlMappingNode: Objects/dictionaries");

write("\\n4. **DeserializerBuilder**");
write("   - Same configuration as current implementation");
write("   - Can deserialize from YamlNode instead of string");
write("   - Deserialize(YamlNode) method");

write("\\n🚀 **Usage Examples After Implementation**");

write("\\n```javascript");
write("// Single document (existing function still works)");
write("const single = parse_yaml('name: test\\nversion: 1.0');");
write("console.log(single.name); // 'test'");
write("");
write("// Multi-document (new function)");
write("const multi = parse_yaml_multi(`");
write("name: doc1");
write("---");
write("name: doc2");
write("`);");
write("console.log(multi.length); // 2");
write("console.log(multi[0].name); // 'doc1'");
write("console.log(multi[1].name); // 'doc2'");
write("```");

write("\\n🔍 **Error Handling Improvements**");

write("\\nThe enhanced implementation provides better error handling:");
write("- Document-level error isolation");
write("- Detailed error messages with document index");
write("- Graceful handling of empty documents");
write("- Validation of YAML stream structure");

write("\\n```csharp");
write("// Example of enhanced error handling");
write("for (int i = 0; i < yamlStream.Documents.Count; i++)");
write("{");
write("    try");
write("    {");
write("        var document = yamlStream.Documents[i];");
write("        if (document.RootNode != null)");
write("        {");
write("            var obj = deserializer.Deserialize(document.RootNode);");
write("            documents.Add(ConvertYamlObjectToOrderedObject(obj));");
write("        }");
write("    }");
write("    catch (Exception ex)");
write("    {");
write("        throw new Exception($'Error parsing document {i + 1}: {ex.Message}');");
write("    }");
write("}");
write("```");

write("\\n⚡ **Performance Characteristics**");

write("\\n**Memory Usage:**");
write("- YamlStream loads all documents into memory");
write("- Good for small-medium files (< 10MB)");
write("- Consider streaming for larger files");

write("\\n**Parsing Speed:**");
write("- Single pass through YAML content");
write("- Faster than JavaScript splitting approach");
write("- Comparable to multiple single-document parses");

write("\\n**Scalability:**");
write("- Handles hundreds of documents efficiently");
write("- Memory usage scales linearly with content");
write("- CPU usage is mostly YAML parsing overhead");

write("\\n🎯 **Migration Strategy**");

write("\\n**Phase 1: Add Multi-Document Function**");
write("1. Add parse_yaml_multi() without changing existing code");
write("2. Test with existing multi-document scenarios");
write("3. Update documentation and examples");

write("\\n**Phase 2: Enhanced Single Function**");
write("1. Add auto-detection to parse_yaml()");
write("2. Maintain backward compatibility");
write("3. Provide migration guide");

write("\\n**Phase 3: Advanced Features (Optional)**");
write("1. Streaming API for large files");
write("2. Document metadata preservation");
write("3. Partial parsing and lazy loading");

write("\\n🔄 **Backward Compatibility**");

write("\\nThe implementation maintains full backward compatibility:");
write("- Existing parse_yaml() function unchanged");
write("- Same return types and error handling");
write("- New functionality as separate function");
write("- No breaking changes to existing scripts");

write("\\n✅ **Benefits of Native Multi-Document Support**");

write("\\n1. **Performance**: Faster than JavaScript splitting");
write("2. **Accuracy**: Proper YAML parsing semantics");
write("3. **Error Handling**: Better error messages and isolation");
write("4. **Standards Compliance**: Full YAML 1.2 support");
write("5. **Memory Efficiency**: Single parse pass");
write("6. **Type Preservation**: Consistent with single-document parsing");

write("\\n=== Implementation Summary ===");

write("\\nYamlDotNet provides excellent multi-document YAML support through");
write("the YamlStream class. The current single-document implementation");
write("can be enhanced to support multi-document scenarios while maintaining");
write("full backward compatibility and providing better performance than");
write("the current JavaScript-based workaround.");

write("\\nThe key is using YamlStream.Load() instead of Deserializer.Deserialize()");
write("for the initial parsing, then deserializing each document individually.");