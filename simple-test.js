// Simple test bot
write("Simple bot started");

function messageHandler(evt) {
    write("Received: " + evt.data.text);
}

register("message", messageHandler);