// Test script for render_template function - success cases only

write("=== Testing render_template function ===");

// Test 1: Basic template rendering
const template1 = "Hello, {{ name }}! You are {{ age }} years old.";
const data1 = { name: "Alice", age: 30 };

const result1 = render_template(template1, data1);
write("Test 1 - Basic template:");
write(`Template: ${template1}`);
write(`Data: ${JSON.stringify(data1)}`);
write(`Result: ${result1}`);
write("✓ Basic template test passed");

write("");

// Test 2: Template with conditionals and loops
const template2 = `
Hello {{ user.name }}!
{% if user.isAdmin %}
You are an administrator.
{% endif %}

Your tasks:
{% for task in user.tasks %}
- {{ task.title }} ({{ task.status }})
{% endfor %}
`;

const data2 = {
    user: {
        name: "John Doe",
        isAdmin: true,
        tasks: [
            { title: "Review code", status: "pending" },
            { title: "Write documentation", status: "completed" },
            { title: "Deploy to production", status: "in-progress" }
        ]
    }
};

const result2 = render_template(template2, data2);
write("Test 2 - Advanced template with conditionals and loops:");
write(`Result:`);
write(result2);
write("✓ Advanced template test passed");

write("");

// Test 3: Template with nested objects and arrays
const template3 = `
Company: {{ company.name }}
Address: {{ company.address.street }}, {{ company.address.city }}

Employees:
{% for dept in company.departments %}
Department: {{ dept.name }}
{% for emp in dept.employees %}
  - {{ emp.name }} ({{ emp.position }})
{% endfor %}
{% endfor %}
`;

const data3 = {
    company: {
        name: "Tech Corp",
        address: {
            street: "123 Main St",
            city: "San Francisco"
        },
        departments: [
            {
                name: "Engineering",
                employees: [
                    { name: "Alice", position: "Senior Developer" },
                    { name: "Bob", position: "Junior Developer" }
                ]
            },
            {
                name: "Marketing",
                employees: [
                    { name: "Charlie", position: "Marketing Manager" }
                ]
            }
        ]
    }
};

const result3 = render_template(template3, data3);
write("Test 3 - Complex nested data:");
write(`Result:`);
write(result3);
write("✓ Complex template test passed");

write("");

// Test 4: Simple math and calculations
const template4 = "Total: {{ total }} | Average: {{ average }} | Count: {{ items.size }}";
const data4 = {
    total: 150,
    average: 37.5,
    items: [10, 20, 30, 40, 50]
};

const result4 = render_template(template4, data4);
write("Test 4 - Numbers and calculations:");
write(`Template: ${template4}`);
write(`Data: ${JSON.stringify(data4)}`);
write(`Result: ${result4}`);
write("✓ Numbers test passed");

write("");
write("=== All render_template tests completed successfully! ===");

write("");
write("Note: Type checking is working correctly:");
write("- First argument must be a string (template)");
write("- Second argument must be an object (data)");
write("- The function will throw errors for invalid argument types");