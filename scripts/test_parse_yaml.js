// Test script for parse_yaml function (updated for always-array API)

write("=== Testing parse_yaml function (Always Returns Array) ===");

// Test 1: Simple YAML object - now returns array with 1 element
const simpleYaml = `
name: John Doe
age: 30
city: New York
active: true
`;

try {
    const result1 = parse_yaml(simpleYaml);
    write("Test 1 - Simple YAML object:");
    write(`YAML: ${simpleYaml.trim()}`);
    write(`Result: Array with ${result1.length} document(s)`);
    write(`First document: ${JSON.stringify(result1[0], null, 2)}`);
    write("✓ Simple YAML test passed");
} catch (error) {
    write(`✗ Simple YAML test failed: ${error.message}`);
}

write("");

// Test 2: Nested YAML with arrays and objects
const complexYaml = `
application:
  name: MyApp
  version: 1.0.0
  database:
    host: localhost
    port: 5432
    name: myapp_db
  features:
    - authentication
    - logging
    - caching
  environment:
    development:
      debug: true
      log_level: debug
    production:
      debug: false
      log_level: info
`;

try {
    const result2 = parse_yaml(complexYaml);
    write("Test 2 - Complex nested YAML:");
    write(`Result: Array with ${result2.length} document(s)`);
    write(`Application name: ${result2[0].application.name}`);
    write(`Features count: ${result2[0].application.features.length}`);
    write("✓ Complex YAML test passed");
} catch (error) {
    write(`✗ Complex YAML test failed: ${error.message}`);
}

write("");

// Test 3: YAML with different data types
const typedYaml = `
string_value: "Hello World"
integer_value: 42
float_value: 3.14159
boolean_true: true
boolean_false: false
null_value: null
date_value: 2023-12-25
multiline_string: |
  This is a multiline
  string in YAML
  with preserved newlines
`;

try {
    const result3 = parse_yaml(typedYaml);
    write("Test 3 - Different data types:");
    write(`Result: Array with ${result3.length} document(s)`);
    write(`String: ${result3[0].string_value}`);
    write(`Integer: ${result3[0].integer_value}`);
    write(`Boolean: ${result3[0].boolean_true}`);
    write("✓ Data types test passed");
} catch (error) {
    write(`✗ Data types test failed: ${error.message}`);
}

write("");

// Test 4: YAML array at root level
const arrayYaml = `
- name: Alice
  age: 25
  role: developer
- name: Bob
  age: 30
  role: designer  
- name: Charlie
  age: 35
  role: manager
`;

try {
    const result4 = parse_yaml(arrayYaml);
    write("Test 4 - YAML array at root:");
    write(`Result: Array with ${result4.length} document(s)`);
    write(`First document is array: ${Array.isArray(result4[0])}`);
    write(`Array length: ${result4[0].length}`);
    write(`First person: ${result4[0][0].name}`);
    write("✓ Array YAML test passed");
} catch (error) {
    write(`✗ Array YAML test failed: ${error.message}`);
}

write("");

// Test 5: Order preservation test
const orderYaml = `
zebra: last
alpha: first
beta: second
gamma: third
omega: almost_last
`;

try {
    const result5 = parse_yaml(orderYaml);
    write("Test 5 - Order preservation:");
    write(`YAML keys in order: zebra, alpha, beta, gamma, omega`);
    const keys = Object.keys(result5[0]);
    write(`Parsed object keys: ${keys.join(', ')}`);

    // Check if keys maintain their original order
    const expectedOrder = ['zebra', 'alpha', 'beta', 'gamma', 'omega'];
    const orderPreserved = JSON.stringify(keys) === JSON.stringify(expectedOrder);

    write(`Order preserved: ${orderPreserved ? 'YES ✓' : 'NO ✗'}`);
} catch (error) {
    write(`✗ Order preservation test failed: ${error.message}`);
}

write("");

// Test 6: Multi-document YAML
const multiDocYaml = `
name: First Document
version: 1.0

---

name: Second Document
version: 2.0

---

name: Third Document
version: 3.0
`;

try {
    const result6 = parse_yaml(multiDocYaml);
    write("Test 6 - Multi-document YAML:");
    write(`Result: Array with ${result6.length} document(s)`);
    for (let i = 0; i < result6.length; i++) {
        write(`Document ${i + 1}: ${result6[i].name} v${result6[i].version}`);
    }
    write("✓ Multi-document test passed");
} catch (error) {
    write(`✗ Multi-document test failed: ${error.message}`);
}

write("");

// Test 7: Integration with render_template
const configYaml = `
app:
  title: My Application
  version: 2.1.0
  author:
    name: Jane Smith
    email: jane@example.com
  features:
    - dashboard
    - reports
    - analytics
`;

const template = `
Application: {{ app.title }} v{{ app.version }}
Author: {{ app.author.name }} ({{ app.author.email }})

Features:
{% for feature in app.features %}
- {{ feature }}
{% endfor %}
`;

try {
    const yamlData = parse_yaml(configYaml);
    // yamlData is now always an array, so use first element
    const rendered = render_template(template, yamlData[0]);

    write("Test 7 - Integration with render_template:");
    write(`Template rendered successfully:`);
    write(rendered);
    write("✓ Integration test passed");
} catch (error) {
    write(`✗ Integration test failed: ${error.message}`);
}

write("");
write("=== API Migration Notes ===");
write("✓ parse_yaml() now ALWAYS returns an array");
write("✓ Single documents: use result[0] to access the document");
write("✓ Multi-documents: iterate through result array");
write("✓ No more type checking needed: if (Array.isArray(result))");
write("✓ Order preservation maintained within each document");
write("✓ Integration with render_template: pass result[0] as data");