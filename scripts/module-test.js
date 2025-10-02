// Test script that loads shared utilities
write("Loading shared utilities...");

// Load the shared utilities script
loadScript("shared-utils.js");

write("Testing shared utility functions:");

// Test the functions from shared-utils.js
try {
    if (typeof SharedUtils !== 'undefined') {
        write("✓ SharedUtils loaded successfully");
        
        // Test greetUser function
        var greeting = SharedUtils.greetUser("Alice");
        write("Greeting test: " + greeting);
        
        // Test randomChoice function
        var colors = ["red", "blue", "green", "yellow", "purple"];
        var randomColor = SharedUtils.randomChoice(colors);
        write("Random color: " + randomColor);
        
        // Test formatTime function (though it might not work perfectly in Jint)
        try {
            var timeStr = SharedUtils.formatTime(new Date());
            write("Current time: " + timeStr);
        } catch (timeError) {
            write("Time formatting failed: " + timeError.message);
        }
    } else {
        write("✗ SharedUtils not available");
    }
} catch (error) {
    write("Error testing utilities: " + error.message);
}

register("message", function(eventData) {
    var userText = eventData.data.text.toLowerCase().trim();
    
    if (userText === "greet") {
        if (typeof SharedUtils !== 'undefined') {
            write(SharedUtils.greetUser("User"));
        } else {
            write("Utilities not loaded");
        }
    } else if (userText === "random") {
        if (typeof SharedUtils !== 'undefined') {
            var items = ["apple", "banana", "cherry", "date", "elderberry"];
            write("Random fruit: " + SharedUtils.randomChoice(items));
        } else {
            write("Utilities not loaded");
        }
    } else {
        write("Try 'greet' or 'random' commands");
    }
});