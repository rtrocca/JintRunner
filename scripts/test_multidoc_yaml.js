// Test script demonstrating multi-document YAML

write("=== Multi-Document YAML Examples ===");

// Example 1: Simple multi-document YAML
const multiDocSimple = `
# Document 1: Configuration
app_name: "MyApp"
version: "1.0.0"
environment: "production"

---

# Document 2: Database Settings
database:
  host: "localhost"
  port: 5432
  name: "myapp_db"
  ssl: true

---

# Document 3: Features List
features:
  - authentication
  - logging
  - caching
  - monitoring
`;

// Example 2: OpenAI Conversation as multi-document
const conversationMultiDoc = `
# Conversation Metadata
conversation_id: "conv-12345"
model: "gpt-4"
temperature: 0.7
created_at: "2025-10-19T10:30:00Z"

---

# System Message
role: system
content: |
  You are a helpful programming assistant. 
  Provide clear, concise answers with code examples when appropriate.
timestamp: "2025-10-19T10:30:00Z"

---

# User Message 1
role: user
content: "How do I create a simple HTTP server in Node.js?"
timestamp: "2025-10-19T10:30:15Z"

---

# Assistant Response 1
role: assistant
content: |
  Here's how to create a simple HTTP server in Node.js:

  \`\`\`javascript
  const http = require('http');

  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World!');
  });

  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(\`Server running at http://localhost:\${PORT}/\`);
  });
  \`\`\`

  This creates a basic server that responds with "Hello World!" to all requests.
timestamp: "2025-10-19T10:30:45Z"

---

# User Message 2
role: user
content: "How do I add routing to this server?"
timestamp: "2025-10-19T10:31:00Z"

---

# Assistant Response 2
role: assistant
content: |
  You can add basic routing by checking the request URL:

  \`\`\`javascript
  const http = require('http');
  const url = require('url');

  const server = http.createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    switch(pathname) {
      case '/':
        res.end(JSON.stringify({ message: 'Welcome to the API!' }));
        break;
      case '/users':
        res.end(JSON.stringify({ users: ['Alice', 'Bob', 'Charlie'] }));
        break;
      case '/about':
        res.end(JSON.stringify({ app: 'My Node.js Server', version: '1.0.0' }));
        break;
      default:
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
  });
  \`\`\`

  For more complex routing, consider using Express.js framework.
timestamp: "2025-10-19T10:31:30Z"
`;

// Example 3: Configuration with different environments
const environmentConfigs = `
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

---

# Production Environment
environment: production
debug: false
log_level: error
database:
  host: prod-db.example.com
  port: 5432
  name: myapp_prod
redis:
  host: prod-redis.example.com
  port: 6379
`;

// Note: parse_yaml typically handles single documents
// For multi-document YAML, we'd need to split by "---" first
write("Note: Standard YAML parsers usually process single documents.");
write("Multi-document YAML needs special handling to split documents first.");
write("");

// Let's test parsing individual documents
try {
    write("1. Testing first document from multi-doc YAML:");

    // Split the multi-document YAML and parse the first document
    const documents = multiDocSimple.split(/^---$/m);
    const firstDoc = documents[0].trim();

    write("First document content:");
    write(firstDoc);
    write("");

    const parsed = parse_yaml(firstDoc);
    write("Parsed result:");
    write(JSON.stringify(parsed, null, 2));

    write("");
    write("✓ Single document parsing successful!");

} catch (error) {
    write(`✗ Error: ${error.message}`);
}

write("");
write("=== Multi-Document YAML Structure Examples ===");

write("");
write("**Example 1: Simple Multi-Document**");
write("```yaml");
write("# Document 1");
write("name: MyApp");
write("version: 1.0.0");
write("");
write("---");
write("");
write("# Document 2");
write("database:");
write("  host: localhost");
write("  port: 5432");
write("```");

write("");
write("**Example 2: Conversation Messages**");
write("```yaml");
write("# Message 1");
write("role: user");
write("content: 'Hello!'");
write("");
write("---");
write("");
write("# Message 2");
write("role: assistant");
write("content: 'Hi there! How can I help?'");
write("```");

write("");
write("**Example 3: Configuration Environments**");
write("```yaml");
write("# Development");
write("env: dev");
write("debug: true");
write("");
write("---");
write("");
write("# Production");
write("env: prod");
write("debug: false");
write("```");

write("");
write("=== Processing Multi-Document YAML ===");
write("To handle multi-document YAML, you would:");
write("1. Split the content by '---' separators");
write("2. Parse each document individually with parse_yaml()");
write("3. Combine results as needed");

write("");
write("Example JavaScript code:");
write("```javascript");
write("function parseMultiDocumentYaml(yamlContent) {");
write("  const documents = yamlContent.split(/^---$/m);");
write("  return documents");
write("    .map(doc => doc.trim())");
write("    .filter(doc => doc.length > 0)");
write("    .map(doc => parse_yaml(doc));");
write("}");
write("```");