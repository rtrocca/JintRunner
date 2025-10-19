// Test script demonstrating different YAML conversation formats

write("=== OpenAI Conversation YAML Formats ===");

// Format 1: Direct OpenAI API format
const openaiFormat = `
conversation:
  - role: system
    content: "You are a helpful assistant."
  
  - role: user
    content: "What is JavaScript?"
  
  - role: assistant
    content: "JavaScript is a programming language primarily used for web development."
  
  - role: user
    content: "How do I create a function?"
  
  - role: assistant
    content: |
      You can create a JavaScript function in several ways:
      
      1. Function declaration:
      function myFunction() {
        return "Hello World";
      }
      
      2. Function expression:
      const myFunction = function() {
        return "Hello World";
      };
      
      3. Arrow function:
      const myFunction = () => "Hello World";
`;

// Format 2: Conversation with metadata
const conversationWithMeta = `
conversation:
  metadata:
    model: "gpt-4"
    temperature: 0.7
    created_at: "2025-10-17T10:30:00Z"
    conversation_id: "conv-js-tutorial"
  
  system_prompt: "You are a JavaScript tutor. Provide clear, beginner-friendly explanations."
  
  messages:
    - turn: 1
      role: user
      content: "What are variables in JavaScript?"
      timestamp: "2025-10-17T10:30:15Z"
    
    - turn: 2
      role: assistant
      content: "Variables in JavaScript are containers that store data values. You can create them using 'let', 'const', or 'var' keywords."
      timestamp: "2025-10-17T10:30:45Z"
`;

// Format 3: Grouped conversations
const groupedFormat = `
tutorial:
  topic: "JavaScript Basics"
  difficulty: "beginner"
  
  system_message: "You are a patient JavaScript instructor."
  
  qa_pairs:
    - question: "What is a variable?"
      answer: "A variable is a named storage location for data."
    
    - question: "How do I declare a variable?"
      answer: |
        You can declare variables in JavaScript using:
        - let: for block-scoped variables
        - const: for constants
        - var: for function-scoped variables (legacy)
    
    - question: "What's the difference between let and const?"
      answer: "let allows reassignment, const doesn't. Both are block-scoped."
`;

try {
    write("\\n1. Testing OpenAI API Format:");
    const format1 = parse_yaml(openaiFormat);
    write(`Messages count: ${format1.conversation.length}`);
    write(`First message role: ${format1.conversation[0].role}`);
    write(`System message: ${format1.conversation[0].content}`);

    write("\\n2. Testing Conversation with Metadata:");
    const format2 = parse_yaml(conversationWithMeta);
    write(`Model: ${format2.conversation.metadata.model}`);
    write(`Conversation ID: ${format2.conversation.metadata.conversation_id}`);
    write(`Messages count: ${format2.conversation.messages.length}`);

    write("\\n3. Testing Grouped Format:");
    const format3 = parse_yaml(groupedFormat);
    write(`Tutorial topic: ${format3.tutorial.topic}`);
    write(`Q&A pairs: ${format3.tutorial.qa_pairs.length}`);

    write("\\n✓ All conversation formats parsed successfully!");

} catch (error) {
    write(`✗ Error parsing YAML: ${error.message}`);
}

write("\\n=== Rendering Conversation Example ===");

// Template for rendering conversations
const conversationTemplate = `
{{#if conversation.metadata}}
Conversation: {{ conversation.metadata.conversation_id }}
Model: {{ conversation.metadata.model }}
Temperature: {{ conversation.metadata.temperature }}

{{/if}}
{{#if conversation.system_prompt}}
System: {{ conversation.system_prompt }}

{{/if}}
{% for message in conversation.messages %}
**{{ message.role | upcase }}**: {{ message.content }}
{% if message.timestamp %}({{ message.timestamp }}){% endif %}

{% endfor %}
`;

try {
    const convData = parse_yaml(conversationWithMeta);

    // Since Fluid uses different syntax, let's create a simpler template
    const simpleTemplate = `
Conversation ID: {{ conversation.metadata.conversation_id }}
Model: {{ conversation.metadata.model }}

System: {{ conversation.system_prompt }}

Messages:
{% for message in conversation.messages %}
Turn {{ message.turn }} - {{ message.role }}: {{ message.content }}
{% endfor %}
`;

    const rendered = render_template(simpleTemplate, convData);
    write(rendered);

    write("✓ Conversation rendering successful!");

} catch (error) {
    write(`✗ Error rendering conversation: ${error.message}`);
}

write("\\n=== Format Recommendations ===");
write("1. **Simple conversations**: Use Format 1 (direct OpenAI API format)");
write("2. **With metadata**: Use Format 2 (includes timestamps, model info)");
write("3. **Educational content**: Use Format 3 (grouped Q&A pairs)");
write("4. **Large conversations**: Consider multi-document YAML with --- separators");