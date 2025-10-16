
let states = [{
    id: "start",
    invoke: { id: "someId", src: "someService", type: "someType", params: { someParam: "someValue" } },
    onentry: async (sm) => {
        console.log("Entering start state");
    },

    onexit: async (sm) => {

    },

    transitions: [
        { target: "next", cond: (sm) => true, event: "go" }]
}]

let sm = new StateMachine(states);
let result = await sm.start();
while (!result.done) {
    result = await sm.send("go");
}