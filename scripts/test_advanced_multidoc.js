// Advanced multi-document YAML examples for real-world scenarios

write("=== Real-World Multi-Document YAML Examples ===");

// Example 1: Complete OpenAI conversation as multi-document
const openaiConversation = `
# Conversation Metadata
conversation_id: "programming-tutorial-001"
model: "gpt-4"
temperature: 0.7
max_tokens: 2000
created_at: "2025-10-19T15:30:00Z"
tags: ["programming", "javascript", "tutorial"]

---

# System Instructions
role: system
content: |
  You are an expert JavaScript instructor. Your teaching style is:
  - Clear and beginner-friendly explanations
  - Always provide practical examples
  - Encourage best practices
  - Break complex topics into digestible steps

---

# User Question 1
role: user
content: "I'm new to JavaScript. Can you explain what variables are and how to use them?"
timestamp: "2025-10-19T15:30:15Z"

---

# Assistant Response 1
role: assistant
content: |
  Great question! Variables in JavaScript are like labeled boxes that store data.

  **Three ways to declare variables:**

  1. **let** - for values that can change:
  \`\`\`javascript
  let userName = "Alice";
  let age = 25;
  userName = "Bob"; // Can be reassigned
  \`\`\`

  2. **const** - for values that won't change:
  \`\`\`javascript
  const PI = 3.14159;
  const appName = "MyApp";
  // PI = 3.14; // This would cause an error!
  \`\`\`

  3. **var** - older syntax (avoid in modern code):
  \`\`\`javascript
  var oldStyle = "legacy";
  \`\`\`

  **Best practice:** Use \`const\` by default, \`let\` when you need to reassign.
timestamp: "2025-10-19T15:30:45Z"
tokens_used: 145

---

# User Question 2  
role: user
content: "That's helpful! Can you show me how to work with arrays?"
timestamp: "2025-10-19T15:31:15Z"

---

# Assistant Response 2
role: assistant
content: |
  Absolutely! Arrays are ordered lists of items in JavaScript.

  **Creating arrays:**
  \`\`\`javascript
  const fruits = ["apple", "banana", "orange"];
  const numbers = [1, 2, 3, 4, 5];
  const mixed = ["text", 42, true, null];
  \`\`\`

  **Accessing items:**
  \`\`\`javascript
  console.log(fruits[0]); // "apple" (first item)
  console.log(fruits[2]); // "orange" (third item)
  console.log(fruits.length); // 3 (number of items)
  \`\`\`

  **Common array methods:**
  \`\`\`javascript
  // Add items
  fruits.push("grape");        // Add to end
  fruits.unshift("strawberry"); // Add to beginning

  // Remove items
  fruits.pop();     // Remove last item
  fruits.shift();   // Remove first item

  // Find items
  const index = fruits.indexOf("banana"); // Find position
  const exists = fruits.includes("apple"); // Check if exists
  \`\`\`

  Try these examples in your browser's console!
timestamp: "2025-10-19T15:32:00Z"
tokens_used: 198
`;

// Example 2: Kubernetes-style configuration
const kubernetesStyle = `
# Deployment Configuration
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: nginx:1.21
        ports:
        - containerPort: 80

---

# Service Configuration
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
spec:
  selector:
    app: web-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer

---

# ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: web-app-config
data:
  app.properties: |
    server.port=8080
    database.url=jdbc:postgresql://db:5432/myapp
    logging.level=INFO
  nginx.conf: |
    server {
        listen 80;
        location / {
            proxy_pass http://app:8080;
        }
    }
`;

// Example 3: Build pipeline configuration
const buildPipeline = `
# Pipeline Metadata
name: "web-app-ci-cd"
version: "1.0"
trigger:
  branches: ["main", "develop"]
  paths: ["src/*", "package.json"]

---

# Build Stage
stage: build
name: "Build Application"
runs-on: ubuntu-latest
steps:
  - name: "Checkout Code"
    action: checkout
  
  - name: "Setup Node.js"
    action: setup-node
    version: "18.x"
  
  - name: "Install Dependencies"
    run: "npm ci"
  
  - name: "Build Application"
    run: "npm run build"
  
  - name: "Run Tests"
    run: "npm test"

---

# Deploy Stage
stage: deploy
name: "Deploy to Production"
depends-on: ["build"]
environment: production
steps:
  - name: "Deploy to Server"
    action: deploy
    target: "production-server"
    
  - name: "Health Check"
    run: "curl -f https://myapp.com/health"
    
  - name: "Notify Team"
    action: slack
    message: "🚀 Deployment successful!"
`;

// Function to demonstrate parsing multi-document YAML
function demonstrateMultiDocParsing(yamlContent, title) {
    write(`\\n=== ${title} ===`);

    try {
        // Split documents by --- separator
        const documents = yamlContent.split(/^---$/m);
        const parsedDocs = [];

        for (let i = 0; i < documents.length; i++) {
            const doc = documents[i].trim();
            if (doc.length > 0) {
                const parsed = parse_yaml(doc);
                parsedDocs.push(parsed);
                write(`\\nDocument ${i + 1}:`);
                write(JSON.stringify(parsed, null, 2));
            }
        }

        write(`\\n✓ Successfully parsed ${parsedDocs.length} documents`);
        return parsedDocs;

    } catch (error) {
        write(`✗ Error parsing: ${error.message}`);
        return null;
    }
}

// Test the examples
demonstrateMultiDocParsing(openaiConversation, "OpenAI Conversation");

write("\\n" + "=".repeat(60));
write("\\n=== Multi-Document YAML Benefits ===");
write("\\n1. **Separation of Concerns**: Each document handles one aspect");
write("2. **Logical Grouping**: Related but distinct configurations");
write("3. **Version Control**: Easy to see changes per document");
write("4. **Processing**: Can handle documents independently");
write("5. **Streaming**: Can process large files document by document");

write("\\n=== Common Use Cases ===");
write("\\n📝 **Configuration Files**:");
write("   - Database config, app config, logging config");
write("\\n🤖 **AI Conversations**:");
write("   - Metadata, system prompt, individual messages");
write("\\n☸️ **Kubernetes Manifests**:");
write("   - Deployments, services, configmaps in one file");
write("\\n🔧 **CI/CD Pipelines**:");
write("   - Pipeline config, build stages, deploy stages");
write("\\n📊 **Data Processing**:");
write("   - Schema definition, sample data, transformation rules");

write("\\n=== Processing Pattern ===");
write("\\n```javascript");
write("function processMultiDocYaml(yamlContent) {");
write("  const docs = yamlContent.split(/^---$/m);");
write("  const results = [];");
write("  ");
write("  for (const doc of docs) {");
write("    const trimmed = doc.trim();");
write("    if (trimmed) {");
write("      const parsed = parse_yaml(trimmed);");
write("      results.push(parsed);");
write("    }");
write("  }");
write("  ");
write("  return results;");
write("}");
write("```");