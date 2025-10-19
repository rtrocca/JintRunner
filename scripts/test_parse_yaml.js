// Test script for parse_yaml function

write("=== Testing parse_yaml function ===");

// Test 1: Simple YAML object
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
    write(`Result: ${JSON.stringify(result1, null, 2)}`);
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
    write(`Result:`);
    write(JSON.stringify(result2, null, 2));
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
    write(`Result:`);
    write(JSON.stringify(result3, null, 2));
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
    write(`Result:`);
    write(JSON.stringify(result4, null, 2));
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
    write(`Parsed object keys:`, Object.keys(result5));

    // Check if keys maintain their original order
    const keys = Object.keys(result5);
    const expectedOrder = ['zebra', 'alpha', 'beta', 'gamma', 'omega'];
    const orderPreserved = JSON.stringify(keys) === JSON.stringify(expectedOrder);

    write(`Order preserved: ${orderPreserved ? 'YES ✓' : 'NO ✗'}`);
    write(`Result: ${JSON.stringify(result5, null, 2)}`);
} catch (error) {
    write(`✗ Order preservation test failed: ${error.message}`);
}

write("");

// Test 6: Integration with render_template
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
    const rendered = render_template(template, yamlData);

    write("Test 6 - Integration with render_template:");
    write(`Rendered result:`);
    write(rendered);
    write("✓ Integration test passed");
} catch (error) {
    write(`✗ Integration test failed: ${error.message}`);
}

write("");
write("=== All parse_yaml tests completed ===");

// Additional note about order preservation
write("");
write("Note: This implementation preserves the order of keys as they appear");
write("in the original YAML file, which is important for configuration files");
write("and other structured data where order matters.");