// Example bot that uses environment variables for configuration
write("🤖 Environment-aware Bot Starting...");

// Configuration from environment variables
var config = {
    botName: process.env.BOT_NAME || "JintBot",
    debugMode: process.env.DEBUG === "true",
    maxMemoryMB: parseInt(process.env.MAX_MEMORY_MB) || 128,
    timeout: parseInt(process.env.SCRIPT_TIMEOUT) || 10000,
    environment: process.env.NODE_ENV || "development"
};

write("Bot Configuration:");
write("- Name: " + config.botName);
write("- Debug Mode: " + config.debugMode);
write("- Max Memory: " + config.maxMemoryMB + "MB");
write("- Timeout: " + config.timeout + "ms");
write("- Environment: " + config.environment);
write("");

// Bot message handler
register("message", function (eventData) {
    var userText = eventData.data.text.toLowerCase().trim();

    if (config.debugMode) {
        write("[DEBUG] Received message: " + userText);
    }

    if (userText === "config" || userText === "settings") {
        write("🔧 Current Configuration:");
        write("- Bot Name: " + config.botName);
        write("- Debug: " + (config.debugMode ? "ON" : "OFF"));
        write("- Memory Limit: " + config.maxMemoryMB + "MB");
        write("- User: " + (process.env.USER || "unknown"));
        write("- Home Directory: " + process.env.HOME);
    }
    else if (userText === "env") {
        write("🌍 Environment Info:");
        write("- Shell: " + process.env.SHELL);
        write("- PATH exists: " + (process.env.PATH ? "yes" : "no"));
        write("- Total env vars: " + Object.keys(process.env).length);
    }
    else if (userText === "hello" || userText === "hi") {
        write("Hello! I'm " + config.botName + " running in " + config.environment + " mode.");
        if (config.debugMode) {
            write("Debug mode is enabled - I'll show extra information.");
        }
    }
    else {
        write("Try saying: hello, config, env");
    }
});

write(config.botName + " is ready! Type 'hello', 'config', or 'env' to interact.");