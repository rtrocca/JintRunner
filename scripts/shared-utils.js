// Helper functions that could be shared across scripts
function greetUser(name) {
    return "Hello, " + name + "! Welcome to the bot.";
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function formatTime(date) {
    return date.toLocaleTimeString();
}

// Export-like pattern (since we don't have real modules)
var SharedUtils = {
    greetUser: greetUser,
    randomChoice: randomChoice,
    formatTime: formatTime
};