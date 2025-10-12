class StateMachine {
    constructor(states) {
        this.states = states;
        this.currentState = null;
        this.eventQueue = [];
    }


    async run(event) {
        if (this.currentState === null) {
            await this._transitionTo(this.states[0]);
        }

        this.eventQueue.push(event);

        while (this.eventQueue.length > 0) {
            let currentEvent = this.eventQueue.shift();
            /// let validTransitions = this.currentState.transitions.filter(t => t.event === currentEvent);

        }

    }

    // Wrapper function so that in the future we can support compound states
    getStateById(id) {
        return this.states.find(s => s.id === id);
    }

    async _transitionTo(state) {
        this.currentState = state;
        if (this.currentState.onentry) {
            await this.currentState.onentry();
        }

        let stateLessTransitions = this._getEventlessTransitions();
        if (stateLessTransitions.length > 0) {
            return this._transitionTo(this.getStateById(stateLessTransitions[0].target));
        }

        if (this.currentState.isFinal) {
            console.log("State machine reached final state.");
            return;
        }
    }

    _getEventlessTransitions() {
        if (!this.currentState) return [];
        return this.currentState.transitions.filter(t => !t.event);
    }

}

let sm = new StateMachine([
    {
        id: "start",
        onentry: async () => {
            console.log("Entering start state");
        },
        transitions: [
            { target: "next" }
        ]
    },
    {
        id: "next",
        onentry: async () => {
            console.log("In next state, going to final");
        },
        transitions: [
            { target: "final" }
        ]
    },
    {
        id: "final",
        isFinal: true,
        onentry: async () => {
            console.log("Reached final state, stopping.");
        }
    }
])