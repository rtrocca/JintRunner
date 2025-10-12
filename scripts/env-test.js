// Test script to verify process.env is available
write("Testing process.env...");

// Check if process exists
if (typeof process !== 'undefined') {
    write("✓ process object is available");

    // Check if process.env exists
    if (typeof process.env !== 'undefined') {
        write("✓ process.env is available");

        // Show some environment variables
        write("Environment variables:");
        write("- DEBUG: " + (process.env.DEBUG || "not set"));
        write("- VERBOSE: " + (process.env.VERBOSE || "not set"));
        write("- PATH exists: " + (process.env.PATH ? "yes" : "no"));
        write("- HOME exists: " + (process.env.HOME ? "yes" : "no"));

        // Count total environment variables
        var count = 0;
        for (var key in process.env) {
            count++;
        }
        write("- Total environment variables: " + count);
    } else {
        write("✗ process.env is not available");
    }
} else {
    write("✗ process object is not available");
}