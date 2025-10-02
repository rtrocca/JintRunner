// Test bot with invalid handler
write("Testing invalid handler registration");

// Try to register a string instead of a function
register("message", "this is not a function");

// Try to register a number
register("other", 123);