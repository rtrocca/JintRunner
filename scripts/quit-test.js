// Test script for quit function
write("Testing quit function in different modes");

register("message", function(eventData) {
    var userText = eventData.data.text.toLowerCase().trim();
    
    if (userText === "quit now") {
        write("Calling quit function...");
        quit();
    } else {
        write("Type 'quit now' to test the quit function");
    }
});