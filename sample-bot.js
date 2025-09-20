// Sample bot script for JintRunner
// This bot responds to user messages with simple interactions

write("Hello! I'm your JavaScript-powered bot assistant.");
write("Type 'hello' to greet me, 'joke' for a joke, or 'help' for available commands.");

register("message", function(eventData) {
    try {
        var userText = eventData.data.text.toLowerCase().trim();
        
        if (userText === "hello" || userText === "hi") {
            write("Hello there! Nice to meet you!");
        }
        else if (userText === "joke") {
            var jokes = [
                "Why don't scientists trust atoms? Because they make up everything!",
                "Why did the JavaScript developer go broke? Because he used up all his cache!",
                "What do you call a programmer from Finland? Nerdic!",
                "Why do programmers prefer dark mode? Because light attracts bugs!"
            ];
            var randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
            write(randomJoke);
        }
        else if (userText === "help") {
            write("Available commands:");
            write("- hello/hi: Greet the bot");
            write("- joke: Get a random joke");
            write("- time: Get current time");
            write("- echo <text>: Echo back your text");
            write("- help: Show this help message");
            write("- exit/quit: Exit the chat");
        }
        else if (userText === "time") {
            write("I'm a JavaScript bot, but I can't access the system time directly.");
            write("You'd need to extend the .NET host with a time function!");
        }
        else if (userText.startsWith("echo ")) {
            var echoText = eventData.data.text.substring(5);
            write("You said: " + echoText);
        }
        else if (userText === "exit" || userText === "quit") {
            write("Goodbye! Thanks for chatting with me!");
        }
        else {
            write("I didn't understand that. Type 'help' to see available commands.");
        }
    } catch (error) {
        write("Error in message handler: " + error.message);
    }
});