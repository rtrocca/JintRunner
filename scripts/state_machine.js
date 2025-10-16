// SCXML-style StateMachine implementation for JintRunner
// Based on the state_chart.js pattern

class StateMachine {
    constructor(states, initialState = null) {
        this.states = new Map();
        this.currentState = null;
        this.initialState = initialState;
        this.context = {}; // Shared data context
        this.eventQueue = [];
        this.isRunning = false;
        this.stateHierarchy = new Map(); // Maps child state ID to parent state ID
        this.activeStates = new Set(); // Set of currently active states (compound + current)

        // Initialize states map and hierarchy
        this._initializeStates(states);

        // Set initial state if not provided
        if (!this.initialState && states.length > 0) {
            this.initialState = states[0].id;
        }
    }

    /**
     * Initialize states map and build hierarchy
     * @private
     */
    _initializeStates(states) {
        // First pass: add all states to the map
        states.forEach(state => {
            this.states.set(state.id, state);
            this._addChildStates(state, null);
        });
    }

    /**
     * Recursively add child states and build hierarchy
     * @private
     */
    _addChildStates(state, parentId) {
        if (parentId) {
            this.stateHierarchy.set(state.id, parentId);
        }

        if (state.states && Array.isArray(state.states)) {
            state.states.forEach(childState => {
                this.states.set(childState.id, childState);
                this._addChildStates(childState, state.id);
            });
        }
    }

    /**
     * Get the parent state ID of a given state
     * @param {string} stateId
     * @returns {string|null}
     */
    _getParentState(stateId) {
        return this.stateHierarchy.get(stateId) || null;
    }

    /**
     * Get all ancestor states of a given state (including the state itself)
     * @param {string} stateId
     * @returns {string[]} Array of state IDs from root to current state
     */
    _getAncestorStates(stateId) {
        const ancestors = [];
        let currentId = stateId;

        while (currentId) {
            ancestors.unshift(currentId);
            currentId = this._getParentState(currentId);
        }

        return ancestors;
    }

    /**
     * Check if a state is a compound state (has child states)
     * @param {string} stateId
     * @returns {boolean}
     */
    _isCompoundState(stateId) {
        const state = this.states.get(stateId);
        return state && state.states && Array.isArray(state.states) && state.states.length > 0;
    }

    /**
     * Get the initial child state of a compound state
     * @param {string} compoundStateId
     * @returns {string|null}
     */
    _getInitialChildState(compoundStateId) {
        const state = this.states.get(compoundStateId);
        if (!this._isCompoundState(compoundStateId)) {
            return null;
        }

        return state.states[0].id; // First child is the initial state
    }

    /**
     * Find the deepest atomic (non-compound) state starting from a given state
     * @param {string} stateId
     * @returns {string}
     */
    _findDeepestAtomicState(stateId) {
        let currentState = stateId;

        while (this._isCompoundState(currentState)) {
            currentState = this._getInitialChildState(currentState);
        }

        return currentState;
    }

    /**
     * Start the state machine
     * @returns {Promise<{done: boolean, state?: string, context?: any}>}
     */
    async start() {
        if (this.isRunning) {
            throw new Error("State machine is already running");
        }

        this.isRunning = true;

        // Find the deepest atomic state to start with
        const atomicState = this._findDeepestAtomicState(this.initialState);
        this.currentState = atomicState;

        // Activate all states in the hierarchy
        await this._enterStateHierarchy(atomicState);

        // Check if current state is final
        const state = this.states.get(this.currentState);
        if (state && state.final) {
            this.isRunning = false;
            return {
                done: true,
                state: this.currentState,
                context: this.context
            };
        }

        return {
            done: false,
            state: this.currentState,
            context: this.context
        };
    }

    /**
     * Enter a state hierarchy by executing onentry for all ancestor states
     * @private
     */
    async _enterStateHierarchy(targetStateId) {
        const ancestors = this._getAncestorStates(targetStateId);
        this.activeStates.clear();

        // Execute onentry for each ancestor (parent to child order)
        for (const stateId of ancestors) {
            this.activeStates.add(stateId);
            const state = this.states.get(stateId);
            if (state && state.onentry) {
                await state.onentry(this);
            }
        }
    }

    /**
     * Exit a state hierarchy by executing onexit for specified states
     * @private
     */
    async _exitStateHierarchy(stateIds, event, data) {
        // Execute onexit in reverse order (child to parent)
        for (let i = stateIds.length - 1; i >= 0; i--) {
            const stateId = stateIds[i];
            this.activeStates.delete(stateId);
            const state = this.states.get(stateId);
            if (state && state.onexit) {
                await state.onexit(this, event, data);
            }
        }
    }

    /**
     * Check if an event matches a transition event pattern according to SCXML rules
     * SCXML event matching rules:
     * - Exact match: "click" matches "click"
     * - Prefix match: "click" matches "click.button", "click.button.left", etc.
     * - Wildcard: "*" matches any event
     * @param {string} transitionEvent - The event pattern from the transition
     * @param {string} actualEvent - The actual event being sent
     * @returns {boolean} True if the event matches
     * @private
     */
    _eventMatches(transitionEvent, actualEvent) {
        if (!transitionEvent || !actualEvent) {
            return false;
        }

        // Wildcard matches any event
        if (transitionEvent === "*") {
            return true;
        }

        // Exact match
        if (transitionEvent === actualEvent) {
            return true;
        }

        // SCXML prefix matching: "some.event" matches "some.event.a", "some.event.b", etc.
        // The transition event must be a prefix of the actual event, followed by a dot
        if (actualEvent.startsWith(transitionEvent + ".")) {
            return true;
        }

        return false;
    }

    /**
     * Get available transitions for the current state, respecting hierarchy
     * Child transitions have higher priority than parent transitions
     * @returns {Array} Array of transitions in priority order
     */
    getAvailableTransitions() {
        if (!this.isRunning || !this.currentState) {
            return [];
        }

        const availableTransitions = [];
        const ancestors = this._getAncestorStates(this.currentState);

        // Process states from child to parent (child transitions have higher priority)
        for (let i = ancestors.length - 1; i >= 0; i--) {
            const stateId = ancestors[i];
            const state = this.states.get(stateId);

            if (state && state.transitions && Array.isArray(state.transitions)) {
                availableTransitions.push(...state.transitions.map(transition => ({
                    ...transition,
                    sourceState: stateId
                })));
            }
        }

        return availableTransitions;
    }

    /**
     * Send an event to the state machine
     * @param {string} event - The event to send
     * @param {any} data - Optional data to send with the event
     * @returns {Promise<{done: boolean, state?: string, context?: any, transition?: any}>}
     */
    async send(event, data = null) {
        if (!this.isRunning) {
            throw new Error("State machine is not running. Call start() first.");
        }

        // Get available transitions respecting hierarchy
        const availableTransitions = this.getAvailableTransitions();

        // Find matching transition using SCXML event matching rules
        let matchingTransition = null;
        for (const transition of availableTransitions) {
            // Check if event matches using SCXML rules (if event specified)
            if (transition.event && !this._eventMatches(transition.event, event)) {
                continue;
            }

            // Check condition (if specified)
            if (transition.cond) {
                const conditionResult = await transition.cond(this, event, data);
                if (!conditionResult) {
                    continue;
                }
            }

            matchingTransition = transition;
            break;
        }

        // If no transition found, return current state
        if (!matchingTransition) {
            return {
                done: false,
                state: this.currentState,
                context: this.context,
                transition: null
            };
        }

        // Execute transition
        return await this._executeTransition(matchingTransition, event, data);
    }

    /**
     * Execute a transition
     * @private
     */
    async _executeTransition(transition, event, data) {
        const currentAncestors = this._getAncestorStates(this.currentState);
        const targetState = transition.target;

        if (!targetState) {
            // Internal transition - no state change, just execute actions
            if (transition.actions) {
                for (const action of transition.actions) {
                    if (typeof action === 'function') {
                        await action(this, event, data);
                    }
                }
            }
            return {
                done: false,
                state: this.currentState,
                context: this.context,
                transition: transition
            };
        }

        // Find the deepest atomic state to enter
        const atomicTargetState = this._findDeepestAtomicState(targetState);
        const targetAncestors = this._getAncestorStates(atomicTargetState);

        // Find the Least Common Ancestor (LCA)
        const lca = this._findLeastCommonAncestor(currentAncestors, targetAncestors);

        // Determine which states to exit (from current state up to but excluding LCA)
        // Special case: if target is a sibling (same parent), we still exit the current state
        const statesToExit = [];
        for (const stateId of currentAncestors) {
            if (stateId === lca) break;
            statesToExit.push(stateId);
        }

        // If we haven't exited any states but current and target are different, exit current
        if (statesToExit.length === 0 && this.currentState !== atomicTargetState) {
            statesToExit.push(this.currentState);
        }

        // Exit states that need to be exited (in reverse order - child to parent)
        await this._exitStateHierarchy(statesToExit, event, data);

        // Execute transition actions (if any)
        if (transition.actions) {
            for (const action of transition.actions) {
                if (typeof action === 'function') {
                    await action(this, event, data);
                }
            }
        }

        // Update current state
        this.currentState = atomicTargetState;

        // Determine which states to enter (from LCA down to target, excluding LCA)
        const statesToEnter = [];
        let startAdding = false;

        for (const stateId of targetAncestors) {
            if (stateId === lca) {
                startAdding = true;
                continue;
            }
            if (startAdding) {
                statesToEnter.push(stateId);
            }
        }

        // Enter new states (in order from parent to child)
        for (const stateId of statesToEnter) {
            this.activeStates.add(stateId);
            const state = this.states.get(stateId);
            if (state && state.onentry) {
                await state.onentry(this, event, data);
            }
        }

        // Check if new state is final
        const newState = this.states.get(this.currentState);
        if (newState && newState.final) {
            this.isRunning = false;
            return {
                done: true,
                state: this.currentState,
                context: this.context,
                transition: transition
            };
        }

        return {
            done: false,
            state: this.currentState,
            context: this.context,
            transition: transition
        };
    }

    /**
     * Find the Least Common Ancestor of two state paths
     * @private
     */
    _findLeastCommonAncestor(path1, path2) {
        let lca = null;
        const minLength = Math.min(path1.length, path2.length);

        for (let i = 0; i < minLength; i++) {
            if (path1[i] === path2[i]) {
                lca = path1[i];
            } else {
                break;
            }
        }

        return lca;
    }

    /**
     * Get current state
     * @returns {string}
     */
    getCurrentState() {
        return this.currentState;
    }

    /**
     * Get context data
     * @returns {any}
     */
    getContext() {
        return this.context;
    }

    /**
     * Set context data
     * @param {any} newContext
     */
    setContext(newContext) {
        this.context = newContext;
    }

    /**
     * Update context data (merge)
     * @param {any} updates
     */
    updateContext(updates) {
        this.context = { ...this.context, ...updates };
    }

    /**
     * Check if state machine is running
     * @returns {boolean}
     */
    isActive() {
        return this.isRunning;
    }

    /**
     * Stop the state machine
     */
    stop() {
        this.isRunning = false;
    }

    /**
     * Get state definition
     * @param {string} stateId
     * @returns {any}
     */
    getState(stateId) {
        return this.states.get(stateId);
    }

    /**
     * Check if a state exists
     * @param {string} stateId
     * @returns {boolean}
     */
    hasState(stateId) {
        return this.states.has(stateId);
    }

    /**
     * Get available event names for the current state
     * Returns events in priority order (child transitions first, then parent)
     * Excludes transitions with empty event names
     * @returns {string[]} Array of available event names
     */
    getAvailableEvents() {
        if (!this.isRunning || !this.currentState) {
            return [];
        }

        const availableTransitions = this.getAvailableTransitions();
        const availableEvents = [];
        const seenEvents = new Set();

        // Iterate through transitions in priority order (child to parent)
        for (const transition of availableTransitions) {
            // Skip transitions without event names or with empty event names
            if (!transition.event || transition.event.trim() === '') {
                continue;
            }

            // Avoid duplicates while maintaining order
            if (!seenEvents.has(transition.event)) {
                availableEvents.push(transition.event);
                seenEvents.add(transition.event);
            }
        }

        return availableEvents;
    }
}

// Example usage demonstrating the SCXML-style behavior with compound states and improved event matching
async function demonstrateStateMachine() {
    write("=== SCXML-style StateMachine with Compound States Demo ===");

    // Define states with compound state hierarchy
    const states = [
        {
            id: "parent",
            onentry: async (sm) => {
                write("Entering parent state");
            },
            onexit: async (sm) => {
                write("Exiting parent state");
            },
            states: [
                {
                    id: "child1",
                    onentry: async (sm) => {
                        write("  Entering child1");
                    },
                    onexit: async (sm) => {
                        write("  Exiting child1");
                    },
                    transitions: [
                        { event: "to_child2", target: "child2" }
                    ]
                },
                {
                    id: "child2",
                    onentry: async (sm) => {
                        write("  Entering child2");
                    },
                    onexit: async (sm) => {
                        write("  Exiting child2");
                    }
                }
            ],
            transitions: [
                { event: "to_outside", target: "outside" }
            ]
        },
        {
            id: "outside",
            onentry: async (sm) => {
                write("Entering outside state");
            },
            final: true
        }
    ];

    // Create and run the state machine
    const sm = new StateMachine(states, "parent");

    write("\n1. Starting - should enter parent then child1:");
    let result = await sm.start();
    write(`Current state: ${result.state}, Done: ${result.done}`);
    write(`Available events: [${sm.getAvailableEvents().join(', ')}]`);

    write("\n2. Transition from child1 to child2 (same parent):");
    write("Note: Parent onexit should NOT be called");
    result = await sm.send("to_child2");
    write(`Current state: ${result.state}, Done: ${result.done}`);
    write(`Available events: [${sm.getAvailableEvents().join(', ')}]`);

    write("\n3. Transition from child2 to outside (different hierarchy):");
    write("Note: Parent onexit SHOULD be called");
    result = await sm.send("to_outside");
    write(`Current state: ${result.state}, Done: ${result.done}`);
    write(`Available events: [${sm.getAvailableEvents().join(', ')}]`);

    write("\n=== Compound States Demo completed! ===");
}

// Demo for SCXML event matching
async function demonstrateEventMatching() {
    write("\n\n=== SCXML Event Matching Demo ===");

    // Define states with hierarchical event patterns
    const states = [
        {
            id: "event_test",
            onentry: async (sm) => {
                write("Ready for event matching tests");
            },
            transitions: [
                {
                    event: "user",
                    target: "user_action",
                    actions: [(sm) => write("Matched 'user' event pattern")]
                },
                {
                    event: "system.notify",
                    target: "notification",
                    actions: [(sm) => write("Matched 'system.notify' event pattern")]
                },
                {
                    event: "*",
                    target: "wildcard_handler",
                    actions: [(sm) => write("Matched wildcard '*' pattern")]
                }
            ]
        },
        {
            id: "user_action",
            onentry: async (sm) => {
                write("  Handling user action");
            },
            transitions: [
                { event: "reset", target: "event_test" }
            ]
        },
        {
            id: "notification",
            onentry: async (sm) => {
                write("  Handling notification");
            },
            transitions: [
                { event: "reset", target: "event_test" }
            ]
        },
        {
            id: "wildcard_handler",
            onentry: async (sm) => {
                write("  Handling wildcard event");
            },
            final: true
        }
    ];

    const sm = new StateMachine(states, "event_test");

    write("\n1. Starting event matching demo:");
    await sm.start();
    write(`Current state: ${sm.getCurrentState()}`);

    write("\n2. Testing prefix match - sending 'user.login':");
    write("Should match 'user' pattern (prefix matching)");
    let result = await sm.send("user.login");
    write(`Current state: ${result.state}`);

    await sm.send("reset");

    write("\n3. Testing exact match - sending 'system.notify':");
    write("Should match 'system.notify' pattern (exact matching)");
    result = await sm.send("system.notify");
    write(`Current state: ${result.state}`);

    await sm.send("reset");

    write("\n4. Testing prefix match - sending 'system.notify.warning':");
    write("Should match 'system.notify' pattern (prefix matching)");
    result = await sm.send("system.notify.warning");
    write(`Current state: ${result.state}`);

    await sm.send("reset");

    write("\n5. Testing wildcard - sending 'unknown.event':");
    write("Should match '*' wildcard pattern");
    result = await sm.send("unknown.event");
    write(`Current state: ${result.state}, Done: ${result.done}`);

    write("\n=== Event Matching Demo completed! ===");
}// Run demo
demonstrateStateMachine().catch(err => write("Error: " + err.message));

// Run event matching demo
demonstrateEventMatching().catch(err => write("Error in event matching demo: " + err.message));

// Advanced event matching tests
async function testAdvancedEventMatching() {
    write("\n\n=== Advanced SCXML Event Matching Tests ===");

    const states = [
        {
            id: "test_state",
            transitions: [
                { event: "exact", target: "result1" },
                { event: "prefix.match", target: "result2" },
                { event: "multi.level.deep", target: "result3" },
                { event: "*", target: "wildcard_result" }
            ]
        },
        {
            id: "result1",
            onentry: (sm) => write("  → Exact match result"),
            transitions: [{ event: "reset", target: "test_state" }]
        },
        {
            id: "result2", 
            onentry: (sm) => write("  → Prefix match result"),
            transitions: [{ event: "reset", target: "test_state" }]
        },
        {
            id: "result3",
            onentry: (sm) => write("  → Multi-level match result"),
            transitions: [{ event: "reset", target: "test_state" }]
        },
        {
            id: "wildcard_result",
            onentry: (sm) => write("  → Wildcard match result"),
            transitions: [{ event: "reset", target: "test_state" }]
        }
    ];

    const sm = new StateMachine(states, "test_state");
    await sm.start();

    const testCases = [
        { event: "exact", expected: "result1", description: "Exact match: 'exact'" },
        { event: "prefix.match.extended", expected: "result2", description: "Prefix match: 'prefix.match.extended'" },
        { event: "multi.level.deep.even.deeper", expected: "result3", description: "Prefix match: 'multi.level.deep.even.deeper'" },
        { event: "something.different", expected: "wildcard_result", description: "Wildcard match: 'something.different'" }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        
        write(`\n${i + 1}. ${testCase.description}:`);
        const result = await sm.send(testCase.event);
        const success = result.state === testCase.expected;
        write(`   Expected: ${testCase.expected}, Got: ${result.state} ${success ? '✓' : '✗'}`);
        
        await sm.send("reset");
    }

    // Test edge case - partial prefix should not match
    write("\n5. Edge case - partial prefix 'prefix' should NOT match 'prefix.match':");
    const partialResult = await sm.send("prefix");
    const shouldMatchWildcard = partialResult.state === "wildcard_result";
    write(`   'prefix' should match wildcard, not 'prefix.match': ${shouldMatchWildcard ? '✓' : '✗'}`);

    write("\n=== Advanced Event Matching Tests Completed! ===");
}

testAdvancedEventMatching().catch(err => write("Error in advanced tests: " + err.message));

// Additional comprehensive test for getAvailableEvents()
async function testAvailableEvents() {
    write("\n\n=== Testing getAvailableEvents() Method ===");

    // Define states with various transition scenarios
    const states = [
        {
            id: "complex_state",
            transitions: [
                { event: "first", target: "state2" },      // Priority 1
                { event: "", target: "state2" },           // Empty event (should be filtered)
                { event: "second", target: "state3" },     // Priority 2
                { event: "first", target: "state4" },      // Duplicate (should be filtered)
                { target: "state5" },                      // No event (should be filtered)
                { event: "   ", target: "state6" },        // Whitespace only (should be filtered)
                { event: "third", target: "state7" },      // Priority 3
                { event: "second", target: "state8" },     // Duplicate (should be filtered)
            ]
        },
        {
            id: "no_transitions",
            // No transitions array
        },
        {
            id: "empty_transitions",
            transitions: []
        },
        {
            id: "only_empty_events",
            transitions: [
                { event: "", target: "somewhere" },
                { target: "somewhere_else" },
                { event: "   ", target: "another_place" }
            ]
        }
    ];

    const sm = new StateMachine(states, "complex_state");
    await sm.start();

    write("\n1. Complex state with mixed transitions:");
    write(`Current state: ${sm.getCurrentState()}`);
    const events = sm.getAvailableEvents();
    write(`Available events: [${events.join(', ')}]`);
    write(`Expected: [first, second, third] (priority order, no duplicates, no empty)`);
    write(`✓ Correct: ${JSON.stringify(events) === JSON.stringify(['first', 'second', 'third'])}`);

    // Test state with no transitions
    sm.currentState = "no_transitions";
    write("\n2. State with no transitions:");
    write(`Current state: ${sm.getCurrentState()}`);
    const noEvents = sm.getAvailableEvents();
    write(`Available events: [${noEvents.join(', ')}]`);
    write(`Expected: [] (empty array)`);
    write(`✓ Correct: ${noEvents.length === 0}`);

    // Test state with empty transitions array
    sm.currentState = "empty_transitions";
    write("\n3. State with empty transitions array:");
    write(`Current state: ${sm.getCurrentState()}`);
    const emptyEvents = sm.getAvailableEvents();
    write(`Available events: [${emptyEvents.join(', ')}]`);
    write(`Expected: [] (empty array)`);
    write(`✓ Correct: ${emptyEvents.length === 0}`);

    // Test state with only empty/invalid events
    sm.currentState = "only_empty_events";
    write("\n4. State with only empty/invalid events:");
    write(`Current state: ${sm.getCurrentState()}`);
    const onlyEmptyEvents = sm.getAvailableEvents();
    write(`Available events: [${onlyEmptyEvents.join(', ')}]`);
    write(`Expected: [] (all filtered out)`);
    write(`✓ Correct: ${onlyEmptyEvents.length === 0}`);

    // Test when machine is not running
    sm.stop();
    write("\n5. Machine not running:");
    write(`Is running: ${sm.isActive()}`);
    const notRunningEvents = sm.getAvailableEvents();
    write(`Available events: [${notRunningEvents.join(', ')}]`);
    write(`Expected: [] (machine not running)`);
    write(`✓ Correct: ${notRunningEvents.length === 0}`);

    write("\n=== All getAvailableEvents() tests completed! ===");
}

// Run the additional test
testAvailableEvents().catch(err => write("Error in test: " + err.message));