let states = [
    {
        id: "main",
        onentry: (evt) => {},
        transitions: [
            { event: "someEvent", cond: () => true, target: "someState" }
        ]
    }
]

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
