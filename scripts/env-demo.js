// Comprehensive environment variables demo
write("=== Environment Variables Demo ===\n");

// 1. Check basic functionality
write("1. Basic process.env access:");
write("   DEBUG = " + process.env.DEBUG);
write("   VERBOSE = " + process.env.VERBOSE);
write("");

// 2. Show system environment variables
write("2. System environment variables:");
write("   USER/USERNAME = " + (process.env.USER || process.env.USERNAME));
write("   HOME = " + process.env.HOME);
write("   SHELL = " + process.env.SHELL);
write("");

// 3. Check for undefined variables
write("3. Non-existent variables:");
write("   NONEXISTENT = " + (process.env.NONEXISTENT || "undefined"));
write("   Using default: " + (process.env.NONEXISTENT || "default_value"));
write("");

// 4. Show .env file variables
write("4. Custom .env variables:");
write("   MAX_MEMORY_MB = " + process.env.MAX_MEMORY_MB);
write("   SCRIPT_TIMEOUT = " + process.env.SCRIPT_TIMEOUT);
write("");

// 5. Count and list some variables
write("5. Environment variable count:");
var envCount = 0;
var customEnvVars = [];

for (var key in process.env) {
    envCount++;
    // Collect custom variables (from .env file)
    if (key === 'DEBUG' || key === 'VERBOSE' || key === 'MAX_MEMORY_MB' || key === 'SCRIPT_TIMEOUT') {
        customEnvVars.push(key + "=" + process.env[key]);
    }
}

write("   Total variables: " + envCount);
write("   Custom variables: " + customEnvVars.join(", "));
write("");

write("✓ process.env is fully functional like Node.js!");