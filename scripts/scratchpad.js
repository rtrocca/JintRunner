let states = [
    {
        id: "main",
        onentry: (evt) => {},
        transitions: [
            { event: "someEvent", cond: () => true, target: "someState" }
        ]
    }
]

// Allow to call on("message", handler) multiple times, so that the handle can change dynamically.
on("message", (evt) => {
    llm.process(evt.data.text, history)
    llm.on("response", (response) => {
        write(response)
    });
});

on("tool", (evt) => {
    write("Tool invoked: " + evt.data.name);
    write("With arguments: " + JSON.stringify(evt.data.args));
    return { result: "Tool execution result" };
});


// Example of registering a tool
// TODO: what's the scope of this registration? In SCXML I can have a "local" registration
// unregister?
// make it part of the session?

register_tool({
    name: "getCurrentTime",
    description: "Get the current system time",
    parameters: {},
    execute: () => {
        return new Date().toString();
    }
})

// Mimic the sessionStorage API, at least partially
sessionStorage.clear()
sessionStorage.setItem("state", "main")
sessionStorage.getItem("state")